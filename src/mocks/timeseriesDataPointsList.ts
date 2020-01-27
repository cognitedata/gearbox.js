import {
  DatapointsGetAggregateDatapoint,
  DatapointsGetDoubleDatapoint,
  GetAggregateDatapoint,
} from '@cognite/sdk';
import { MockChartDataConfig } from '.';

export const defaultConf: MockChartDataConfig = {
  id: 0,
  min: 0,
  max: 150,
  continousDeviation: 3,
  peakDeviation: 30,
};

export function getRandomdata(
  id: number,
  start: number,
  end: number,
  n: number,
  granularity?: number,
  config?: MockChartDataConfig[]
) {
  const conf = config ? getConfig(config, id) : defaultConf;
  const resultDataPoints = randomData(start, end, n, conf, granularity);
  return insertPeakPoints(resultDataPoints, conf);
}

function getConfig(config: MockChartDataConfig[], id: number) {
  const configuration = config.find(conf => conf.id === id);
  return configuration ? configuration : defaultConf;
}

function insertPeakPoints(
  resultDataPoints: DatapointsGetAggregateDatapoint,
  config: MockChartDataConfig
) {
  const {
    positivePeakPoints = 0,
    negativePeakPoints = 0,
    peakDeviation,
  } = config;

  const resultDataPointsArr = { ...resultDataPoints };
  const { datapoints: datapointListProp } = resultDataPointsArr;
  const datapointList = [...datapointListProp];
  const randomIndexesList = generateRandomIndexesList(
    datapointList.length - 1,
    positivePeakPoints + negativePeakPoints
  );

  let positiveDPsVal = positivePeakPoints;
  while (positiveDPsVal !== 0) {
    const index = randomIndexesList.pop() || 0;
    const dp = datapointList[index];
    datapointList[index] = addPeakDeviation(dp, peakDeviation);
    positiveDPsVal -= 1;
  }

  let negativeDPsVal = negativePeakPoints;
  while (negativeDPsVal !== 0) {
    const index = randomIndexesList.pop() || 0;
    const dp = datapointList[index];
    datapointList[index] = substractPeakDeviation(dp, peakDeviation);
    negativeDPsVal -= 1;
  }
  resultDataPointsArr.datapoints = datapointList;
  return resultDataPointsArr;
}

function addPeakDeviation(dp: GetAggregateDatapoint, peakDeviation: number) {
  const dataPoint = { ...dp };
  dataPoint.average = dataPoint.average
    ? dataPoint.average + peakDeviation
    : undefined;
  dataPoint.min = dataPoint.min ? dataPoint.min + peakDeviation : undefined;
  dataPoint.max = dataPoint.max ? dataPoint.max + peakDeviation : undefined;
  return dataPoint;
}

function substractPeakDeviation(
  dp: GetAggregateDatapoint,
  peakDeviation: number
) {
  const dataPoint = { ...dp };
  dataPoint.average = dataPoint.average
    ? dataPoint.average - peakDeviation
    : undefined;
  dataPoint.min = dataPoint.min ? dataPoint.min - peakDeviation : undefined;
  dataPoint.max = dataPoint.max ? dataPoint.max - peakDeviation : undefined;
  return dataPoint;
}

function generateRandomIndexesList(
  maxRandomNumber: number,
  numberOfRandomIndexes: number
) {
  const randomIndexSet = new Set<number>();
  while (randomIndexSet.size !== numberOfRandomIndexes) {
    randomIndexSet.add(Math.floor(Math.random() * maxRandomNumber) + 1);
  }
  return [...randomIndexSet];
}

export function randomDataZoomable(
  start: number,
  end: number,
  n: number,
  granularity?: number
): DatapointsGetAggregateDatapoint {
  const data = [];

  const dt = granularity ? granularity : (end - start) / n;

  for (let i = start + dt; i <= end; i += dt) {
    const values = [0, 0, 0]
      .map(
        () =>
          Math.sin(i / 20) * 50 +
          Math.cos(Math.PI - i / 40) * 50 +
          Math.random() * 40
      )
      .sort((a: number, b: number) => a - b);
    data.push({
      timestamp: new Date(i),
      average: values[1],
      min: values[0],
      max: values[2],
      count: 7000,
    });
  }

  return { datapoints: data, id: 1337 };
}

export function randomData(
  start: number,
  end: number,
  n: number,
  config: MockChartDataConfig,
  granularity?: number
): DatapointsGetAggregateDatapoint {
  const data = [];
  const { min, max, continousDeviation } = config;
  const dt = granularity ? granularity : (end - start) / n;
  let prevMax = (min + max) / 2;
  for (let i = start; i <= end; i += dt) {
    const values = getRandomDeviation(min, max, continousDeviation, prevMax);
    prevMax = values[2];
    data.push({
      timestamp: new Date(i),
      average: values[1],
      min: values[0],
      max: values[2],
      count: 7000,
    });
  }

  return { datapoints: data, id: 1337 };
}

function getRandomDeviation(
  min: number,
  max: number,
  continuousDeviation: number,
  prevMax: number
): number[] {
  let maxNum = generateRandomDeviatedNumber(prevMax, continuousDeviation);
  maxNum = maxNum > max ? max : maxNum;
  maxNum =
    maxNum < min + continuousDeviation ? maxNum + continuousDeviation : maxNum;
  const minNum = maxNum - continuousDeviation;
  const average = (maxNum + minNum) / 2;
  return [minNum, average, maxNum];
}

function generateRandomDeviatedNumber(
  prev: number,
  continousDevition: number
): number {
  return parseFloat(
    ((Math.random() < 0.5 ? -1 : 1) * continousDevition + prev).toFixed(2)
  );
}

export const randomLatestDatapoint = (
  id = 0,
  name = 'Timeseries 0'
): DatapointsGetDoubleDatapoint => {
  return {
    isString: false,
    isStep: false,
    id,
    externalId: name,
    datapoints: [
      {
        timestamp: new Date(),
        value: Math.floor(Math.random() * 10000) / 100,
      },
    ],
  } as DatapointsGetDoubleDatapoint;
};

export const datapoints = [
  {
    timestamp: 1552726800000,
    average: 36.26105251209135,
    max: 37.766841888427734,
    min: 34.94010925292969,
    count: 7013,
  },
  {
    timestamp: 1552734000000,
    average: 36.2421327365039,
    max: 37.60814666748047,
    min: 34.77988815307617,
    count: 7050,
  },
  {
    timestamp: 1552741200000,
    average: 36.25444460499997,
    max: 37.713436126708984,
    min: 34.55023956298828,
    count: 7038,
  },
  {
    timestamp: 1552748400000,
    average: 36.24869527997605,
    max: 37.801937103271484,
    min: 34.65705490112305,
    count: 7033,
  },
  {
    timestamp: 1552755600000,
    average: 36.22455261011294,
    max: 37.713436126708984,
    min: 34.8325309753418,
    count: 7011,
  },
  {
    timestamp: 1552762800000,
    average: 36.2363688792499,
    max: 37.69588851928711,
    min: 34.51514434814453,
    count: 6979,
  },
  {
    timestamp: 1552770000000,
    average: 36.24616141605307,
    max: 37.837032318115234,
    min: 34.79743576049805,
    count: 7027,
  },
  {
    timestamp: 1552777200000,
    average: 36.24478563971834,
    max: 37.74929428100586,
    min: 34.532691955566406,
    count: 7034,
  },
  {
    timestamp: 1552784400000,
    average: 36.24596600346106,
    max: 37.713436126708984,
    min: 34.92256164550781,
    count: 7028,
  },
  {
    timestamp: 1552791600000,
    average: 36.25012840587013,
    max: 37.766841888427734,
    min: 34.8325309753418,
    count: 7046,
  },
  {
    timestamp: 1552798800000,
    average: 36.24060182222004,
    max: 37.643245697021484,
    min: 34.74479293823242,
    count: 6981,
  },
  {
    timestamp: 1552806000000,
    average: 36.24713123119955,
    max: 37.801937103271484,
    min: 34.81498336791992,
    count: 7028,
  },
  {
    timestamp: 1552813200000,
    average: 36.244043748560905,
    max: 37.66079330444336,
    min: 34.7623405456543,
    count: 7048,
  },
  {
    timestamp: 1552820400000,
    average: 36.246425386294696,
    max: 37.926300048828125,
    min: 34.88746643066406,
    count: 7057,
  },
  {
    timestamp: 1552827600000,
    average: 36.22428899823458,
    max: 37.73098373413086,
    min: 34.97520446777344,
    count: 7026,
  },
  {
    timestamp: 1552834800000,
    average: 36.24953317851933,
    max: 37.713436126708984,
    min: 34.81498336791992,
    count: 7029,
  },
  {
    timestamp: 1552842000000,
    average: 36.23799244723312,
    max: 37.678340911865234,
    min: 34.85007858276367,
    count: 7036,
  },
  {
    timestamp: 1552849200000,
    average: 36.22876172004875,
    max: 37.801937103271484,
    min: 34.86762619018555,
    count: 7009,
  },
  {
    timestamp: 1552856400000,
    average: 36.26087880146561,
    max: 37.66079330444336,
    min: 34.77988815307617,
    count: 7042,
  },
  {
    timestamp: 1552863600000,
    average: 36.24562080248611,
    max: 37.713436126708984,
    min: 34.79743576049805,
    count: 7043,
  },
  {
    timestamp: 1552870800000,
    average: 36.258762753081236,
    max: 37.926300048828125,
    min: 34.58686065673828,
    count: 7062,
  },
  {
    timestamp: 1552878000000,
    average: 36.23204662104558,
    max: 37.90875244140625,
    min: 34.85007858276367,
    count: 7063,
  },
  {
    timestamp: 1552885200000,
    average: 36.25669088329236,
    max: 37.78438949584961,
    min: 34.497596740722656,
    count: 6971,
  },
  {
    timestamp: 1552892400000,
    average: 36.27101549627985,
    max: 37.94384765625,
    min: 34.86762619018555,
    count: 6916,
  },
  {
    timestamp: 1552899600000,
    average: 36.25596138882702,
    max: 37.90875244140625,
    min: 34.77988815307617,
    count: 7008,
  },
  {
    timestamp: 1552906800000,
    average: 36.23396467928033,
    max: 37.66079330444336,
    min: 34.462501525878906,
    count: 7044,
  },
  {
    timestamp: 1552914000000,
    average: 36.26867014718358,
    max: 37.891204833984375,
    min: 34.81498336791992,
    count: 6967,
  },
  {
    timestamp: 1552921200000,
    average: 36.25873796187401,
    max: 37.926300048828125,
    min: 34.8325309753418,
    count: 6954,
  },
  {
    timestamp: 1552928400000,
    average: 36.24198757025512,
    max: 37.766841888427734,
    min: 34.81498336791992,
    count: 6913,
  },
  {
    timestamp: 1552935600000,
    average: 36.24245835404304,
    max: 37.766841888427734,
    min: 34.88746643066406,
    count: 7022,
  },
  {
    timestamp: 1552942800000,
    average: 36.239907558501066,
    max: 37.74929428100586,
    min: 34.532691955566406,
    count: 7039,
  },
  {
    timestamp: 1552950000000,
    average: 36.21762895409708,
    max: 37.837032318115234,
    min: 34.81498336791992,
    count: 6978,
  },
  {
    timestamp: 1552957200000,
    average: 36.23553824374955,
    max: 37.801937103271484,
    min: 34.74479293823242,
    count: 6978,
  },
  {
    timestamp: 1552964400000,
    average: 36.24187421993342,
    max: 37.837032318115234,
    min: 34.58686065673828,
    count: 7020,
  },
  {
    timestamp: 1552971600000,
    average: 36.238683588797485,
    max: 37.60814666748047,
    min: 34.62195587158203,
    count: 7005,
  },
  {
    timestamp: 1552978800000,
    average: 36.24011812362641,
    max: 37.60814666748047,
    min: 34.67460250854492,
    count: 6979,
  },
  {
    timestamp: 1552986000000,
    average: 36.259368158969274,
    max: 37.78438949584961,
    min: 34.85007858276367,
    count: 6986,
  },
  {
    timestamp: 1552993200000,
    average: 36.26471504850019,
    max: 37.713436126708984,
    min: 34.95765686035156,
    count: 6994,
  },
  {
    timestamp: 1553000400000,
    average: 36.24294664048408,
    max: 37.73098373413086,
    min: 34.72724533081055,
    count: 6950,
  },
  {
    timestamp: 1553007600000,
    average: 36.24963854796773,
    max: 37.801937103271484,
    min: 34.63950729370117,
    count: 6999,
  },
  {
    timestamp: 1553014800000,
    average: 36.248186393110046,
    max: 37.678340911865234,
    min: 34.77988815307617,
    count: 6936,
  },
  {
    timestamp: 1553022000000,
    average: 36.24654497136758,
    max: 37.713436126708984,
    min: 34.79743576049805,
    count: 6956,
  },
  {
    timestamp: 1553029200000,
    average: 36.2515016094906,
    max: 37.66079330444336,
    min: 34.81498336791992,
    count: 6972,
  },
  {
    timestamp: 1553036400000,
    average: 36.23724513954136,
    max: 37.713436126708984,
    min: 34.81498336791992,
    count: 7000,
  },
  {
    timestamp: 1553043600000,
    average: 36.22832636476337,
    max: 37.62569808959961,
    min: 34.569313049316406,
    count: 6925,
  },
  {
    timestamp: 1553050800000,
    average: 36.21306683587529,
    max: 37.520408630371094,
    min: 34.8325309753418,
    count: 7005,
  },
  {
    timestamp: 1553058000000,
    average: 36.23065596710185,
    max: 37.78438949584961,
    min: 34.7623405456543,
    count: 7009,
  },
  {
    timestamp: 1553065200000,
    average: 36.234895222920734,
    max: 37.713436126708984,
    min: 34.63950729370117,
    count: 6999,
  },
  {
    timestamp: 1553072400000,
    average: 36.229196582304986,
    max: 37.590599060058594,
    min: 34.79743576049805,
    count: 6967,
  },
  {
    timestamp: 1553079600000,
    average: 36.21948069529325,
    max: 37.81948471069336,
    min: 34.67460250854492,
    count: 6990,
  },
  {
    timestamp: 1553086800000,
    average: 36.23004090789788,
    max: 37.57305145263672,
    min: 34.58686065673828,
    count: 6890,
  },
  {
    timestamp: 1553094000000,
    average: 36.25265455908482,
    max: 37.66079330444336,
    min: 34.88746643066406,
    count: 6909,
  },
  {
    timestamp: 1553101200000,
    average: 36.231201777469025,
    max: 37.555503845214844,
    min: 34.8325309753418,
    count: 7010,
  },
  {
    timestamp: 1553108400000,
    average: 36.24831469808846,
    max: 37.69588851928711,
    min: 34.6921501159668,
    count: 7036,
  },
  {
    timestamp: 1553115600000,
    average: 36.228241324148094,
    max: 37.766841888427734,
    min: 34.63950729370117,
    count: 7026,
  },
  {
    timestamp: 1553122800000,
    average: 36.23238181887141,
    max: 37.713436126708984,
    min: 34.85007858276367,
    count: 7002,
  },
  {
    timestamp: 1553130000000,
    average: 36.229296994634495,
    max: 37.78438949584961,
    min: 34.86762619018555,
    count: 7010,
  },
  {
    timestamp: 1553137200000,
    average: 36.22589407603139,
    max: 37.69588851928711,
    min: 34.74479293823242,
    count: 7037,
  },
  {
    timestamp: 1553144400000,
    average: 36.22671402798806,
    max: 37.643245697021484,
    min: 34.70969772338867,
    count: 7048,
  },
  {
    timestamp: 1553151600000,
    average: 36.22251553637964,
    max: 37.766841888427734,
    min: 34.79743576049805,
    count: 7029,
  },
  {
    timestamp: 1553158800000,
    average: 36.23618108272635,
    max: 37.69588851928711,
    min: 34.7623405456543,
    count: 7047,
  },
  {
    timestamp: 1553166000000,
    average: 36.21733171302329,
    max: 37.713436126708984,
    min: 34.62195587158203,
    count: 6967,
  },
  {
    timestamp: 1553173200000,
    average: 36.233535009180855,
    max: 37.837032318115234,
    min: 34.86762619018555,
    count: 6854,
  },
  {
    timestamp: 1553180400000,
    average: 36.231836050322634,
    max: 38.0140380859375,
    min: 34.63950729370117,
    count: 6955,
  },
  {
    timestamp: 1553187600000,
    average: 36.23306684643582,
    max: 37.90875244140625,
    min: 34.90501403808594,
    count: 7033,
  },
  {
    timestamp: 1553194800000,
    average: 36.24993089896775,
    max: 37.643245697021484,
    min: 34.67460250854492,
    count: 7013,
  },
  {
    timestamp: 1553202000000,
    average: 36.260642387019864,
    max: 37.766841888427734,
    min: 34.65705490112305,
    count: 7027,
  },
  {
    timestamp: 1553209200000,
    average: 36.27158218546811,
    max: 37.713436126708984,
    min: 34.7623405456543,
    count: 6990,
  },
  {
    timestamp: 1553216400000,
    average: 36.2493275670984,
    max: 37.713436126708984,
    min: 34.72724533081055,
    count: 7036,
  },
  {
    timestamp: 1553223600000,
    average: 36.26734209568971,
    max: 37.766841888427734,
    min: 34.90501403808594,
    count: 7036,
  },
  {
    timestamp: 1553230800000,
    average: 36.247270172698705,
    max: 37.643245697021484,
    min: 34.7623405456543,
    count: 7011,
  },
  {
    timestamp: 1553238000000,
    average: 36.247292382379975,
    max: 37.678340911865234,
    min: 34.65705490112305,
    count: 7041,
  },
  {
    timestamp: 1553245200000,
    average: 36.26214491867183,
    max: 37.97894287109375,
    min: 34.85007858276367,
    count: 6945,
  },
  {
    timestamp: 1553252400000,
    average: 36.23373285202959,
    max: 37.590599060058594,
    min: 34.77988815307617,
    count: 7032,
  },
  {
    timestamp: 1553259600000,
    average: 36.22581611580903,
    max: 37.643245697021484,
    min: 34.62195587158203,
    count: 7017,
  },
  {
    timestamp: 1553266800000,
    average: 36.25917358223469,
    max: 38.0140380859375,
    min: 34.94010925292969,
    count: 7038,
  },
  {
    timestamp: 1553274000000,
    average: 36.222218377630696,
    max: 37.766841888427734,
    min: 34.569313049316406,
    count: 7020,
  },
  {
    timestamp: 1553281200000,
    average: 36.234942764672496,
    max: 38.084228515625,
    min: 34.48004913330078,
    count: 7023,
  },
  {
    timestamp: 1553288400000,
    average: 36.23843961413021,
    max: 37.81948471069336,
    min: 34.55023956298828,
    count: 7023,
  },
  {
    timestamp: 1553295600000,
    average: 36.23678472973279,
    max: 37.69588851928711,
    min: 34.6921501159668,
    count: 6987,
  },
  {
    timestamp: 1553302800000,
    average: 36.20438131782346,
    max: 37.713436126708984,
    min: 34.462501525878906,
    count: 7020,
  },
  {
    timestamp: 1553310000000,
    average: 36.2158352083674,
    max: 37.837032318115234,
    min: 34.8325309753418,
    count: 6982,
  },
  {
    timestamp: 1553317200000,
    average: 36.26947556370798,
    max: 37.590599060058594,
    min: 34.86762619018555,
    count: 6611,
  },
  {
    timestamp: 1553324400000,
    average: 36.20888514446939,
    max: 37.66079330444336,
    min: 34.497596740722656,
    count: 7028,
  },
  {
    timestamp: 1553331600000,
    average: 36.21084110794277,
    max: 37.85610580444336,
    min: 34.81498336791992,
    count: 6804,
  },
  {
    timestamp: 1553338800000,
    average: 36.21671176479847,
    max: 37.74929428100586,
    min: 34.77988815307617,
    count: 7031,
  },
  {
    timestamp: 1553346000000,
    average: 36.22769187752437,
    max: 37.643245697021484,
    min: 34.70969772338867,
    count: 7023,
  },
  {
    timestamp: 1553353200000,
    average: 36.22620364964919,
    max: 37.643245697021484,
    min: 34.81498336791992,
    count: 7041,
  },
  {
    timestamp: 1553360400000,
    average: 36.22048376248307,
    max: 37.85610580444336,
    min: 34.7623405456543,
    count: 7022,
  },
  {
    timestamp: 1553367600000,
    average: 36.22311780875223,
    max: 37.78438949584961,
    min: 34.88746643066406,
    count: 7038,
  },
  {
    timestamp: 1553374800000,
    average: 36.24482005812728,
    max: 37.891204833984375,
    min: 34.74479293823242,
    count: 7031,
  },
  {
    timestamp: 1553382000000,
    average: 36.21682111254495,
    max: 37.766841888427734,
    min: 34.92256164550781,
    count: 7028,
  },
  {
    timestamp: 1553389200000,
    average: 36.23066459605694,
    max: 37.837032318115234,
    min: 34.81498336791992,
    count: 7013,
  },
  {
    timestamp: 1553396400000,
    average: 36.22842098591332,
    max: 37.60814666748047,
    min: 34.79743576049805,
    count: 7005,
  },
  {
    timestamp: 1553403600000,
    average: 36.22852592095571,
    max: 37.69588851928711,
    min: 34.92256164550781,
    count: 6968,
  },
  {
    timestamp: 1553410800000,
    average: 36.25787163455646,
    max: 37.78438949584961,
    min: 34.74479293823242,
    count: 6948,
  },
  {
    timestamp: 1553418000000,
    average: 36.25185578029957,
    max: 37.643245697021484,
    min: 34.79743576049805,
    count: 7048,
  },
  {
    timestamp: 1553425200000,
    average: 36.245702675011685,
    max: 38.13687515258789,
    min: 34.79743576049805,
    count: 7028,
  },
  {
    timestamp: 1553432400000,
    average: 36.258929111971455,
    max: 37.69588851928711,
    min: 34.6921501159668,
    count: 7047,
  },
  {
    timestamp: 1553439600000,
    average: 36.23445226018924,
    max: 37.873653411865234,
    min: 34.8325309753418,
    count: 7045,
  },
  {
    timestamp: 1553446800000,
    average: 36.22613015812456,
    max: 37.81948471069336,
    min: 34.85007858276367,
    count: 7049,
  },
  {
    timestamp: 1553454000000,
    average: 36.24971565937807,
    max: 37.53795623779297,
    min: 34.94010925292969,
    count: 7042,
  },
  {
    timestamp: 1553461200000,
    average: 36.25013721231464,
    max: 37.713436126708984,
    min: 34.85007858276367,
    count: 6992,
  },
  {
    timestamp: 1553468400000,
    average: 36.257451128494466,
    max: 37.996490478515625,
    min: 34.58686065673828,
    count: 7038,
  },
  {
    timestamp: 1553475600000,
    average: 36.256014550798355,
    max: 37.66079330444336,
    min: 34.90501403808594,
    count: 7035,
  },
  {
    timestamp: 1553482800000,
    average: 36.25625003272037,
    max: 37.74929428100586,
    min: 34.7623405456543,
    count: 7022,
  },
  {
    timestamp: 1553490000000,
    average: 36.25923830736823,
    max: 37.94384765625,
    min: 34.48004913330078,
    count: 7015,
  },
  {
    timestamp: 1553497200000,
    average: 36.271476844505145,
    max: 37.520408630371094,
    min: 34.48004913330078,
    count: 6933,
  },
  {
    timestamp: 1553504400000,
    average: 36.26882068461906,
    max: 37.873653411865234,
    min: 34.81498336791992,
    count: 7012,
  },
  {
    timestamp: 1553511600000,
    average: 36.26314777899866,
    max: 37.837032318115234,
    min: 34.77988815307617,
    count: 7017,
  },
  {
    timestamp: 1553518800000,
    average: 36.26164228970849,
    max: 37.81948471069336,
    min: 34.99275207519531,
    count: 7034,
  },
  {
    timestamp: 1553526000000,
    average: 36.242639319593536,
    max: 37.643245697021484,
    min: 34.81498336791992,
    count: 7041,
  },
  {
    timestamp: 1553533200000,
    average: 36.268286747903616,
    max: 37.891204833984375,
    min: 34.86762619018555,
    count: 7017,
  },
  {
    timestamp: 1553540400000,
    average: 36.255091559623594,
    max: 37.996490478515625,
    min: 34.70969772338867,
    count: 6994,
  },
  {
    timestamp: 1553547600000,
    average: 36.233221861572495,
    max: 37.78438949584961,
    min: 34.65705490112305,
    count: 7002,
  },
  {
    timestamp: 1553554800000,
    average: 36.242038312580426,
    max: 37.73098373413086,
    min: 34.6921501159668,
    count: 7018,
  },
  {
    timestamp: 1553562000000,
    average: 36.25359325412894,
    max: 37.66079330444336,
    min: 34.51514434814453,
    count: 6987,
  },
  {
    timestamp: 1553569200000,
    average: 36.234766837509135,
    max: 37.62569808959961,
    min: 34.48004913330078,
    count: 7020,
  },
  {
    timestamp: 1553576400000,
    average: 36.243934980427824,
    max: 37.643245697021484,
    min: 34.8325309753418,
    count: 6940,
  },
  {
    timestamp: 1553583600000,
    average: 36.22789058086093,
    max: 37.85610580444336,
    min: 34.72724533081055,
    count: 6993,
  },
  {
    timestamp: 1553590800000,
    average: 36.22016670876518,
    max: 37.873653411865234,
    min: 34.79743576049805,
    count: 7019,
  },
  {
    timestamp: 1553598000000,
    average: 36.22073226933739,
    max: 37.483787536621094,
    min: 34.88746643066406,
    count: 7016,
  },
  {
    timestamp: 1553605200000,
    average: 36.22908063905159,
    max: 37.766841888427734,
    min: 34.88746643066406,
    count: 7033,
  },
  {
    timestamp: 1553612400000,
    average: 36.25048841375595,
    max: 37.713436126708984,
    min: 34.70969772338867,
    count: 6944,
  },
  {
    timestamp: 1553619600000,
    average: 36.2374068426092,
    max: 37.678340911865234,
    min: 34.7623405456543,
    count: 7035,
  },
  {
    timestamp: 1553626800000,
    average: 36.238100520317026,
    max: 37.713436126708984,
    min: 34.63950729370117,
    count: 6978,
  },
  {
    timestamp: 1553634000000,
    average: 36.21992708728823,
    max: 37.62569808959961,
    min: 34.74479293823242,
    count: 7025,
  },
  {
    timestamp: 1553641200000,
    average: 36.25978545413526,
    max: 37.66079330444336,
    min: 34.8325309753418,
    count: 7034,
  },
  {
    timestamp: 1553648400000,
    average: 36.22786869087266,
    max: 37.81948471069336,
    min: 34.62195587158203,
    count: 6996,
  },
  {
    timestamp: 1553655600000,
    average: 36.22098550835417,
    max: 37.590599060058594,
    min: 34.58686065673828,
    count: 7002,
  },
  {
    timestamp: 1553662800000,
    average: 36.24305723511069,
    max: 37.766841888427734,
    min: 34.90501403808594,
    count: 7029,
  },
];

export const datapointsList = {
  name: 'abc',
  datapoints,
};

const csvData = [
  {
    isString: false,
    isStep: false,
    id: 41852231325889,
    externalId: 'VAL_45-FT-92139B:X.Value',
    datapoints: [
      {
        timestamp: 1567321804000,
        average: 37.328285159958284,
      },
      {
        timestamp: 1567321814000,
        average: 36.82007308357594,
      },
      {
        timestamp: 1567321824000,
        average: 36.724150540718036,
      },
      {
        timestamp: 1567321836000,
        average: 36.63919483033211,
      },
      {
        timestamp: 1567321846000,
        average: 36.82745987548373,
      },
      {
        timestamp: 1567321856000,
        average: 36.79312666004637,
      },
      {
        timestamp: 1567321866000,
        average: 36.61692393234221,
      },
      {
        timestamp: 1567321876000,
        average: 36.66098905958614,
      },
      {
        timestamp: 1567321886000,
        average: 37.158724369937026,
      },
      {
        timestamp: 1567321896000,
        average: 36.53079938592041,
      },
    ],
  },
  {
    isString: false,
    isStep: false,
    id: 7433885982156917,
    externalId: 'VAL_23-PDT-96167:X.Value',
    datapoints: [
      {
        timestamp: 1567321804000,
        average: 447.0675983057388,
      },
      {
        timestamp: 1567321814000,
        average: 449.06794988532715,
      },
      {
        timestamp: 1567321824000,
        average: 454.29809079884575,
      },
      {
        timestamp: 1567321834000,
        average: 458.16031145754727,
      },
      {
        timestamp: 1567321846000,
        average: 456.4260565260337,
      },
      {
        timestamp: 1567321864000,
        average: 462.03305250517326,
      },
      {
        timestamp: 1567321876000,
        average: 467.69675699179214,
      },
      {
        timestamp: 1567321886000,
        average: 467.48141532309336,
      },
      {
        timestamp: 1567321896000,
        average: 461.07365963914015,
      },
      {
        timestamp: 1567321906000,
        average: 459.0485300125486,
      },
    ],
  },
];

export const csvExportData = csvData.map(tid => {
  const { datapoints: dps, ...restTid } = tid;
  const resultDatapoints = dps.map(({ timestamp, ...rest }) => ({
    timestamp: new Date(timestamp),
    ...rest,
  }));

  return { datapoints: resultDatapoints, ...restTid };
});

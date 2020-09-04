// Copyright 2020 Cognite AS
import { Collapse } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';

interface TimeseriesMetaInfoProps {
  metaInfo: {
    [key: string]: string;
  };
}

export const TimeseriesMetaInfo: FC<TimeseriesMetaInfoProps> = ({
  metaInfo,
}) => {
  const metaList = Object.keys(metaInfo).map(key => ({
    property: key,
    value: metaInfo[key],
  }));

  return (
    <CollapseContainer>
      <PanelWrapper header={'Metadata'} key={'timeseries-metadata'}>
        <Table>
          {metaList.map(entry => (
            <TableRow key={entry.property}>
              <TableProperty>{entry.property}</TableProperty>
              <TableValue>{entry.value}</TableValue>
            </TableRow>
          ))}
        </Table>
      </PanelWrapper>
    </CollapseContainer>
  );
};

const Table = styled.div`
  display: table;
`;

const TableRow = styled.div`
  display: table-row;
`;

const TableProperty = styled.div`
  display: table-cell;
  font-weight: bold;
  min-width: 200px;
`;

const TableValue = styled.div`
  display: table-cell;
  padding-left: 10px;
`;

const PanelWrapper = styled(Collapse.Panel)`
  text-align: left;
`;

const CollapseContainer = styled(Collapse)`
  && {
    margin-top: 14px;
    min-width: 600px;
    max-width: 800px;
  }
`;

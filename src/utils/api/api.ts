import axios from 'axios';
import { Assets } from '@cognite/sdk';
import { VAsset, VApiAssetList } from 'utils/validators';
import { extractValidStrings } from 'utils/utils';

const ocrURL = 'https://opin-api.cognite.ai/do_ocr';

export async function getAssetList({
  query,
  fuzziness = 0,
  fuzzLimit = 3,
}: VApiAssetList): Promise<VAsset[]> {
  const response = await Assets.list({
    name: query,
    fuzziness,
  });

  if (response.items.length < 1 && fuzziness < fuzzLimit) {
    return getAssetList({
      query,
      fuzziness: fuzziness + 1,
    });
  }

  return response.items;
}

export async function ocrRecognize(image: string): Promise<string[]> {
  const options = {
    method: 'POST',
    url: ocrURL,
    data: {
      image,
    },
  };

  try {
    const result = (await axios(options)).data;

    return extractValidStrings(result.responses[0].textAnnotations);
  } catch (err) {
    return err;
  }
}

import { Assets } from '@cognite/sdk';
import { VAsset, VApiAssetList, VOcrRequest } from 'utils/validators';
import { extractValidStrings } from 'utils/utils';

const ocrVisionURL = 'https://vision.googleapis.com/v1/images:annotate';

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

export async function ocrRecognize({
  image,
  url,
  key,
}: VOcrRequest): Promise<string[]> {
  const headers = new Headers();

  headers.append('Content-Type', 'application/json');

  let ocrUrl = url ? url : ocrVisionURL;
  ocrUrl += key ? `?key=${key}` : '';

  const body = {
    requests: [
      {
        image: {
          content: image,
        },
        features: [
          {
            type: 'TEXT_DETECTION',
          },
        ],
      },
    ],
  };

  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  };

  const response = await fetch(ocrUrl, options);

  if (response.status !== 200) {
    const { status } = response;
    const errorResponse = await response.json();
    const message = errorResponse.error ? errorResponse.error.message : '';

    throw { error: response, status, message };
  }

  const result = await response.json();

  return extractValidStrings(result.responses[0].textAnnotations);
}

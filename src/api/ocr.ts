import { OcrRequest } from '../interfaces';
import { extractValidStrings } from '../utils';

const ocrVisionURL = 'https://vision.googleapis.com/v1/images:annotate';

export async function ocrRecognize({
  image,
  url,
  key,
}: OcrRequest): Promise<string[]> {
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

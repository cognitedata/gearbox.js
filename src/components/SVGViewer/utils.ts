import { CogniteClient } from '@cognite/sdk';

export const getDocumentDownloadLink = async (
  client: CogniteClient,
  id: number
) => {
  const urls = await client.files.getDownloadUrls([{ id }]);
  const url = urls[0].downloadUrl;
  const response = await fetch(url);

  if (response.status !== 200) {
    const { status } = response;
    const errorResponse = await response.json();
    const message = errorResponse.error ? errorResponse.error.message : '';

    throw { error: response, status, message };
  }

  return await response.text();
};

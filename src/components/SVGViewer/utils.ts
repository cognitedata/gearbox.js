import { Files } from '@cognite/sdk';

export const getDocumentDownloadLink = async (id: number) => {
  const url = await Files.download(id);

  const response = await fetch(url);

  if (response.status !== 200) {
    const { status } = response;
    const errorResponse = await response.json();
    const message = errorResponse.error ? errorResponse.error.message : '';

    throw { error: response, status, message };
  }

  return await response.text();
};

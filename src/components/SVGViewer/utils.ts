import { CogniteClient } from '@cognite/sdk';

export const getDocumentDownloadLink = async (
  client: CogniteClient,
  id: number
) => {
  const [{ downloadUrl }] = await client.files.getDownloadUrls([{ id }]);
  const { data } = await client.get<string>(downloadUrl, {
    responseType: 'text',
  });
  return data;
};

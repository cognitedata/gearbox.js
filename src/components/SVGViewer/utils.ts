import { Files } from '@cognite/sdk';
import axios from 'axios';

export const getDocumentDownloadLink = async (id: number) => {
  const url = await Files.download(id);
  const { data } = await axios({
    url,
    method: 'GET',
    responseType: 'text',
  });
  return data;
};

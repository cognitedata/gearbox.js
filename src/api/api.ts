import { Assets, Asset, Event, Events, Files, File } from '@cognite/sdk';
import { ApiAssetList } from '../interfaces';

export async function getAssetList({
  query,
  fuzziness = 0,
  fuzzLimit = 3,
}: ApiAssetList): Promise<Asset[]> {
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

export async function retrieveAsset(assetId: number) {
  return await Assets.retrieve(assetId);
}

export async function getAssetListDescendants(
  assetId: number,
  query: { [name: string]: any }
) {
  const response = await Assets.listDescendants(assetId, query);

  if (!response.items || response.items.length < 1) {
    return [];
  }

  return response.items;
}

export async function getAssetEvent(query: {
  assetId: number;
  limit: number;
}): Promise<Event[]> {
  const response = await Events.list(query);

  if (response.items && response.items.length > 0) {
    return response.items;
  }

  return [];
}

export async function getAssetFiles(query: {
  assetId: number;
  limit: number;
}): Promise<File[]> {
  const response = await Files.list(query);

  if (response.items && response.items.length > 0) {
    return response.items;
  }

  return [];
}

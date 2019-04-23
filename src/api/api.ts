import { Asset, Assets } from '@cognite/sdk';
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

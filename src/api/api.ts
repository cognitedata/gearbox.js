import { Revision, ThreeD } from '@cognite/sdk';

export function fetch3DModelRevision(
  modelId: number,
  revisionId: number
): Promise<Revision> {
  return ThreeD.retrieveRevision(modelId, revisionId);
}

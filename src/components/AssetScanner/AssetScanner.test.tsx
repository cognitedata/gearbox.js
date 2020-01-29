import { render } from '@testing-library/react';
import React from 'react';
import { MockCogniteClient } from '../../mocks';
import { ClientSDKProvider } from '../ClientSDKProvider';
import { AssetScanner } from './AssetScanner';

console.error = jest.fn();
const mockEventList = jest.fn();

class CogniteClient extends MockCogniteClient {
  assets: any = {
    list: mockEventList,
  };
}

const sdk = new CogniteClient({ appId: 'gearbox test' });

afterEach(() => {
  jest.clearAllMocks();
});

describe('AssetMeta', () => {
  it('should render without exploding', () => {
    render(
      <ClientSDKProvider client={sdk}>
        <AssetScanner ocrKey={'YOUR_GOOGLE_VISION_KEY'} />
      </ClientSDKProvider>
    );
  });

  it('should fail if ClientSDKProvider is missing', () => {
    render(<AssetScanner ocrKey={'YOUR_GOOGLE_VISION_KEY'} />);
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});

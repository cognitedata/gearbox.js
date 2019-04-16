import React, { useState } from 'react';
import { AssetScanner, AssetScannerProps } from './AssetScanner';
import { AssetScannerDescription } from './AssetScannerDescription';
import { ErrorResponse } from '../../interfaces';

export const AssetScannerStory = (props: AssetScannerProps) => {
  const [showHelper, toggleHelper] = useState(false);
  const { onUnauthorized } = props;

  const showHelperFunc = (error: ErrorResponse) => {
    toggleHelper(true);
    onUnauthorized(error);
  };

  return (
    <React.Fragment>
      {showHelper ? (
        <AssetScannerDescription />
      ) : (
        <AssetScanner {...props} onUnauthorized={showHelperFunc} />
      )}
    </React.Fragment>
  );
};

AssetScannerStory.displayName = 'AssetScanner';

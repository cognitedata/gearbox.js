import React, { useContext } from 'react';
import styled from 'styled-components';
import { AssetTree } from '../components/AssetTree';
import { ClientSDKProvider } from '../components/ClientSDKProvider';
import { AppContext } from './app/App';

const Navigator = styled.div`
  background-color: #eee7e0;
`;

const Sandbox = () => {
  const ctx = useContext(AppContext);

  return (
    <ClientSDKProvider client={ctx!.client!}>
      <h3>Asset Tree</h3>
      <Navigator>
        <AssetTree />
      </Navigator>
    </ClientSDKProvider>
  );
};

export { Sandbox };

import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: block;
  padding: 0 30px;
`;

export function AssetScannerDescription() {
  return (
    <Wrapper>
      <h1>Asset scanner component requirements:</h1>
      <p>
        Component depends on few third-part APIs, which is provided by Google
        Vision (to recognize text on picture) and Cognite (to grep all available
        information related to recognized string). User has to set in props of
        component valid API key for Google Vision. How to get one you could
        check out here:
      </p>
      <h3>Google Vision API</h3>
      <p>
        Before you can use the Cloud Vision API, you must enable it for your
        project and generate your API key, see here how –{' '}
        <a
          href="https://cloud.google.com/vision/docs/before-you-begin"
          target="_blank"
          rel="noopener"
        >
          Enable the Vision API
        </a>
      </p>
      <p>
        Don't forget for setting up API key restrictions –{' '}
        <a
          href="https://cloud.google.com/docs/authentication/api-keys"
          target="_blank"
          rel="noopener"
        >
          Using API Keys
        </a>
      </p>
      <p>
        Google Vision API key could be pass to component via{' '}
        <strong>ocrKey</strong> prop or you can passURL address via{' '}
        <strong>ocrUrl</strong> prop in case of own backend realisation of
        Google Vision API call.
      </p>

      <h3>Cognite SDK API usage</h3>
      <p>
        Usage of this component is available in all apps related to Cognite SDK.
        For success asset list call you need to be logged in Cognite SDK API via{' '}
        <a
          href="https://github.com/cognitedata/cognitesdk-js#web-application---tokens"
          target="_blank"
          rel="noopener"
        >
          Authorise call
        </a>
        .
      </p>
      <p>
        Also you could use Cognite React Auth, which makes it easy to integrate
        Cognite's login flow into any React applications –{' '}
        <a
          href="https://github.com/cognitedata/react-auth"
          target="_blank"
          rel="noopener"
        >
          Cognite React Auth
        </a>
      </p>
    </Wrapper>
  );
}

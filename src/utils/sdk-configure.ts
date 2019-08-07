/**
 * This file is created for development purposes only,
 * please don't use any functions from here in your public application
 * Related to Github issue #320:
 * https://github.com/cognitedata/gearbox.js/issues/320
 */

// todo what is this doing?
import {
  ClientOptions,
  default as CogniteClient,
} from '@cognite/sdk/dist/src/cogniteClient';

export let sdk: CogniteClient;

export function configureSdk(config: ClientOptions) {
  sdk = new CogniteClient(config);
}

export async function authSdk(tenant: string) {
  // what?
  sdk.loginWithOAuth({
    project: tenant,
    onAuthenticate: login => {
      login.popup({
        redirectUrl: window.location.href,
        errorRedirectUrl: window.location.href,
      });
    },
  });
}

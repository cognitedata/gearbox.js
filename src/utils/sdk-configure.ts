/**
 * This file is created for development purposes only,
 * please don't use any functions from here in your public application
 * Related to Github issue #320:
 * https://github.com/cognitedata/gearbox.js/issues/320
 */

import * as sdk from '@cognite/sdk';

export function configureSdk(config: sdk.AuthorizeParams) {
  sdk.configure(config);
}

export async function authSdk(tenant: string): Promise<sdk.AuthResult> {
  return await sdk.Login.authorize({
    project: tenant,
    redirectUrl: window.location.href,
    errorRedirectUrl: window.location.href,
    popup: true,
  });
}

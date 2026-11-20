// Adapted from adobe/da-nx nx2/utils/ims.js
// The client ID must allow this site's origins as redirect URIs or sign-in is rejected.
const IMS_CLIENT_ID = 'nexter';
const IMS_SCOPE = 'AdobeID,openid,gnav,org.read,read_organizations,session,additional_info.ownerOrg,account_cluster.read';
const IMS_URL = 'https://auth.services.adobe.com/imslib/imslib.min.js';
const IMS_ENDPOINT = 'ims-na1.adobelogin.com';
const IO_PROFILE_URL = 'https://cc-collab.adobe.io/profile';
const IMS_TIMEOUT = 5000;

export function handleSignIn() {
  window.adobeIMS?.signIn();
}

export function handleSignOut() {
  window.adobeIMS?.signOut();
}

async function fetchWithToken(url, accessToken) {
  try {
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken.token}` } });
    return resp.ok ? resp.json() : null;
  } catch {
    return null;
  }
}

async function loadDetails(accessToken) {
  const profile = await window.adobeIMS.getProfile();
  let io;
  let orgs;
  const getIo = () => {
    io = io || fetchWithToken(IO_PROFILE_URL, accessToken);
    return io;
  };
  const getOrgs = () => {
    orgs = orgs || fetchWithToken(
      `https://${IMS_ENDPOINT}/ims/account_cluster/v3?client_id=${IMS_CLIENT_ID}`,
      accessToken,
    );
    return orgs;
  };
  return {
    ...profile, accessToken, getIo, getOrgs,
  };
}

let ims;

/**
 * Loads imslib once and resolves with the signed-in profile, or { anonymous: true }.
 * @returns {Promise<Object>}
 */
export function loadIms() {
  ims = ims || new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('IMS timeout')), IMS_TIMEOUT);
    const done = (v) => { clearTimeout(timeout); resolve(v); };
    const fail = (e) => { clearTimeout(timeout); reject(e); };

    window.adobeid = {
      client_id: IMS_CLIENT_ID,
      scope: IMS_SCOPE,
      locale: document.documentElement.lang?.replace('-', '_') || 'en_US',
      autoValidateToken: true,
      environment: 'prod',
      useLocalStorage: true,
      onError: fail,
      onReady: () => {
        const accessToken = window.adobeIMS.getAccessToken();
        if (!accessToken) {
          done({ anonymous: true });
          return;
        }
        loadDetails(accessToken).then(done, fail);
      },
    };
    if (window.self !== window.top) {
      window.adobeid.modalMode = true;
      window.adobeid.modalSettings = { allowedOrigin: window.location.origin };
    }

    const script = document.createElement('script');
    script.src = IMS_URL;
    script.onerror = fail;
    document.head.append(script);
  });
  return ims;
}

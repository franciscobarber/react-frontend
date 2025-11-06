import { InteractiveBrowserCredential } from "@azure/identity";

const tenantId = process.env.REACT_APP_TENANT_ID;
const clientId = process.env.REACT_APP_CLIENT_ID;

if (!tenantId || !clientId) {
    throw new Error("REACT_APP_TENANT_ID and REACT_APP_CLIENT_ID must be set in the environment.");
}

let credential = null;
let account = null;

const getCredential = () => {
    if (!credential) {
        credential = new InteractiveBrowserCredential({
            tenantId: tenantId,
            clientId: clientId,
        });
    }
    return credential;
};

export const login = async () => {
    const cred = getCredential();
    // The initial call to authenticate will prompt the user for login.
    // Subsequent calls will return the user's account without prompting.
    await cred.authenticate();
    account = cred.getAccount();
    return account;
};

export const logout = async () => {
    const cred = getCredential();
    await cred.logout();
    account = null;
};

export const getAccount = () => {
    if (!account) {
        account = getCredential().getAccount();
    }
    return account;
};

export const getAuthToken = async (scopes) => {
    const cred = getCredential();
    const accessToken = await cred.getToken(scopes);
    return accessToken?.token;
};
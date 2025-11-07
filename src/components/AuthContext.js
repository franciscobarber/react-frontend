import React, { createContext, useState, useEffect, useContext } from 'react';
import { PublicClientApplication, InteractionRequiredAuthError, LogLevel, EventType } from '@azure/msal-browser';

const AuthContext = createContext(null);

// --- MSAL Configuration ---
// Replace with your Azure AD App Registration details
// It's highly recommended to use environment variables for these values.
const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AAD_CLIENT_ID || '500400f3-0551-468b-b59c-1bddd6e055b1', // **VERIFY THIS ID EXISTS IN AZURE AD PORTAL**
    authority: process.env.REACT_APP_AAD_AUTHORITY || 'https://login.microsoftonline.com/organizations', // Use 'organizations' for multi-tenant work/school accounts
    redirectUri: window.location.origin, // Your frontend's redirect URI (e.g., http://localhost:3000)
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set to true if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return; // Do not log PII to console
        }
        switch (level) {
          case LogLevel.Error:
            console.error("MSAL Error:", message);
            return;
          case LogLevel.Info:
            console.info("MSAL Info:", message);
            return;
          case LogLevel.Verbose:
            console.debug("MSAL Verbose:", message);
            return;
          case LogLevel.Warning:
            console.warn("MSAL Warning:", message);
            return;
          default:
            return;
        }
      },
      piiLoggingEnabled: false, // Set to true for debugging, but be cautious in production
      logLevel: LogLevel.Info,
    }
  }
};

// Scopes for your backend API - REPLACE WITH YOUR BACKEND API'S EXPOSED SCOPES
// This is the Application ID URI of your backend API, followed by the scope name.
const backendApiRequest = {
  scopes: [process.env.REACT_APP_BACKEND_API_SCOPE || 'api://b69de00c-51fd-4ec7-a425-524f4728c42d/access_as_user'],
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendAccessToken, setBackendAccessToken] = useState(null); // This will hold the AAD token for your backend
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Overall authentication status

  // This effect will run once on mount and set up the event callback
  useEffect(() => {
    const callbackId = msalInstance.addEventCallback(async (event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        const account = event.payload.account;
        msalInstance.setActiveAccount(account);

        try {
          const tokenResponse = await msalInstance.acquireTokenSilent({
            ...backendApiRequest,
            account: account,
          });
          setBackendAccessToken(tokenResponse.accessToken);
          setIsAuthenticated(true);
          // The userInfo from SWA might be stale or not what we want for display.
          // Let's create a user object from the MSAL account info.
          setUserInfo({ userDetails: account.name || account.username });
        } catch (error) {
          console.error("Error acquiring token after login:", error);
          // Handle token acquisition failure, e.g., by initiating an interactive request
        }
      }
    });

    return () => msalInstance.removeEventCallback(callbackId);
  }, []);

  useEffect(() => {
    async function initializeAuth() {
      try {
        // 1. Handle MSAL redirect (if any) - important for redirect flows
        await msalInstance.handleRedirectPromise();

        // 2. Get SWA client principal (for general user info display, if SWA is still used for initial login)
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          msalInstance.setActiveAccount(accounts[0]);
          setIsAuthenticated(true);
          setUserInfo({ userDetails: accounts[0].name || accounts[0].username });
          try {
            const tokenResponse = await msalInstance.acquireTokenSilent({
              ...backendApiRequest,
              account: accounts[0],
            });
            setBackendAccessToken(tokenResponse.accessToken);
          } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
              console.warn("Silent token acquisition failed. User interaction is required.");
              // Optionally, you could trigger msalInstance.loginRedirect(backendApiRequest) here
            } else {
              console.error("Error acquiring token silently on page load:", error);
            }
          }
        } else {
          // No accounts are signed in
          setUserInfo(null);
          setIsAuthenticated(false);
          setBackendAccessToken(null);
        }
      } catch (error) {
        console.error('Error during authentication initialization:', error);
      } finally {
        setIsLoading(false);
      }
    }
    initializeAuth();
  }, []);

  // Expose MSAL instance for interactive login/logout in Auth.js
  const authValue = { userInfo, isLoading, backendAccessToken, isAuthenticated, msalInstance };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
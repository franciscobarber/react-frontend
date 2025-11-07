import React, { createContext, useState, useEffect, useContext } from 'react';
import { PublicClientApplication, InteractionRequiredAuthError, LogLevel, EventType } from '@azure/msal-browser';

const AuthContext = createContext(null);

// --- MSAL Configuration ---
// Replace with your Azure AD App Registration details
// It's highly recommended to use environment variables for these values.
const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AAD_CLIENT_ID || '500400f3-0551-468b-b59c-1bddd6e055b1', // Application (client) ID of your frontend app registration in Azure AD
    authority: process.env.REACT_APP_AAD_AUTHORITY || 'https://login.microsoftonline.com/common', // Use 'common' for multi-tenant work/school accounts AND personal Microsoft accounts
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
  scopes: [process.env.REACT_APP_BACKEND_API_SCOPE || 'api://b69de00c-51fd-4ec7-a425-524f4728c42d/access_as_user']
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendAccessToken, setBackendAccessToken] = useState(null); // This will hold the AAD token for your backend
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Overall authentication status

  useEffect(() => {
    async function initializeAuth() {
      try {
        // Handle the redirect promise. This will return a result if the page is loaded after a redirect, otherwise null.
        const redirectResult = await msalInstance.handleRedirectPromise();
        console.log("MSAL handleRedirectPromise completed.");

        // Determine the active account. Prioritize the account from the redirect result.
        const account = redirectResult?.account || msalInstance.getAllAccounts()[0];

        if (account) {
          msalInstance.setActiveAccount(account);
          setIsAuthenticated(true);
          setUserInfo({ userDetails: account.name || account.username });
          console.log("User authenticated:", account.name || account.username);

          try {
            // Silently acquire a token for the backend API.
            const tokenResponse = await msalInstance.acquireTokenSilent({
              ...backendApiRequest,
              account: account,
            });
            setBackendAccessToken(tokenResponse.accessToken);
            console.log("Backend access token acquired successfully on load.");
          } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
              console.warn("Silent token acquisition failed. User interaction is required.");
              // This is a good place to initiate an interactive request if needed.
              // Example: msalInstance.acquireTokenRedirect(backendApiRequest);
            } else {
              console.error("Error acquiring token silently on page load:", error);
            }
          }
        } else {
          console.log("No active MSAL account found.");
          setUserInfo(null);
          setIsAuthenticated(false);
          setBackendAccessToken(null);
        }
      } catch (error) {
        console.error('Error during authentication initialization:', error);
      } finally {
        console.log("Auth initialization finished.");
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
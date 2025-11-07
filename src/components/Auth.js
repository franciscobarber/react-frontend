import React from 'react';
import { useAuth } from './AuthContext';

const Auth = () => {
    const { userInfo, isLoading, isAuthenticated, msalInstance } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleLogin = async () => {
        try {
            // Request 'openid', 'profile', 'email' for basic user info, and your backend API scope
            await msalInstance.loginRedirect({
                scopes: ['openid', 'profile', 'email', process.env.REACT_APP_BACKEND_API_SCOPE || 'api://YOUR_BACKEND_APP_ID_GUID/access_as_user'],
            });
        } catch (error) {
            console.error("MSAL login failed:", error);
        }
    };

    const handleLogout = () => {
        msalInstance.logoutRedirect(); // Clears MSAL cache and redirects to AAD logout endpoint
    };

    return (
        <div className="auth-links">
            {!isAuthenticated ? (
                <button onClick={handleLogin}>Login with Entra ID (via MSAL)</button>
                // If you still want to offer other SWA-managed logins (like GitHub), you can keep them:
                // <a href="/.auth/login/github?post_login_redirect_uri=/">Login with GitHub (via SWA)</a>
            ) : (
                <button onClick={handleLogout}>Logout ({userInfo?.userDetails || 'User'})</button>
            )}
        </div>
    );
};

export default Auth;
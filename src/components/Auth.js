import React from 'react';
import { useAuth } from './AuthContext';

const Auth = () => {
    const { userInfo, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="auth-links">
            {!userInfo ? (
                <>
                    <a href="/.auth/login/aad?post_login_redirect_uri=/">Login with Entra ID</a>
                    <a href="/.auth/login/github?post_login_redirect_uri=/">Login with GitHub</a>
                </>
            ) : (
                <a href="/.auth/logout?post_logout_redirect_uri=/">Logout ({userInfo.userDetails})</a>
            )}
        </div>
    );
};

export default Auth;
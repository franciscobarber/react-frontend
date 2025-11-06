import React, { useState, useEffect } from 'react';

const Auth = () => {
    const [userInfo, setUserInfo] = useState();

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const response = await fetch('/.auth/me');
                const payload = await response.json();
                const { clientPrincipal } = payload;
                setUserInfo(clientPrincipal);
            } catch (error) {
                console.error('No user info found');
            }
        }
        fetchUserInfo();
    }, []);

    return (
        <div className="auth-links">
            {!userInfo && (
                <>
                    <a href="/.auth/login/aad?post_login_redirect_uri=/">Login with Entra ID</a>
                    <a href="/.auth/login/github?post_login_redirect_uri=/">Login with GitHub</a>
                </>
            )}
            {userInfo && (
                <div>
                    <p>
                        Welcome, {userInfo.userDetails} ({userInfo.identityProvider})
                    </p>
                    <a href="/.auth/logout?post_logout_redirect_uri=/">Logout</a>
                </div>
            )}
        </div>
    );
};

export default Auth;
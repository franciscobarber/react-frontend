import React from 'react';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { userInfo, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!userInfo) {
        return <h2>Please log in to proceed to checkout.</h2>;
    }

    return children;
};

export default ProtectedRoute;
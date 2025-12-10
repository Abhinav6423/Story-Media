import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/Authcontext.js'
import { useNavigate } from 'react-router-dom'
const ProtectedRoute = () => {
    const { userData, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (userData === null) {
        navigate('/');
    }

    return (
        <div>
            <Outlet />
        </div>
    )
}

export default ProtectedRoute
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
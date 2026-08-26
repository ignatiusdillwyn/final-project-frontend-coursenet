import { Navigate } from 'react-router-dom';

const Middleware2 = ({ children }) => {
    const token = localStorage.getItem('token');
    console.log('middleware: token =', token);
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>; // Mengembalikan layout beserta isinya
};

export default Middleware2;
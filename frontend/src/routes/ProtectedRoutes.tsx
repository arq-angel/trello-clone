import {Navigate} from 'react-router-dom';
import {useAppSelector} from "../hooks.ts";
import * as React from "react";

interface ProtectedRoutesProps {
    children: React.ReactNode;
}

const ProtectedRoutes = ({children}: ProtectedRoutesProps) => {
    const token = useAppSelector((state) => state.auth.token);
    return token ? children : <Navigate to="/login" replace/>;
};

export default ProtectedRoutes;
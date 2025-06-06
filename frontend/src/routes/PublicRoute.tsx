import {Navigate} from "react-router-dom";
import {useAppSelector} from "../hooks.ts";
import * as React from "react";

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute = ({children}: PublicRouteProps) => {
    const token = useAppSelector((state) => state.auth.token);
    return token ? <Navigate to="/" replace/> : children;
};

export default PublicRoute;
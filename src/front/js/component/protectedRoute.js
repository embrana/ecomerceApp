import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../store/appContext";

const ProtectedRoute = ({ children }) => {
    const { store } = useContext(Context);

    // Check if the user is logged in
    if (!store.token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;

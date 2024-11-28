import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext"; // Assuming your Flux store is imported here

export const Navbar = () => {
    const { store, actions } = useContext(Context); // Accessing store from Flux context

    // Check if the user is logged in (token exists in store or sessionStorage)
    const isLoggedIn = store.token || sessionStorage.getItem("auth_token");

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">React Boilerplate</span>
                </Link>
                <div className="ml-auto">
                    {/* Conditionally render buttons */}
                    {!isLoggedIn ? (
                        <Link to="/login">
                            <button className="btn btn-primary">Login!</button>
                        </Link>
                    ) : (
                        <Link to="/">
                            <button onClick={()=>{
								actions.logout(); // Triggers logout action
							}} className="btn btn-danger">Log out</button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};


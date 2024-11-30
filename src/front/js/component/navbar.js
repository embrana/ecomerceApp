import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext"; // Assuming your Flux store is imported here

export const Navbar = () => {
    const { store, actions } = useContext(Context); // Accessing store from Flux context

    // Check if the user is logged in (token exists in store or sessionStorage)
    const isLoggedIn = store.token || sessionStorage.getItem("auth_token");

    return (
        <nav className="navbar navbar-light bg-primary px-0">
            <div className="container-fluid mx-0">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">
                        <img src="https://anda.com.uy/wp-content/themes/Divi-child/images/logo-anda.svg" style={{ width: "3rem" }}/>
                    </span>
                </Link>
                <div className="ml-auto">
                    {/* Conditionally render buttons */}
                    {!isLoggedIn ? (
                        <Link to="/login">
                            <button className="btn btn-light">Login</button>
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


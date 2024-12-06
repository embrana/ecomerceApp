import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const { store, actions } = useContext(Context);

    // Check if the user is logged in (token exists in store or sessionStorage)
    const isLoggedIn = store.token || sessionStorage.getItem("auth_token");

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-primary px-0">
            <div className="container-fluid mx-0">
                {/* Logo */}
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">
                        <img src="https://anda.com.uy/wp-content/themes/Divi-child/images/logo-anda.svg" style={{ width: "3rem" }} />
                    </span>
                </Link>

                <div className="ml-auto d-flex align-items-center">
                    {/* Cart Dropdown */}
                    <div className={`dropdown me-3 ${!isLoggedIn ? 'd-none' : ''}`}>
                        <button
                            className="btn btn-light dropdown-toggle"
                            type="button"
                            id="cartDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Cart ({store.cart.length})
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="cartDropdown">
                            {store.cart.length > 0 ? (
                                store.cart.map((item, index) => (
                                    <li key={index} className="dropdown-item d-flex justify-content-between align-items-center">
                                        <span>{item.name}</span>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => actions.removeFromCart(index)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="dropdown-item text-muted">Your cart is empty</li>
                            )}
                        </ul>
                    </div>

                    {/* Conditionally render buttons */}
                    {!isLoggedIn ? (
                        <Link to="/login">
                            <button className="btn btn-light">Login</button>
                        </Link>
                    ) : (
                        <button
                            onClick={() => actions.logout()} // Trigger logout action
                            className="btn btn-danger"
                        >
                            Log out
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

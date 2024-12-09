import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const isLoggedIn = store.token || sessionStorage.getItem("auth_token");

    // Detectar si la pantalla es pequeña
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 992); // Pantallas < 992px (Bootstrap lg breakpoint)
        };

        handleResize(); // Ejecutar en la primera carga
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

return (
        <nav className="navbar navbar-light bg-primary px-0">
            <div className="container-fluid mx-0">
                {/* Logo */}
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">
                        <img
                            src="https://anda.com.uy/wp-content/themes/Divi-child/images/logo-anda.svg"
                            style={{ width: "3rem" }}
                            alt="Logo"
                        />
                    </span>
                </Link>
    
                {/* Dropdown en pantallas pequeñas */}
                {isSmallScreen ? (
                    <div className="dropdown ms-auto">
                        <div className="ml-auto d-flex align-items-center">
                            {/* Cart Dropdown */}
                            <div className={`dropdown me-3 ${!isLoggedIn ? "d-none" : ""}`}>
                                <Link to="/menu">
                                    <button className="btn btn-light me-2">Menu</button>
                                </Link>
                                <Link to="/reserve">
                                    <button className="btn btn-light me-2">Comedor</button>
                                </Link>
                                <button
                                    className="btn btn-light dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <ul
                                    className="dropdown-menu dropdown-menu-end"
                                    aria-labelledby="dropdownMenuButton"
                                >
                                    {/* Logout como categoría */}
                                    {isLoggedIn && (
                                        <li className="dropdown-item">
                                            <button
                                                className="btn btn-danger w-100"
                                                onClick={() => actions.logout()}
                                            >
                                                Log out
                                            </button>
                                        </li>
                                    )}
                                    {/* Opción de Login si no está autenticado */}
                                    {!isLoggedIn && (
                                        <li>
                                            <Link to="/login" className="dropdown-item">
                                                Login
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex ms-auto align-items-center">
                        {/* Cart solo en pantallas grandes */}
                        {isLoggedIn && (
                            <div className="dropdown me-3">
                                <button
                                    className="btn btn-light dropdown-toggle"
                                    type="button"
                                    id="cartDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Cart ({store.cart.length})
                                </button>
                                <ul
                                    className="dropdown-menu dropdown-menu-end"
                                    aria-labelledby="cartDropdown"
                                >
                                    {store.cart.length > 0 ? (
                                        store.cart.map((item, index) => (
                                            <li
                                                key={index}
                                                className="dropdown-item d-flex justify-content-between align-items-center"
                                            >
                                                <span>{item.name}</span>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        actions.removeFromCart(index)
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="dropdown-item text-muted">
                                            Your cart is empty
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
    
                        {/* Logout como botón en pantallas grandes */}
                        {isLoggedIn && (
                            <button
                                className="btn btn-danger"
                                onClick={() => actions.logout()}
                            >
                                Log out
                            </button>
                        )}
                        {!isLoggedIn && (
                            <Link to="/login">
                                <button className="btn btn-light">Login</button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
    
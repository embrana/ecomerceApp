import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/cart.css";

function toggleCheckout() {
    const checkoutSection = document.querySelector(".checkout");
    if (checkoutSection.style.display === "block") {
        checkoutSection.style.display = "none";
    } else {
        checkoutSection.style.display = "block";
    }
}

const Cart = () => {
    const { store, actions } = useContext(Context);

    const handleQuantityChange = (productId, value) => {
        if (value < 1) return;

        const updatedCart = store.cart.map((item) =>
            item.product_id === productId ? { ...item, quantity: value } : item
        );

        actions.setCart(updatedCart);
        console.log(updatedCart)
    };

    const handleRemove = (index) => {
        const updatedCart = state.store.cart.filter((_, i) => i !== index);
        setCart(updatedCart);
    };

    // Lógica compartida para ambas versiones del carrito (checkout y checkout1)
    const renderCartItems = () => {
        if (store.cart.length === 0) {
            return <p className="text-muted text-center">Your cart is empty</p>;
        }

        return store.cart.map((item) => (
            <div
                className="d-flex align-items-center border-bottom py-2"
                key={item.product_id}
                style={{ fontSize: "0.9rem" }}
            >
                {/* Imagen del producto */}
                <div className="flex-shrink-0" style={{ width: "60px" }}>
                    <img
                        className="img-fluid"
                        src={item.image || "https://via.placeholder.com/150x100"}
                        alt="Product"
                        style={{
                            width: "60px",
                            height: "40px",
                            objectFit: "cover",
                        }}
                    />
                </div>

                {/* Nombre y precio del producto */}
                <div className="flex-grow-1 ms-2">
                    <h6 className="mb-1 text-truncate">{item.name}</h6>
                    <p className="mb-0 text-muted">${item.price}</p>
                </div>

                {/* Selector de cantidad */}
                <div className="d-flex align-items-center">
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                            handleQuantityChange(item.product_id, item.quantity - 1)
                        }
                    >
                        -
                    </button>
                    <input
                        type="number"
                        className="form-control form-control-sm text-center mx-1"
                        value={item.quantity}
                        onChange={(e) =>
                            handleQuantityChange(item.product_id, Math.max(1, Number(e.target.value)))
                        }
                        min="1"
                        style={{ width: "50px" }}
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                            handleQuantityChange(item.product_id, item.quantity + 1)
                        }
                    >
                        +
                    </button>
                </div>

                {/* Botón para eliminar */}
                <div className="ms-2">
                    <button
                        type="button"
                        className="btn btn-link btn-sm text-danger"
                        onClick={() => handleRemove(item.product_id)}
                    >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                    {/* <button
                        type="button"
                        className="btn btn-link btn-sm text-danger"
                        onClick={() => actions.removeFromCart(index)}
                      >
                        <i className="fa-solid fa-trash"></i>
                     </button> */}
                </div>
            </div>
        ));
    };

    return (
        <div className="container my-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <button className="responsive-btn" onClick={toggleCheckout}>
                Cart
            </button>
            {/* Checkout para escritorio */}
            <div className="row border checkout">
                <div className="col-12">
                    <div className="panel panel-info mt-2">
                        <div className="panel-heading">
                            <div className="panel-title text-center">
                                <p className="fs-5 fw-bold">
                                    <i className="fa-solid fa-cart-shopping"></i> Shopping Cart
                                </p>
                            </div>
                        </div>
                        <div className="panel-body mt-2">{renderCartItems()}</div>
                        <div className="panel-footer mt-3">
                            <div className="row align-items-center">
                                <div className="col-6 text-start">
                                    <h5 style={{ fontSize: "1rem" }}>
                                        Total:{" "}
                                        <strong>
                                            $
                                            {store.cart.reduce(
                                                (total, item) =>
                                                    total + item.price * item.quantity,
                                                0
                                            )}
                                        </strong>
                                    </h5>
                                </div>
                                <div className="col-6 text-end">
                                    <Link to={"/checkout"}>
                                        <button type="button" className="btn btn-success">
                                            Pagar
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout para móvil */}
            <div className="row border checkout1">
                <div className="col-12">
                    <div className="panel panel-info mt-2">
                        <div className="panel-heading">
                            <div className="panel-title text-center">
                                <p className="fs-5 fw-bold">
                                    <i className="fa-solid fa-cart-shopping"></i> Shopping Cart
                                </p>
                            </div>
                        </div>
                        <div className="panel-body mt-2">{renderCartItems()}</div>
                        <div className="panel-footer mt-3">
                            <div className="row align-items-center">
                                <div className="col-6 text-start">
                                    <h5 style={{ fontSize: "1rem" }}>
                                        Total:{" "}
                                        <strong>
                                            $
                                            {store.cart.reduce(
                                                (total, item) =>
                                                    total + item.price * item.quantity,
                                                0
                                            )}
                                        </strong>
                                    </h5>
                                </div>
                                <div className="col-6 text-end">
                                    <Link to={"/checkout"}>
                                        <button type="button" className="btn btn-success">
                                            Pagar
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

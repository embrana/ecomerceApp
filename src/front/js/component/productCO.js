import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/cart.css";

const ProductCO = ({ onPaymentSelect }) => {
    const { store, actions } = useContext(Context);

    const calculateTotal = () => {
        return store.cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
    };

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6"> {/* Center the cart */}
                    <div className="panel panel-info">
                        <div className="panel-heading text-center mt-2">
                            <p className="fs-5 fw-bold">
                                <i className="fa-solid fa-cart-shopping"></i> Shopping Cart
                            </p>
                        </div>

                        <div className="panel-body mt-2">
                            {store.cart.length > 0 ? (
                                store.cart.map((item, index) => (
                                    <div
                                        className="d-flex align-items-center border-bottom py-2"
                                        key={index}
                                        style={{ fontSize: "0.9rem" }}
                                    >
                                        
                                        {/* Product Name and Price */}
                                        <div className="flex-grow-1 ms-2">
                                            <h6 className="mb-1 text-truncate">{item.name}</h6>
                                            <p className="mb-0 text-muted">${item.price}</p>
                                        </div>

                                        {/* Quantity Input */}
                                        <div className="d-flex align-items-center">
                                            <input
                                                type="number"
                                                className="form-control form-control-sm text-center mx-1"
                                                value={item.quantity || 1}
                                                readOnly
                                                style={{"maxWidth": "40px"}}
                                            />
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            className="btn btn-link btn-sm text-danger"
                                            onClick={() => actions.removeFromCart(index)}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted text-center">Your cart is empty</p>
                            )}
                        </div>

                        {/* Cart Footer */}
                        <div className="panel-footer mt-3">
                            <div className="row align-items-center">
                                <div className="col-6 text-start">
                                    <h5 style={{ fontSize: "1rem" }}>
                                        Total: <strong>${calculateTotal()}</strong>
                                    </h5>
                                </div>

                                <div className="col-6 text-end d-flex ">
                                    {/* Payment Buttons */}
                                    <button
                                        type="button"
                                        className="btn btn-success mb-2 me-2"
                                        onClick={() => {
                                            actions.setOrder();
                                            onPaymentSelect();
                                        }}
                                    >
                                        Pagar en Efectivo
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-success mb-2"
                                        onClick={() => {
                                            actions.setOrder();
                                            onPaymentSelect();
                                        }}
                                    >
                                        Mercado Pago
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCO;

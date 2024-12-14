import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/cart.css";

const Cart = () => {
    const { store, actions } = useContext(Context);
    const [isCartVisible, setIsCartVisible] = useState(false);

    const toggleCartVisibility = () => {
        setIsCartVisible(!isCartVisible);
    };

    const handleQuantityChange = (productId, value) => {
        if (value < 1) return;

        const updatedCart = store.cart.map((item) =>
            item.product_id === productId ? { ...item, quantity: value } : item
        );

        actions.setCart(updatedCart);
    };

    const handleRemove = (productId) => {
        const updatedCart = store.cart.filter((item) => item.product_id !== productId);
        actions.setCart(updatedCart);
    };

    const renderCartItems = () => {
        if (store.cart.length === 0) {
            return <p className="text-muted text-center">Your cart is empty</p>;
        }

        return store.cart.map((item) => (
            <div
                className="d-flex align-items-center border-bottom py-2 shadow-sm bg-light rounded"
                key={item.product_id}
                style={{ overflow: "hidden", padding: "0.5rem" }}
            >
                <div className="flex-grow-1 ms-3">
                    <h6 className="mb-1 text-truncate">{item.name}</h6>
                    <p className="mb-0 text-muted">${item.price}</p>
                </div>

                <div className="d-flex align-items-center">
                    <input
                        type="number"
                        className="form-control form-control-sm text-center mx-1"
                        value={item.quantity}
                        onChange={(e) =>
                            handleQuantityChange(item.product_id, Math.max(1, Number(e.target.value)))
                        }
                        min="1"
                        style={{
                            width: "40px",
                            minWidth: "30px",
                            maxWidth: "40px",
                        }}
                    />
                </div>

                <div className="ms-2">
                    <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        style={{
                            width: "30px",
                            minWidth: "30px",
                            padding: "0.2rem",
                        }}
                        onClick={() => handleRemove(item.product_id)}
                    >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <>
            {/* Floating Button for Mobile */}
            <button
                className="responsive-btn"
                onClick={toggleCartVisibility}
                aria-label="Toggle Cart"
            >
                Carrito
            </button>

            {/* Cart Section */}
            <div
                className={`checkout ${isCartVisible ? "visible" : "hidden"}`}
            >
                <div className="card shadow-sm rounded border-0">
                    <div className="card-header bg-secondary text-white text-center">
                        <h5>
                            <i className="fa-solid fa-cart-shopping me-2"></i> Shopping Cart
                        </h5>
                    </div>
                    <div className="card-body">{renderCartItems()}</div>
                    <div className="card-footer">
                        <div className="row align-items-center">
                            <div className="col-6">
                                <h6 className="m-0">
                                    Total:{" "}
                                    <strong>
                                        $
                                        {store.cart.reduce(
                                            (total, item) => total + item.price * item.quantity,
                                            0
                                        )}
                                    </strong>
                                </h6>
                            </div>
                            <div className="col-6 text-end">
                                <Link to="/checkout">
                                    <button className="btn btn-success">Checkout</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;



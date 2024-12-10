import React, { useContext } from "react";
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

        actions.setCart(updatedCart); // Update cart in store
        console.log("Cart updated with new quantity:", updatedCart);
    };

    const handleRemove = (productId) => {
        // Filter out the item to be removed
        const updatedCart = store.cart.filter((item) => item.product_id !== productId);

        actions.setCart(updatedCart); // Update cart in store
        console.log("Item removed, updated cart:", updatedCart);
    };

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
                {/* Product Image */}
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

                {/* Product Name and Price */}
                <div className="flex-grow-1 ms-2">
                    <h6 className="mb-1 text-truncate">{item.name}</h6>
                    <p className="mb-0 text-muted">${item.price}</p>
                </div>

                {/* Quantity Selector */}
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

                {/* Remove Button */}
                <div className="ms-2">
                    <button
                        type="button"
                        className="btn btn-link btn-sm text-danger"
                        onClick={() => handleRemove(item.product_id)}
                    >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <div className="container my-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <button className="responsive-btn" onClick={toggleCheckout}>
                Cart
            </button>
            {/* Desktop Checkout */}
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
                                            Checkout
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Checkout */}
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
                                            Checkout
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

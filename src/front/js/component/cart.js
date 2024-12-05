import React, { useContext } from "react";
import { Context } from "../store/appContext";

const Cart = () => {
    const { store } = useContext(Context);

    return (
        <div className="container my-4">
            <h3>Your Cart</h3>
            {store.cart.length > 0 ? (
                <ul className="list-group">
                    {store.cart.map((item, index) => (
                        <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                            {item.name}
                            <span className="badge bg-primary rounded-pill">{item.price ? `$${item.price}` : "Free"}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted">Your cart is empty.</p>
            )}
        </div>
    );
};

export default Cart;

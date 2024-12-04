import React, { useContext } from "react";
import { Context } from "../store/appContext";

const Card = ({ item }) => {
    const { actions } = useContext(Context);

    const handleAddToCart = () => {
        actions.addToCart(item); // Call the addToCart action
    };

    return (
        <div className="card shadow-sm border-0">
            <img src={item.image} className="card-img-top" alt={item.name} style={{ height: "12rem", objectFit: "cover" }} />
            <div className="card-body">
                <h5 className="card-title text-dark">{item.name}</h5>
                <p className="card-text text-muted">{item.description}</p>
                <button className="btn btn-outline-primary w-100" onClick={handleAddToCart}>
                    Reservar
                </button>
            </div>
        </div>
    );
};

export default Card;

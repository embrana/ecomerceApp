import React, { useContext, useState } from "react";


const Card = ({ item }) => {
    const { actions } = useContext(Context);
    const [loading, setLoading] = useState(false);

    const handleAddToCart = async () => {
        setLoading(true);
        await actions.addToCart(item);
        setLoading(false);
    };

    return (
        <div className="card shadow-sm border-0">
            <img 
                src={item.image || "https://via.placeholder.com/150"} 
                className="card-img-top" 
                alt={item.name ? `Image of ${item.name}` : "Product Image"} 
                style={{ height: "12rem", objectFit: "cover" }} 
            />
            <div className="card-body">
                <h5 className="card-title text-dark">{item.name || "Unnamed Product"}</h5>
                <p className="card-text text-muted">{item.description || "No description available."}</p>
                <p className="card-text">
                    <strong>Price:</strong> {item.price ? `$${item.price}` : "N/A"}
                </p>
                <button 
                    className={`btn ${loading ? "btn-secondary" : "btn-outline-primary"} w-100`} 
                    onClick={handleAddToCart} 
                    disabled={loading} 
                    aria-label={`Add ${item.name || "this item"} to the cart`}
                >
                    {loading ? "Reservando..." : "Reservar"}
                </button>
            </div>
        </div>
    );
};

export default Card;

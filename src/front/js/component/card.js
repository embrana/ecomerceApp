import React from "react";

const Card = ({ item }) => {
    return (
        <div className="card" style={{ width: "15rem", height: "20rem" }}>
            <img src={item.image} className="card-img-top" alt="..." style={{ height: "10rem" }} />
            <div className="card-body">
                <h5 className="card-title">{item.name}</h5> {/* Adjusted key to match the product structure */}
                <p className="card-text">{item.description}</p>
                <button className="btn btn-primary">Reservar</button>
            </div>
        </div>
    );
};

export default Card;

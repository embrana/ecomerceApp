import React from "react";

const Card = ({ item }) => {
    return (
        <div className="card" style={{ width: "12rem" }}>
            <img src={item.image} className="card-img-top" alt="..."/>
            <div className="card-body">
                <p className="card-text">{item.title}</p>
            </div>
        </div>
    );
};

export default Card;

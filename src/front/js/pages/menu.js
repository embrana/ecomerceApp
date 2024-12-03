import React from "react";
import Card from "../component/card"; // Importing Card component
import { useContext } from "react";
import { Context } from "../store/appContext"; // Importing Flux context

export const Menu = () => {
    const { store } = useContext(Context); // Accessing store from Flux context

    return (
        <div key={index} className="card" style={{ width: "18rem" }}>
			  <img src={product.image} className="card-img-top" alt="..." />
			<div className="card-body">
				<h5 className="card-title">{product.name}</h5>
				<p className="card-text">{product.description}</p>
				<a href="#" className="btn btn-primary">Go somewhere</a>
			</div>
		</div>
    );
};

export default Menu;

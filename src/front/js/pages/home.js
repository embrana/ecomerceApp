import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";



export const Home = () => {
	const { store, actions } = useContext(Context);

	const [products, setProducts] = useState([]);

	const getProducts = async () => {
		const response = await fetch(process.env.BACKEND_URL + "/api/products");
		const data = await response.json();
		setProducts(data);
	}

	useEffect(() => {
		getProducts();
	},[]);

	return (
		<div className="text-center mt-5">
			<h1>Hello Rigo!!</h1>
			<p>
				<img src={rigoImageUrl} />
			</p>
			<h2>Products</h2>
			<div className="d-flex justify-content-center">
			{
				products.length > 0 ?
					products.map((product, index) => {
						return (
							<div key={index} className="card" style={{ width: "18rem" }}>
								<img src={product.image} className="card-img-top" alt="..." />
								<div className="card-body">
									<h5 className="card-title">{product.name}</h5>
									<p className="card-text">{product.description}</p>
									<a href="#" className="btn btn-primary">Go somewhere</a>
								</div>
							</div>
						)
					})
					:
					<p>No products</p>
			}
			</div>
		</div>
	);
};

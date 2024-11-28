import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

const Login = () => {
	const { store, actions } = useContext(Context);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Clear any previous errors before attempting a new login
		setError("");

		// Try logging in
		const success = await actions.login(email, password);

		// If login failed, show error from store
		if (!success) {
			setError(store.error || "An unknown error occurred.");
		} else {
			// Optionally store token in localStorage for persistence
			if (store.token) {
				localStorage.setItem("token", store.token);
			}
			alert("Login successful!");
		}
	};

	return (
		<div className="container d-flex justify-content-center align-items-center vh-100">
			<div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
				<h3 className="text-center mb-4">Login</h3>
				{/* Show error message if any */}
				{error && <div className="alert alert-danger">{error}</div>}
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="email" className="form-label">Email</label>
						<input
							type="email"
							className="form-control"
							id="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">Password</label>
						<input
							type="password"
							className="form-control"
							id="password"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button type="submit" className="btn btn-primary w-100">Login</button>
				</form>
			</div>
		</div>
	);
};

export default Login;

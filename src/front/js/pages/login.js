import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Context } from "../store/appContext";

const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // State for success message
    const [loading, setLoading] = useState(false); // State for loading
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Clear any previous errors and success messages
        setError("");
        setSuccessMessage("");
        setLoading(true);
    
        try {
            const { success, redirectUrl } = await actions.login(email, password);
    
            if (!success) {
                setError(store.error || "An unknown error occurred.");
            } else {
                setSuccessMessage("Login successful! Redirecting...");
                setTimeout(() => navigate(redirectUrl || "/menu"), 2000); // Redirect after 2 seconds
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center justify-content-evenly flex-wrap">
            <div className="text-center d-flex justify-content-center flex-wrap mt-5 mb-3">
                <h1 className="text-center mb-4">Bienvenidos a la app de gestion del comedor!</h1>
                <p style={{ backgroundColor: '#0d6efd', padding: '10px', borderRadius: '5px', width: '40%', }}>
                    <img src="https://anda.com.uy/wp-content/themes/Divi-child/images/logo-anda.svg" alt="Logo" />
                </p>
            </div>
            <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-4">Login</h3>
                
                {/* Show error message */}
                {error && <div className="alert alert-danger">{error}</div>}
                
                {/* Show success message */}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                
                {/* Show loading spinner */}
                {loading && (
                    <div className="text-center mb-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                
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
                            disabled={loading} // Disable input during loading
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
                            disabled={loading} // Disable input during loading
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100" 
                        disabled={loading} // Disable button during loading
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            const { success, redirectUrl } = await actions.login(email, password);

            if (!success) {
                setError(store.error || "An unknown error occurred.");
            } else {
                setSuccessMessage("Login successful! Redirecting...");
                setTimeout(() => navigate(redirectUrl || "/menu"), 2000);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                backgroundImage: 'url("https://anda.com.uy/wp-content/uploads/2024/08/institucional-banner.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "100vh", // Full viewport height
                width: "100vw", // Full viewport width
                margin: "0",
                padding: "0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box", // Include padding in dimensions
                overflow: "hidden", // Prevent scroll
            }}
        >
            <div
                className="card p-4 shadow"
                style={{
                    maxWidth: "400px",
                    width: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.9)", 
                }}
            >
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
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

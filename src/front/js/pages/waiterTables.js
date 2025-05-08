import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import io from "socket.io-client";
import { BACKEND_URL } from "../store/flux";

export const WaiterTables = () => {
    const { store, actions } = useContext(Context);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch tables when component mounts
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}api/tables`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tables');
                }
                const data = await response.json();
                setTables(data.tables || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tables:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchTables();

        // Set up socket listener for real-time updates
        if (window.socket) {
            window.socket.on('table_update', (updatedTable) => {
                setTables(prevTables => 
                    prevTables.map(table => 
                        table.id === updatedTable.id ? updatedTable : table
                    )
                );
            });

            // Clean up listener on unmount
            return () => {
                window.socket.off('table_update');
            };
        }
    }, []);

    const handleTableClick = (tableId) => {
        navigate(`/waiter/tables/${tableId}`);
    };

    const getTableStatusClass = (table) => {
        if (table.is_occupied) {
            return "bg-warning"; // Table has active order
        }
        return "bg-success"; // Table is free
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading tables...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Tables</h1>
            
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading tables...</p>
                </div>
            ) : tables.length === 0 ? (
                <div className="alert alert-info text-center">
                    <h4>No tables available</h4>
                    <p>No tables found in the database. You might need to:</p>
                    <ol className="text-start">
                        <li>Ask an administrator to add tables</li>
                        <li>Run database migration to create the tables table</li>
                        <li>Check the API connection</li>
                    </ol>
                    <button 
                        className="btn btn-primary mt-3" 
                        onClick={() => {
                            setLoading(true);
                            fetch(`${BACKEND_URL}api/tables`)
                                .then(res => res.json())
                                .then(data => {
                                    setTables(data.tables || []);
                                    setLoading(false);
                                })
                                .catch(err => {
                                    console.error("Error refreshing tables:", err);
                                    setError(err.message);
                                    setLoading(false);
                                });
                        }}
                    >
                        Refresh Tables
                    </button>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {tables.map((table) => (
                        <div className="col" key={table.id}>
                            <div 
                                className={`card h-100 shadow-sm ${getTableStatusClass(table)}`}
                                onClick={() => handleTableClick(table.id)}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="card-body">
                                    <h4 className="card-title text-center">
                                        {table.name || `Table ${table.number}`}
                                    </h4>
                                    <div className="card-text">
                                        <div className="d-flex justify-content-between mt-3">
                                            <span>
                                                <strong>Number:</strong> {table.number}
                                            </span>
                                            <span>
                                                <strong>Capacity:</strong> {table.capacity}
                                            </span>
                                        </div>
                                        <div className="mt-3">
                                            <span className="badge bg-light text-dark d-block text-center p-2">
                                                {table.is_occupied ? "Occupied" : "Available"}
                                            </span>
                                        </div>
                                        {table.is_occupied && table.active_order && (
                                            <div className="mt-3 text-center">
                                                <span className="badge bg-primary d-block p-2 mt-2">
                                                    {table.active_order.status}
                                                </span>
                                                <small className="text-muted">
                                                    Order #{table.active_order.order_number}
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="card-footer text-center">
                                    <small className="text-muted">
                                        {table.is_occupied ? "Click to manage order" : "Click to place order"}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WaiterTables;
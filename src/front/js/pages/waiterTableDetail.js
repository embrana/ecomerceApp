import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { BACKEND_URL } from "../store/flux";

export const WaiterTableDetail = () => {
    const { tableId } = useParams();
    const { store, actions } = useContext(Context);
    const [table, setTable] = useState(null);
    const [activeOrder, setActiveOrder] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const navigate = useNavigate();

    // Fetch table details and orders
    useEffect(() => {
        const fetchTableDetails = async () => {
            try {
                // Fetch table orders
                const response = await fetch(`${BACKEND_URL}api/tables/${tableId}/orders`);
                if (!response.ok) {
                    throw new Error('Failed to fetch table details');
                }
                const data = await response.json();
                setTable(data.table || null);
                
                const orders = data.orders || [];
                const active = orders.find(order => order.is_open);
                
                setActiveOrder(active || null);
                setOrderHistory(orders.filter(order => !order.is_open));
                
                // If there is an active order, set its items to the orderItems state
                if (active) {
                    setOrderItems(active.products || []);
                }
                
                // Also fetch products for menu
                actions.getProducts();
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching table details:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchTableDetails();

        // Set up socket listener for real-time updates
        if (window.socket) {
            window.socket.on('new_order', (order) => {
                if (order.table_id.toString() === tableId) {
                    // Refresh data when this table's order updates
                    fetchTableDetails();
                }
            });

            // Clean up listener on unmount
            return () => {
                window.socket.off('new_order');
            };
        }
    }, [tableId, actions]);

    // Add item to cart
    const addItemToCart = (product) => {
        actions.addToCart(product);
    };

    // Submit the order
    const handleSubmitOrder = async () => {
        try {
            if (store.cart.length === 0) {
                alert("Please add at least one item to the order");
                return;
            }

            const response = await fetch(`${BACKEND_URL}api/tables/${tableId}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`
                },
                body: JSON.stringify({ cart: store.cart })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || "Failed to create order");
            }

            const data = await response.json();
            console.log("Order submitted successfully:", data);
            
            // Clear the cart
            actions.setCart([]);
            
            // Refresh order data
            setTable(data.table);
            
            if (data.order) {
                setActiveOrder(data.order);
                setOrderItems(data.order.products || []);
            }
            
        } catch (error) {
            console.error("Error submitting order:", error);
            alert("Failed to submit order: " + error.message);
        }
    };

    // Close the table's active order
    const handleCloseOrder = async () => {
        if (!confirm("Are you sure you want to close this order?")) {
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}api/tables/${tableId}/close`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || "Failed to close order");
            }

            const data = await response.json();
            console.log("Order closed successfully:", data);
            
            // Update local state
            setTable(data.table);
            setActiveOrder(null);
            setOrderHistory([data.order, ...orderHistory]);
            
            // Clear order items and cart
            setOrderItems([]);
            actions.setCart([]);
            
        } catch (error) {
            console.error("Error closing order:", error);
            alert("Failed to close order: " + error.message);
        }
    };

    // Handler to go back to tables list
    const handleBackToTables = () => {
        navigate("/waiter/tables");
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading table details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    Error: {error}
                </div>
                <button className="btn btn-primary mt-3" onClick={handleBackToTables}>
                    Back to Tables
                </button>
            </div>
        );
    }

    if (!table) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning" role="alert">
                    Table not found or has been removed.
                </div>
                <button className="btn btn-primary mt-3" onClick={handleBackToTables}>
                    Back to Tables
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-outline-primary" onClick={handleBackToTables}>
                    <i className="fas fa-arrow-left me-2"></i>Back to Tables
                </button>
                <h2>Table {table.number}</h2>
                <div className={`badge ${table.is_occupied ? "bg-warning" : "bg-success"} p-2`}>
                    {table.is_occupied ? "Occupied" : "Available"}
                </div>
            </div>

            <div className="row">
                {/* Menu/Products Section */}
                <div className="col-lg-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Menu</h4>
                        </div>
                        <div className="card-body">
                            {store.products.length === 0 ? (
                                <p className="text-center text-muted">No products available</p>
                            ) : (
                                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
                                    {store.products
                                        .filter(product => product.is_active)
                                        .map(product => (
                                            <div className="col" key={product.id}>
                                                <div className="card h-100">
                                                    <img 
                                                        src={product.image} 
                                                        className="card-img-top" 
                                                        alt={product.name}
                                                        style={{ height: "120px", objectFit: "cover" }}
                                                    />
                                                    <div className="card-body">
                                                        <h5 className="card-title">{product.name}</h5>
                                                        <p className="card-text small text-muted">{product.description}</p>
                                                        <p className="card-text fw-bold">${product.price}</p>
                                                    </div>
                                                    <div className="card-footer d-grid">
                                                        <button 
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => addItemToCart(product)}
                                                            disabled={!store.token}
                                                        >
                                                            Add to Order
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Section */}
                <div className="col-lg-4">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">
                                {activeOrder ? `Order #${activeOrder.order_number}` : "New Order"}
                            </h4>
                        </div>
                        <div className="card-body">
                            {/* Current Cart Items (for new items) */}
                            {store.cart.length > 0 && (
                                <>
                                    <h5 className="border-bottom pb-2 mb-3">Items to Add</h5>
                                    {store.cart.map((item, index) => (
                                        <div className="d-flex justify-content-between align-items-center mb-2" key={index}>
                                            <div>
                                                <span className="fw-bold">{item.name}</span>
                                                <br />
                                                <small>${item.price} x {item.quantity}</small>
                                            </div>
                                            <div>
                                                <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                                <button 
                                                    className="btn btn-sm btn-danger ms-2"
                                                    onClick={() => actions.removeFromCart(index)}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="d-flex justify-content-between mt-3 pt-2 border-top">
                                        <span className="fw-bold">Total (New Items):</span>
                                        <span className="fw-bold">
                                            ${store.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="d-grid mt-3">
                                        <button 
                                            className="btn btn-success"
                                            onClick={handleSubmitOrder}
                                        >
                                            {activeOrder ? "Add to Order" : "Create Order"}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Current Order Items */}
                            {activeOrder && orderItems.length > 0 && (
                                <>
                                    <h5 className="border-bottom pb-2 mb-3 mt-4">Current Order</h5>
                                    {orderItems.map((item, index) => (
                                        <div className="d-flex justify-content-between align-items-center mb-2" key={index}>
                                            <div>
                                                <span className="fw-bold">{item.name}</span>
                                                <br />
                                                <small>${item.price} x {item.quantity}</small>
                                            </div>
                                            <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="d-flex justify-content-between mt-3 pt-2 border-top">
                                        <span className="fw-bold">Total (Current Order):</span>
                                        <span className="fw-bold">
                                            ${orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                                        </span>
                                    </div>
                                    {activeOrder && (
                                        <div className="d-grid mt-3">
                                            <button 
                                                className="btn btn-warning"
                                                onClick={handleCloseOrder}
                                            >
                                                Close Order
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {!activeOrder && store.cart.length === 0 && (
                                <div className="text-center text-muted py-5">
                                    <i className="fas fa-utensils fa-3x mb-3"></i>
                                    <p>No active order. Add items from the menu to create an order.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order History */}
                    {orderHistory.length > 0 && (
                        <div className="card shadow-sm">
                            <div className="card-header bg-secondary text-white">
                                <h5 className="mb-0">Order History</h5>
                            </div>
                            <div className="card-body">
                                <div className="list-group">
                                    {orderHistory.map((order) => (
                                        <div className="list-group-item list-group-item-action" key={order.id}>
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <h6 className="mb-1">Order #{order.order_number}</h6>
                                                    <small className="text-muted">
                                                        {new Date(order.date).toLocaleString()}
                                                    </small>
                                                </div>
                                                <div>
                                                    <span className={`badge ${order.status === "Completed" ? "bg-success" : "bg-secondary"}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WaiterTableDetail;
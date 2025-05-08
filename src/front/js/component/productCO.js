import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { BACKEND_URL } from "../store/flux";
import "../../styles/cart.css";

const ProductCO = ({ onPaymentSelect }) => {
    const { store, actions } = useContext(Context);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isWaiter = store.is_waiter || sessionStorage.getItem("is_waiter") === "true";

    // Fetch tables for waiter selection
    useEffect(() => {
        if (isWaiter) {
            const fetchTables = async () => {
                try {
                    setLoading(true);
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
        }
    }, [isWaiter]);

    const calculateTotal = () => {
        return store.cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
    };
    
    const handleTableOrder = async (tableId) => {
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
            
            // Si no es camarero, muestra el recibo, si es camarero solo muestra mensaje de éxito
            if (isWaiter) {
                alert(`Orden asignada correctamente a Mesa ${selectedTable}`);
                // Redirigir a la vista de la mesa podría ser útil aquí
                // window.location.href = `/waiter/tables/${selectedTable}`;
            } else {
                // Para clientes normales, mostrar el recibo
                onPaymentSelect();
            }
            
        } catch (error) {
            console.error("Error submitting order:", error);
            alert("Failed to submit order: " + error.message);
        }
    };

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6"> {/* Center the cart */}
                    <div className="panel panel-info">
                        <div className="panel-heading text-center mt-2">
                            <p className="fs-5 fw-bold">
                                <i className="fa-solid fa-cart-shopping"></i> Shopping Cart
                            </p>
                        </div>

                        <div className="panel-body mt-2">
                            {store.cart.length > 0 ? (
                                store.cart.map((item, index) => (
                                    <div
                                        className="d-flex align-items-center border-bottom py-2"
                                        key={index}
                                        style={{ fontSize: "0.9rem" }}
                                    >
                                        
                                        {/* Product Name and Price */}
                                        <div className="flex-grow-1 ms-2">
                                            <h6 className="mb-1 text-truncate">{item.name}</h6>
                                            <p className="mb-0 text-muted">${item.price}</p>
                                        </div>

                                        {/* Quantity Input */}
                                        <div className="d-flex align-items-center">
                                            <input
                                                type="number"
                                                className="form-control form-control-sm text-center mx-1"
                                                value={item.quantity || 1}
                                                readOnly
                                                style={{"maxWidth": "40px"}}
                                            />
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            className="btn btn-link btn-sm text-danger"
                                            onClick={() => actions.removeFromCart(index)}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted text-center">Your cart is empty</p>
                            )}
                        </div>

                        {/* Cart Footer */}
                        <div className="panel-footer mt-3">
                            <div className="row align-items-center">
                                <div className="col-6 text-start">
                                    <h5 style={{ fontSize: "1rem" }}>
                                        Total: <strong>${calculateTotal()}</strong>
                                    </h5>
                                </div>

                                <div className="col-6 text-end">
                                    {/* Table Selection and Payment Buttons */}
                                    {isWaiter ? (
                                        <div className="d-flex flex-column">
                                            <select 
                                                className="form-select mb-2" 
                                                onChange={(e) => setSelectedTable(e.target.value)}
                                                value={selectedTable || ""}
                                            >
                                                <option value="">Select a table</option>
                                                {tables.map(table => (
                                                    <option key={table.id} value={table.id}>
                                                        {table.name || `Table ${table.number}`}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                className="btn btn-success mb-2"
                                                onClick={() => {
                                                    if (!selectedTable) {
                                                        alert("Please select a table");
                                                        return;
                                                    }
                                                    handleTableOrder(selectedTable);
                                                }}
                                                disabled={!selectedTable}
                                            >
                                                Assign to Table
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="d-flex">
                                            <button
                                                type="button"
                                                className="btn btn-success mb-2 me-2"
                                                onClick={() => {
                                                    actions.setOrder();
                                                    onPaymentSelect();
                                                }}
                                            >
                                                Pagar en Efectivo
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-success mb-2"
                                                onClick={() => {
                                                    actions.setOrder();
                                                    onPaymentSelect();
                                                }}
                                            >
                                                Mercado Pago
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCO;

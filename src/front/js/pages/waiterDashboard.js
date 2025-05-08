import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { BACKEND_URL } from "../store/flux";

export const WaiterDashboard = () => {
    const { store, actions } = useContext(Context);
    const [tables, setTables] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(0); // For forcing refresh
    
    // Estado para el nuevo formulario de mesa
    const [newTable, setNewTable] = useState({
        number: "",
        name: "",
        capacity: 4
    });
    const [tableSubmitting, setTableSubmitting] = useState(false);
    const [tableFormError, setTableFormError] = useState(null);

    // Fetch all tables and their orders
    useEffect(() => {
        const fetchTablesAndOrders = async () => {
            try {
                setLoading(true);
                
                // Fetch tables
                const tablesResponse = await fetch(`${BACKEND_URL}/api/tables`);
                if (!tablesResponse.ok) {
                    throw new Error('Failed to fetch tables');
                }
                const tablesData = await tablesResponse.json();
                setTables(tablesData.tables || []);
                
                // Fetch orders
                actions.getOrders();
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchTablesAndOrders();

        // Set up socket listener for real-time updates
        if (window.socket) {
            window.socket.on('new_order', (order) => {
                console.log("New or updated order received:", order);
                actions.updateOrderInStore(order);
                setRefresh(prev => prev + 1); // Force component update
            });

            window.socket.on('table_update', (updatedTable) => {
                setTables(prevTables => 
                    prevTables.map(table => 
                        table.id === updatedTable.id ? updatedTable : table
                    )
                );
            });

            // Clean up listeners on unmount
            return () => {
                window.socket.off('new_order');
                window.socket.off('table_update');
            };
        }
    }, [actions]);

    // Process orders whenever store.orders or tables changes
    useEffect(() => {
        // Filter and process active orders
        const processOrders = () => {
            // Get all active orders (is_open == true)
            const active = store.orders.filter(order => order.is_open && order.table_id);
            
            // Enrich orders with table information
            const enrichedOrders = active.map(order => {
                const table = tables.find(t => t.id === order.table_id);
                return {
                    ...order,
                    tableName: table ? (table.name || `Table ${table.number}`) : `Table ${order.table_id}`,
                    tableNumber: table ? table.number : order.table_id
                };
            });
            
            setActiveOrders(enrichedOrders);
        };
        
        processOrders();
    }, [store.orders, tables, refresh]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error("Failed to update status");

            const updatedOrder = await response.json();
            actions.updateOrderInStore(updatedOrder);
            
            // If order is completed, refresh tables (table might be freed)
            if (newStatus === "Completed") {
                const tablesResponse = await fetch(`${BACKEND_URL}/api/tables`);
                if (tablesResponse.ok) {
                    const tablesData = await tablesResponse.json();
                    setTables(tablesData.tables || []);
                }
            }
            
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("Failed to update order status");
        }
    };
    
    // Manejar cambios en el formulario de nueva mesa
    const handleTableInputChange = (e) => {
        const { name, value } = e.target;
        setNewTable(prev => ({
            ...prev,
            [name]: name === "capacity" || name === "number" ? parseInt(value) || "" : value
        }));
    };
    
    // Enviar formulario para crear nueva mesa
    const handleCreateTable = async (e) => {
        e.preventDefault();
        setTableFormError(null);
        
        // Validación básica
        if (!newTable.number) {
            setTableFormError("Table number is required");
            return;
        }
        
        // Verificar si el número de mesa ya existe
        if (tables.some(t => t.number === parseInt(newTable.number))) {
            setTableFormError(`Table number ${newTable.number} already exists`);
            return;
        }
        
        try {
            setTableSubmitting(true);
            
            // Asegúrate de que tenemos un token válido antes de continuar
            if (!store.token) {
                throw new Error("Authentication required. Please log in.");
            }
            
            const response = await fetch(`${BACKEND_URL}api/tables`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`
                },
                body: JSON.stringify({
                    number: parseInt(newTable.number),
                    name: newTable.name || `Table ${newTable.number}`,
                    capacity: parseInt(newTable.capacity) || 4
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || "Failed to create table");
            }
            
            // Reset form
            setNewTable({
                number: "",
                name: "",
                capacity: 4
            });
            
            // Fetch tables again to update the list
            const tablesResponse = await fetch(`${BACKEND_URL}/api/tables`);
            if (tablesResponse.ok) {
                const tablesData = await tablesResponse.json();
                setTables(tablesData.tables || []);
            }
            
            // Close modal
            document.getElementById('addTableModalClose').click();
            
        } catch (error) {
            console.error("Error creating table:", error);
            setTableFormError(error.message);
        } finally {
            setTableSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading orders...</p>
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Waiter Dashboard</h1>
                <div>
                    <button 
                        className="btn btn-success me-2" 
                        data-bs-toggle="modal" 
                        data-bs-target="#addTableModal"
                    >
                        <i className="fas fa-plus me-2"></i>
                        Add Table
                    </button>
                    <Link to="/waiter/tables" className="btn btn-primary">
                        <i className="fas fa-table me-2"></i>
                        View Tables
                    </Link>
                </div>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Active Orders</h4>
                </div>
                <div className="card-body">
                    {activeOrders.length === 0 ? (
                        <div className="text-center text-muted py-5">
                            <i className="fas fa-coffee fa-3x mb-3"></i>
                            <p>No active orders at the moment.</p>
                            <Link to="/waiter/tables" className="btn btn-outline-primary mt-3">
                                Create New Order
                            </Link>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Table</th>
                                        <th>Order #</th>
                                        <th>Time</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>
                                                <Link to={`/waiter/tables/${order.table_id}`}>
                                                    {order.tableName}
                                                </Link>
                                            </td>
                                            <td>{order.order_number}</td>
                                            <td>{new Date(order.date).toLocaleTimeString()}</td>
                                            <td>{order.products.length} items</td>
                                            <td>
                                                ${order.products.reduce(
                                                    (sum, product) => sum + product.price * product.quantity,
                                                    0
                                                ).toFixed(2)}
                                            </td>
                                            <td>
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        {order.status}
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        {["Pending", "In Progress", "Ready", "Delivered", "Completed"].map((status) => (
                                                            <li key={status}>
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() => handleStatusChange(order.id, status)}
                                                                >
                                                                    {status}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </td>
                                            <td>
                                                <Link 
                                                    to={`/waiter/tables/${order.table_id}`} 
                                                    className="btn btn-sm btn-primary me-2"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </Link>
                                                {/* Add print button or other actions here */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-success text-white">
                    <h4 className="mb-0">Table Status</h4>
                </div>
                <div className="card-body">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
                        {tables.map((table) => (
                            <div className="col" key={table.id}>
                                <div className={`card h-100 ${table.is_occupied ? 'border-warning' : 'border-success'}`}>
                                    <div className="card-body">
                                        <h5 className="card-title">{table.name || `Table ${table.number}`}</h5>
                                        <p className="card-text">
                                            <span className={`badge ${table.is_occupied ? 'bg-warning' : 'bg-success'}`}>
                                                {table.is_occupied ? 'Occupied' : 'Available'}
                                            </span>
                                        </p>
                                        {table.is_occupied && table.active_order && (
                                            <p className="card-text small">
                                                Order: {table.active_order.order_number}<br />
                                                Status: {table.active_order.status}
                                            </p>
                                        )}
                                    </div>
                                    <div className="card-footer bg-transparent">
                                        <Link to={`/waiter/tables/${table.id}`} className="btn btn-sm btn-primary w-100">
                                            {table.is_occupied ? 'Manage Order' : 'Create Order'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Modal para añadir mesas */}
            <div className="modal fade" id="addTableModal" tabIndex="-1" aria-labelledby="addTableModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addTableModalLabel">Add New Table</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="addTableModalClose"></button>
                        </div>
                        <form onSubmit={handleCreateTable}>
                            <div className="modal-body">
                                {tableFormError && (
                                    <div className="alert alert-danger" role="alert">
                                        {tableFormError}
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label htmlFor="tableNumber" className="form-label">Table Number*</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="tableNumber" 
                                        name="number"
                                        value={newTable.number}
                                        onChange={handleTableInputChange}
                                        min="1"
                                        required
                                    />
                                    <div className="form-text">Unique number to identify the table</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tableName" className="form-label">Table Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="tableName" 
                                        name="name"
                                        value={newTable.name}
                                        onChange={handleTableInputChange}
                                        placeholder="Table X (optional)"
                                    />
                                    <div className="form-text">Optional descriptive name</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tableCapacity" className="form-label">Capacity</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="tableCapacity" 
                                        name="capacity"
                                        value={newTable.capacity}
                                        onChange={handleTableInputChange}
                                        min="1"
                                        max="20"
                                    />
                                    <div className="form-text">Number of seats at the table</div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={tableSubmitting}
                                >
                                    {tableSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Creating...
                                        </>
                                    ) : "Create Table"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaiterDashboard;
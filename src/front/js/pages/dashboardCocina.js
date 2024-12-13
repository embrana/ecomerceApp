import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

const DashboardCocina = () => {
  const { store, actions } = React.useContext(Context);
  const { orders, products } = store;
  const [currentView, setCurrentView] = useState("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    actions.getOrders();
    actions.getProducts();
  }, []);

  const placeholderImage =
    "https://res.cloudinary.com/dnmm7omko/image/upload/v1733842727/ubstteb7dmizj50zozse.webp";

  const calculateOrderTotal = (products) => {
    return products?.reduce((sum, product) => sum + (product.price || 0) * (product.quantity || 1), 0).toFixed(2);
  };

  const filteredOrders = orders.filter((order) =>
    order.order_number?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const updatedOrder = await response.json();
      actions.updateOrderInStore(updatedOrder);
      setMessage({ type: "success", text: "Order status updated successfully." });
    } catch (error) {
      console.error("Error updating order status:", error);
      setMessage({ type: "error", text: "Failed to update order status." });
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Administración</h1>

      {/* Action and Search Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header text-center bg-primary text-white">
          <h4>Acciones</h4>
        </div>
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
            <div className="d-flex flex-wrap mb-3 mb-md-0">
              <div className="dropdown me-2">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Contenidos
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" onClick={() => setCurrentView("orders")}>
                      Ordenes
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => setCurrentView("items")}>
                      Items menu
                    </button>
                  </li>
                </ul>
              </div>
              <form className="d-flex justify-content-start" role="search" onSubmit={(e) => e.preventDefault()}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Buscar"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">Buscar</button>
              </form>
            </div>
            <div className="d-flex">
              <Link to="/add/menu">
                <button className="btn btn-primary me-2">Añadir Menu</button>
              </Link>
              <Link to="/menu">
                <button className="btn btn-primary">Compra Menu</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Display message */}
      {message && (
        <div className={`alert alert-${message.type === "success" ? "success" : "danger"} mt-3`} role="alert">
          {message.text}
        </div>
      )}

      {/* Conditionally Render Content */}
      {currentView === "orders" ? (
        <div className="card shadow-sm mb-4 bg-light"> {/* Background color for Orders */}
          <div className="card-header text-center bg-primary text-white">
            <h5>Ordenes</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive mt-3">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Fecha</th>
                    <th>Orden</th>
                    <th>Estado</th>
                    <th>Monto</th>
                    <th>Unidades</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5">No orders found.</td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, index) => (
                      <React.Fragment key={order.id || index}>
                        <tr className="table-success">
                          <td>{new Date(order.date).toLocaleDateString() || "N/A"}</td>
                          <td>{order.order_number || "N/A"}</td>
                          <td>
                            <div className="dropdown">
                              <button
                                className="btn btn-sm btn-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                {order.status || "N/A"}
                              </button>
                              <ul className="dropdown-menu">
                                {["Pendiente", "En produccion", "Completada", "Cancelada"].map((status) => (
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
                          <td>${calculateOrderTotal(order.products)}</td>
                          <td></td>
                        </tr>
                        {order.products?.length > 0 ? (
                          order.products.map((product, productIndex) => (
                            <tr key={productIndex}>
                              <td colSpan="1"></td>
                              <td>{product.name || "N/A"}</td>
                              <td>
                                <img
                                  src={product.image || placeholderImage}
                                  alt={product.name || "Product"}
                                  style={{ width: "50px" }}
                                />
                              </td>
                              <td>{`$${product.price || 0}`}</td>
                              <td>{product.quantity || 1}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5">No products in this order.</td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm mb-4 bg-secondary"> {/* Background color for Products */}
          <div className="card-header text-center bg-primary text-white">
            <h5>Productos en el Menu</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive mt-3">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th>Imagen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="4">No products found.</td>
                    </tr>
                  ) : (
                    filteredProducts.map((product, index) => (
                      <tr key={index}>
                        <td>{product.name || "N/A"}</td>
                        <td>{product.stock !== undefined ? product.stock : "N/A"}</td>
                        <td>{`$${product.price || 0}`}</td>
                        <td>
                          <img
                            src={product.image || placeholderImage}
                            alt={product.name || "Item"}
                            style={{ width: "50px" }}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCocina;


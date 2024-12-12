import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

const DashboardCocina = () => {
  const { store, actions } = React.useContext(Context);
  const { orders, products } = store; 
  const [currentView, setCurrentView] = useState("orders"); // 'orders' or 'products'

  useEffect(() => {
    actions.getOrders();
    actions.getProducts();
  }, []);

  const placeholderImage =
    "https://res.cloudinary.com/dnmm7omko/image/upload/v1733842727/ubstteb7dmizj50zozse.webp";

  const calculateOrderTotal = (products) => {
    return products?.reduce((sum, product) => sum + (product.price || 0) * (product.quantity || 1), 0).toFixed(2);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-2 text-center">Administracion</h1>

      {/* Action and Search Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 p-3">
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
          <form className="d-flex justify-content-start" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
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

      {/* Conditionally Render Content */}
      {currentView === "orders" ? (
        <div className="table-responsive mt-3">
          <h2>Ordenes</h2>
          <table className="table table-secondary table-striped">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Orden</th>
                <th>Estado</th>
                <th>Monto</th>
                <th>Unidades</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="10">No orders found.</td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <React.Fragment key={order.id || index}>
                    <tr>
                      <td>{new Date(order.date).toLocaleDateString() || "N/A"}</td>
                      <td>{order.order_number || "N/A"}</td>
                      <td>{order.status || "N/A"}</td>
                      <td>${calculateOrderTotal(order.products)}</td>
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
                        <td colSpan="10">No products in this order.</td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-responsive mt-3">
          <h2>Productos en el Menu</h2>
          <table className="table table-secondary table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Imagen</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="3">No products found.</td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name || "N/A"}</td>
                    <td>{product.stock || "N/A"}</td>
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
      )}
    </div>
  );
};

export default DashboardCocina;

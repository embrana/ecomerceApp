import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

const DashboardCocina = () => {
  const { store, actions } = React.useContext(Context);
  const { orders } = store; // Orders contain the product data
  const [currentView, setCurrentView] = useState("orders"); // 'orders' or 'products'
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query

  useEffect(() => {
    actions.getOrders(); // Fetch orders data
  }, []);

  const placeholderImage =
    "https://res.cloudinary.com/dnmm7omko/image/upload/v1733842727/ubstteb7dmizj50zozse.webp";

  const calculateOrderTotal = (products) => {
    return products?.reduce(
      (sum, product) => sum + (product.price || 0) * (product.quantity || 1),
      0
    ).toFixed(2);
  };

  const filteredOrders = orders.filter((order) =>
    order.order_number?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Extract unique products from orders
  const uniqueProducts = React.useMemo(() => {
    const allProducts = orders.flatMap((order) => order.products || []);
    
    // Use a Map to store products by their unique `id` or name
    const productMap = new Map();
  
    allProducts.forEach((product) => {
      const uniqueKey = product.id || product.name; // Fallback to name if `id` is missing
      if (!productMap.has(uniqueKey)) {
        productMap.set(uniqueKey, product);
      }
    });
  
    return Array.from(productMap.values());
  }, [orders]);

  return (
    <div className="container mt-5">
      <h1 className="mb-2 text-center">Administración</h1>

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
                <button
                  className="dropdown-item"
                  onClick={() => setCurrentView("orders")}
                >
                  Órdenes
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setCurrentView("items")}
                >
                  Items Menú
                </button>
              </li>
            </ul>
          </div>
          <form
            className="d-flex justify-content-start"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="form-control me-2"
              type="search"
              placeholder="Número de orden"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Buscar
            </button>
          </form>
        </div>
        <div className="d-flex">
          <Link to="/add/menu">
            <button className="btn btn-primary me-2">Añadir Menú</button>
          </Link>
          <Link to="/menu">
            <button className="btn btn-primary">Compra Menú</button>
          </Link>
        </div>
      </div>

      {/* Conditionally Render Content */}
      {currentView === "orders" ? (
        <div className="table-responsive mt-3">
          <h2>Órdenes</h2>
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5">No se encontraron órdenes.</td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <React.Fragment key={order.id || index}>
                    <tr>
                      <td>
                        {new Date(order.date).toLocaleDateString() || "N/A"}
                      </td>
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
                              alt={product.name || "Producto"}
                              style={{ width: "50px" }}
                            />
                          </td>
                          <td>{`$${product.price || 0}`}</td>
                          <td>{product.quantity || 1}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No hay productos en esta orden.</td>
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
          <h2>Items en el Menú</h2>
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
              {uniqueProducts.length === 0 ? (
                <tr>
                  <td colSpan="4">No se encontraron productos.</td>
                </tr>
              ) : (
                uniqueProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name || "N/A"}</td>
                    <td>{product.stock || "N/A"}</td>
                    <td>{`$${product.price || 0}`}</td>
                    <td>
                      <img
                        src={product.image || placeholderImage}
                        alt={product.name || "Producto"}
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


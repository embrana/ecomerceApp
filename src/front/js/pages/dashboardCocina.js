import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

const DashboardCocina = () => {
  const { store, actions } = React.useContext(Context);
  const { orders } = store;

  useEffect(() => {
    actions.getOrders();
  }, []);

  const placeholderImage =
    "https://res.cloudinary.com/dnmm7omko/image/upload/v1733842727/ubstteb7dmizj50zozse.webp";

  return (
    <div className="container mt-5">
      <h1 className="mb-2">Listado De Menus</h1>
      <div className="d-flex justify-content-between mt-4 p-5">
        <div className="d-flex">
          <button
            className="btn btn-secondary dropdown-toggle me-2"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Action
          </button>
          <ul className="dropdown-menu">
            <li><button className="dropdown-item">Action</button></li>
            <li><button className="dropdown-item">Another action</button></li>
            <li><button className="dropdown-item">Something else here</button></li>
          </ul>
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
        <div>
          <Link to="/add/menu">
            <button className="btn btn-primary">Añadir Menu</button>
          </Link>
          <Link to="/menu" className="ms-2">
            <button className="btn btn-primary">Compra Menu</button>
          </Link>
        </div>
      </div>
      <div>
        <table className="table table-secondary table-striped mt-3">
          <thead>
            <tr>
              <th>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" />
                </div>
              </th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Descripcion</th>
              <th>Estado</th>
              <th>Categoria</th>
              <th>Stock</th>
              <th>Imagen</th>
              <th>Precio</th>
              <th></th>
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
                    <th>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`orderCheck${index}`}
                        />
                      </div>
                    </th>
                    <td>{new Date(order.date).toLocaleDateString() || "N/A"}</td>
                    <td>{order.order_number || "N/A"}</td>
                    <td>{order.description || "N/A"}</td>
                    <td>{order.status || "N/A"}</td>
                    <td colSpan="3">{order.category || "N/A"}</td>
                    <td className="d-flex justify-content-end">
                      <Link to="/add/menu" className="btn">
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                      <button
                        className="btn dropdown-toggle me-2"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fa-solid fa-ellipsis"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li><button className="dropdown-item">Edit</button></li>
                        <li><button className="dropdown-item">Delete</button></li>
                      </ul>
                    </td>
                  </tr>
                  {order.products?.length > 0 ? (
                    order.products.map((product, productIndex) => (
                      <tr key={productIndex}>
                        <td colSpan="2"></td>
                        <td>{product.name || "N/A"}</td>
                        <td>{product.description || "N/A"}</td>
                        <td>{product.status || "N/A"}</td>
                        <td>{product.category || "N/A"}</td>
                        <td>{product.stock || 0}</td>
                        <td>
                          <img
                            src={product.image || placeholderImage}
                            alt={product.name || "Product"}
                            style={{ width: "50px" }}
                          />
                        </td>
                        <td>{`$${product.price || 0}`}</td>
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
    </div>
  );
};

export default DashboardCocina;

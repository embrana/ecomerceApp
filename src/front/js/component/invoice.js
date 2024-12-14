import React, { useContext } from "react";
import { Context } from "../store/appContext";

const Receipt = () => {
    const { store } = useContext(Context);
    const { order_data } = store;

    if (!order_data || !order_data.items) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning text-center">
                    Todavía no has hecho tu pedido.
                </div>
            </div>
        );
    }

    const calculateTotal = () => {
        return order_data.items
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2);
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-header text-center bg-primary text-white">
                    <h3 className="mb-0">Recibo de la Orden</h3>
                </div>
                <div className="card-body">
                    <div className="mb-4">
                        <h5 className="mb-1">Número de Orden: {order_data.order_number}</h5>
                        <p className="text-muted mb-0">
                            Fecha: {new Date(order_data.date).toLocaleString()}
                        </p>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Producto</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order_data.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className="text-end">
                                        <strong>Total:</strong>
                                    </td>
                                    <td>${calculateTotal()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div className="card-footer text-center bg-light">
                    <p className="mb-0">¡Gracias por tu compra!</p>
                </div>
            </div>
        </div>
    );
};

export default Receipt;

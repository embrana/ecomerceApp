import React, { useContext } from "react";
import { Context } from "../store/appContext";

const Receipt = () => {
    const { store } = useContext(Context);

    const { order_data } = store;

    // Show a loading or placeholder message if no order data is available
    if (!order_data || !order_data.items) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning text-center">
                    No order found. Please place an order to view the receipt.
                </div>
            </div>
        );
    }

    const calculateTotal = () => {
        return order_data.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header text-center">
                    <h3>Order Receipt</h3>
                </div>
                <div className="card-body">
                    <h5>Order Number: {order_data.order_number}</h5>
                    <p>Date: {new Date(order_data.date).toLocaleString()}</p>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
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
                <div className="card-footer text-center">
                    <p>Thank you for your purchase!</p>
                </div>
            </div>
        </div>
    );
};

export default Receipt;

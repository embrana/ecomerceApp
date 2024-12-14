import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import ProductCO from "../component/productCO";
import "../../styles/home.css";
import Receipt from "../component/invoice";

export const CheckOut = () => {
    const { actions } = useContext(Context);
    const [paymentSelected, setPaymentSelected] = useState(false); // Track if a payment method is selected

    useEffect(() => {
        actions.getProducts();
    }, []);

    return (
        <div className="container mx-5">
            {/* Conditionally render ProductCO or Receipt */}
            {!paymentSelected && (
                <ProductCO onPaymentSelect={() => setPaymentSelected(true)} />
            )}
            {paymentSelected && <Receipt />}
        </div>
    );
};

export default CheckOut;

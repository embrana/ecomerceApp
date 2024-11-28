import React from "react";
import Card from "../component/card"; // Importing Card component
import { useContext } from "react";
import { Context } from "../store/appContext"; // Importing Flux context

export const Menu = () => {
    const { store } = useContext(Context); // Accessing store from Flux context

    return (
        <div className="container">
            <div className="row">
                {/* Map through store.menu array and create Card components */}
                {store.menu.map((item) => (
                    <div className="col-12 col-sm-6 col-md-4 mb-4" key={item.id}>
                        <Card item={item} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;

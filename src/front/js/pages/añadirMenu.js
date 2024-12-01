import React from "react";

const AñadirMenu = () => {
    return (

        <div className="container mt-5">
            <h1 className="mb-2">Listado De Menus</h1>
            <div className="d-flex justify-content-between mt-4 p-5d">
                <div className="d-flex">
                </div>
            </div>
            <div className="d-felx">
                <button className="btn btn-primary justify-content-end! me-2" type="submit"><i class="fa-solid fa-angles-left"></i></button>
                <button className="btn btn-primary justify-content-end! me-2" type="submit"><i class="fa-solid fa-angle-left"></i></button>
                <button className="btn btn-primary justify-content-end! me-2" type="submit"><i class="fa-solid fa-angle-right"></i></button>
                <button className="btn btn-primary justify-content-end!" type="submit"><i class="fa-solid fa-angles-right"></i></button>
            </div>
        </div>

    )
};

export default AñadirMenu;

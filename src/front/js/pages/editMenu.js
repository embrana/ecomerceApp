import React from "react";

const EditMenu = () => {
    return (

        <div className="container mt-5">
            <div className="container mt-5">
                <div className="p-2 mb-2 bg-primary text-white text-center">Editar Menu</div>
                <div className="d-flex justify-content-between mt-4 p-5d">
                    <div className="d-flex">
                    </div>
                </div>

            </div>
            <div className="d-flex justify-content-between mt-4 ">
                <div className=" " style={{ width: "49%" }}>
                    <div className="form-floating">
                        <input type="Nombre" className="form container mx-2" style={{ height: "40px" }} placeholder="Nombre del menu" />
                    </div>
                    <div className="form-floating mt-2">
                        <input type="tipo" className="form container mx-2" style={{ height: "40px" }} placeholder="Tipo de menu" />
                    </div>
                    <div className="d-flex justify-content-between mt-2 mx-2 " style={{ height: "40px" }}>
                        <div className="d-flex" style={{ width: "50%" }}>
                            <select className="form-select me-2" aria-label="Default select example">
                                <option selected>Categoria</option>
                                <option value="1">Menu Ejecutivo</option>
                                <option value="2">Minutas</option>
                                <option value="3">Bebidas3</option>
                            </select>

                        </div>
                        <div className="form container" style={{ width: "50%" }}>
                            <input type="stock" className="form" style={{ height: "40px" }} placeholder="stock" />
                        </div>
                    </div>
                    <div className="container d-flex justify-content-start mt-2">
                        <button type="button" style={{ width: "60px", height: "60px" }} className="btn btn-secondary me-2"><i className="fa-solid fa-image"></i></button>
                        <button type="button" style={{ width: "60px", height: "60px" }} className="btn btn-secondary"><i class="fa-regular fa-calendar-days"></i></button>
                    </div>
                </div>
                <div className="mb-4" style={{ width: "50%" }}>
                    <div className="form-floating container ps-1">
                        <textarea className="form container" placeholder="Descripcion detallada del plato." style={{ height: "200px" }}></textarea>
                    </div>
                    <div className="d-flex justify-content-start mt-2" style={{ width: "50%" }}>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label" for="flexCheckDefault">
                                Activo
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label" for="flexCheckDefault">
                                Inactivo
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-end">
            <a className="btn btn-secondary justify-content-end! me-2" href="https://fluffy-space-sniffle-v6gw54q4vvxg3x5gx-3000.app.github.dev/dashboard/cocina" role="submit">Cancelar</a>
            <a className="btn btn-primary justify-content-end!" href="https://fluffy-space-sniffle-v6gw54q4vvxg3x5gx-3000.app.github.dev/dashboard/cocina" role="submit">Aceptar</a>
            </div>
        </div>

    )
};

export default EditMenu;

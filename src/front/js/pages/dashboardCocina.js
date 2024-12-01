import React from "react";

const DashboardCocina = () => {
    return (

        <div className="container mt-5">
            <h1 className="mb-2">Listado De Menus</h1>
            <div className="d-flex justify-content-between mt-4 p-5d">
                <div className="d-flex">
                    <button className="btn btn-secondary dropdown-toggle me-2 " type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Action
                    </button>
                    <ul className="dropdown-menu ">
                        <li><a className="dropdown-item" href="#">Action</a></li>
                        <li><a className="dropdown-item" href="#">Another action</a></li>
                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                    <form className="d-flex justify-content-start" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-primary" type="submit">Buscar</button>
                    </form>
                </div>
                <div>
                    <a className="btn btn-primary ustify-content-end!" href="https://fluffy-space-sniffle-v6gw54q4vvxg3x5gx-3000.app.github.dev/add/menu" role="button">Añadir Menu</a>
                </div>
            </div>
            <div>
                <table className="table table-secondary-emphasis table-striped mt-3 .bg-secundario">
                    <thead>
                        <tr>
                            <th scope="col"><div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" />
                                <label className="form-check-label" for="flexCheckIndeterminate" />
                            </div></th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Descripcion</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Imagen</th>
                            <th scope="col">Precio</th>
                            <th scope="col"></th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row"><div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" />
                                <label className="form-check-label" for="flexCheckIndeterminate" />
                            </div></th>
                            <td>01/06/23</td>
                            <td>Vegetariano</td>
                            <td>Milanesa de Seitan y Guarnicion</td>
                            <td>Activo</td>
                            <td>Menu Ejecutivo</td>
                            <td>150</td>
                            <td><i className="fa-solid fa-image"></i></td>
                            <td>$150</td>
                            <td><i className="fa-solid fa-pen m-2"></i> <i className="fa-solid fa-download"></i> <i className="fa-solid fa-ellipsis m-auto"></i></td>

                        </tr>

                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-end mt-5">
                <div className="d-flex">
                    <select className="form-select me-2" aria-label="Default select example">
                        <option selected>1</option>
                        <option value="1">2</option>
                        <option value="2">3</option>
                        <option value="3">4</option>
                    </select>
                </div>
                <p className="d-flex mx-4 "> 1-10 of 10</p>
                <div className="d-felx">
                    <button className="btn btn-primary justify-content-end! me-2" type="submit"><i className="fa-solid fa-angles-left"></i></button>
                    <button className="btn btn-primary justify-content-end! me-2" type="submit"><i className="fa-solid fa-angle-left"></i></button>
                    <button className="btn btn-primary justify-content-end! me-2" type="submit"><i className="fa-solid fa-angle-right"></i></button>
                    <button className="btn btn-primary justify-content-end!" type="submit"><i className="fa-solid fa-angles-right"></i></button>
                </div>
            </div>
        </div >

    )
};

export default DashboardCocina;
import React from "react";
import { Link } from "react-router-dom";

const DashboardCocina = () => {
    return (
        <div className="container mt-5">
            <h1 className="mb-2">Listado De Menus</h1>
            <div className="d-flex justify-content-between mt-4 p-5">
                <div className="d-flex">
                    <button className="btn btn-secondary dropdown-toggle me-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Action
                    </button>
                    <ul className="dropdown-menu">
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
                    <Link to="/add/menu">
                        <button className="btn btn-primary" role="button">Añadir Menu</button>
                    </Link>
                </div>
            </div>
            <div>
                <table className="table table-secondary table-striped mt-3">
                    <thead>
                        <tr>
                            <th scope="col">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="flexCheckIndeterminate" />
                                    <label className="form-check-label" htmlFor="flexCheckIndeterminate"></label>
                                </div>
                            </th>
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
                            <th scope="row">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="flexCheckIndeterminateRow" />
                                    <label className="form-check-label" htmlFor="flexCheckIndeterminateRow"></label>
                                </div>
                            </th>
                            <td>01/06/23</td>
                            <td>Vegetariano</td>
                            <td>Milanesa de Seitan y Guarnicion</td>
                            <td>Activo</td>
                            <td>Menu Ejecutivo</td>
                            <td>150</td>
                            <td><i className="fa-solid fa-image"></i></td>
                            <td>$150</td>
                            <td className="d-flex justify-content-end">
                                <Link to="/add/menu" className="btn">
                                    <i className="fa-solid fa-pen"></i>
                                </Link>
                                <button className="btn dropdown-toggle me-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="fa-solid fa-ellipsis"></i>
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Activo</a></li>
                                    <li><a className="dropdown-item" href="#">Inactivo</a></li>
                                </ul>
                                <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    <i className="fa-solid fa-trash"></i>
                                </button>

                                {/* Modal */}
                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">¿Está seguro que desea eliminar este menú de forma permanente?</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                                <button type="button" className="btn btn-primary">Eliminar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-end mt-5">
                <div className="d-flex">
                    <select className="form-select me-2" aria-label="Default select example">
                        <option selected>1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <p className="mx-4">1-10 of 10</p>
                <div className="d-flex">
                    <button className="btn btn-primary me-2" type="button"><i className="fa-solid fa-angles-left"></i></button>
                    <button className="btn btn-primary me-2" type="button"><i className="fa-solid fa-angle-left"></i></button>
                    <button className="btn btn-primary me-2" type="button"><i className="fa-solid fa-angle-right"></i></button>
                    <button className="btn btn-primary" type="button"><i className="fa-solid fa-angles-right"></i></button>
                </div>
            </div>
        </div>
    );
};

export default DashboardCocina;

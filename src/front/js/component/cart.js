import React, { useContext } from "react";
import { Context } from "../store/appContext";

const Cart = () => {
    const { store } = useContext(Context);

    return (
        <div className="container my-4">
            {/* <h3>Your Cart</h3> */}
            {/* {store.cart.length > 0 ? (
                <ul className="list-group">
                    {store.cart.map((item, index) => (
                        <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                            {item.name}
                            <span className="badge bg-primary rounded-pill">{item.price ? `$${item.price}` : "Free"}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted">Your cart is empty.</p>
            )} */}
            <div className="row border">
                <div className="col-xs-8">
                    <div className="panel panel-info mt-2">
                        <div className="panel-heading">
                            <div className="panel-title">
                                <div className="row">
                                    <div className="col-6">
                                        <h5><span className="glyphicon glyphicon-shopping-cart"></span> Shopping Cart</h5>
                                    </div>
                                    <div className="col-6">
                                        <button type="button" className="btn btn-primary btn-sm btn-block">
                                            <span className="glyphicon glyphicon-share-alt"></span> Continue shopping
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="panel-body mt-2">
                            <div className="row">
                                <div className="col-2"><img className="img-responsive" src="http://placehold.it/100x70"/>
                                </div>
                                <div className="col-4">
                                    <h4 className="product-name"><strong>Product name</strong></h4><h4><small>Product description</small></h4>
                                </div>
                                <div className="col-6">
                                    <div className="col-6 text-right">
                                        <h6><strong>25.00 <span className="text-muted">x</span></strong></h6>
                                    </div>
                                    <div className="col-4">
                                        <input type="text" className="form-control input-sm" value="1" />
                                    </div>
                                    <div className="col-2">
                                        <button type="button" className="btn btn-link btn-xs">
                                            <span className="glyphicon glyphicon-trash"> </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-2"><img className="img-responsive" src="http://placehold.it/100x70"/>
                                </div>
                                <div className="col-4">
                                    <h4 className="product-name"><strong>Product name</strong></h4><h4><small>Product description</small></h4>
                                </div>
                                <div className="col-6">
                                    <div className="col-6 text-right">
                                        <h6><strong>25.00 <span className="text-muted">x</span></strong></h6>
                                    </div>
                                    <div className="col-4">
                                        <input type="text" className="form-control input-sm" value="1" />
                                    </div>
                                    <div className="col-2">
                                        <button type="button" className="btn btn-link btn-xs">
                                            <span className="glyphicon glyphicon-trash"> </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-2"><img className="img-responsive" src="http://placehold.it/100x70"/>
                                </div>
                                <div className="col-4">
                                    <h4 className="product-name"><strong>Product name</strong></h4><h4><small>Product description</small></h4>
                                </div>
                                <div className="col-6">
                                    <div className="col-6 text-right">
                                        <h6><strong>25.00 <span className="text-muted">x</span></strong></h6>
                                    </div>
                                    <div className="col-4">
                                        <input type="text" className="form-control input-sm" value="1" />
                                    </div>
                                    <div className="col-2">
                                        <button type="button" className="btn btn-link btn-xs">
                                            <span className="glyphicon glyphicon-trash"> </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="panel-footer mb-2">
                            <div className="row text-center">
                                <div className="col-9">
                                    <h4 className="text-right">Total <strong>$50.00</strong></h4>
                                </div>
                                <div className="col-3">
                                    <button type="button" className="btn btn-success btn-block">
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

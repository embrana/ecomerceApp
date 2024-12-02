import React, { useState } from 'react';

const NewProduct = () => {

    const [image, setImage] = useState(null);

    const [product, setProduct] = useState({
        name: '',
        type: '',
        description: ''
    });

    const handlePublish = async (e) => {
        e.preventDefault();
        console.log('Publishing product', product, image);

        const formData = new FormData();

        formData.append('name', product.name);
        formData.append('type', product.type);
        formData.append('description', product.description);
        formData.append('image', image);

        const resp = await fetch(process.env.BACKEND_URL + 'api/products', {
            method: 'POST',
            body: formData
        });
        if (resp.ok) {
            alert('Product published');
        }

        const data = await resp.json();
        console.log(data);
    }

    return (<>
        <div className="col-md-7 col-lg-8 d-flex flex-column justify-content-center mx-auto">
            <h1 className='text-center mt-4'>New Product</h1>
            <form className="needs-validation" noValidate="">
                <div className="row g-3">
                    <div className="col-sm-6">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" placeholder="" value={product.name || ''} required=""
                            onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        />
                        <div className="invalid-feedback">
                            Valid name  for product is required.
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <label htmlFor="product-type" className="form-label">Type</label>
                        <input type="text" className="form-control" id="product-type" placeholder="" value={product.type || ''} required=""
                            onChange={(e) => setProduct({ ...product, type: e.target.value })}
                        />
                        <div className="invalid-feedback">
                            Valid product-type is required.
                        </div>
                    </div>

                    <div className="col-12 my-2">
                        <label htmlFor="description" className="form-label">Description</label>
                        <div className="input-group has-validation">
                            <input type="text" className="form-control" id="description" placeholder="Some text" required=""
                                value={product.description || ''}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            />
                            <div className="invalid-feedback">
                                Type is required.
                            </div>
                        </div>
                    </div>

                    {!image && <div className="col-12 my-2">
                        <div className="input-group mb-3">
                            <input type="file" className="form-control" id="input-image"
                                accept='image/*'
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                            <label className="input-group-text" htmlFor="input-image">Upload</label>
                        </div>
                    </div>}

                    {
                        image && <div className="col-12 my-2">
                            <img src={URL.createObjectURL(image)} alt="..." className="img-thumbnail" />
                        </div>
                    }

                    {
                        image && <div className="col-12 my-2">
                            <button className="btn btn-danger" onClick={() => setImage(null)}>Remove</button>
                        </div>
                    }

                </div>
                <button className="w-100 btn btn-primary btn-lg" type="submit" onClick={handlePublish}>Publish</button>
            </form>
        </div>
    </>
    );
}

export default NewProduct;
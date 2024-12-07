import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

const AddMenu = () => {
  const { actions } = useContext(Context);
  const [menu, setMenu] = useState({
    name: "",
    type: "",
    category: "",
    stock: "",
    description: "",
    isActive: true,
    price: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePublishMenu = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Prepare the form data
    const formData = new FormData();
    formData.append("name", menu.name);
    formData.append("type", menu.type);
    formData.append("stock", menu.stock);
    formData.append("description", menu.description);
    formData.append("isActive", menu.isActive);
    formData.append("price", menu.price);
    if (image) {
      formData.append("image", image);
    }

    console.log("Stock value:", menu.stock);

    // Use the Flux action to publish the menu
    const result = await actions.publishProduct(formData);
    console.log("API Response:", result); // Log the API response

    if (!result.success) {
      setError(result.message); // Show error message
    } else {
      setSuccess(result.message); // Show success message
      // Clear the form after successful submission
      setMenu({
        name: "",
        type: "",
        stock: "",
        description: "",
        isActive: true,
        price:"",
      });
      setImage(null);
    }
  };

  return (
    <div className="container mt-5">
      <div className="p-2 mb-2 bg-primary text-white text-center">Añadir Menu</div>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handlePublishMenu}>
        <div className="d-flex justify-content-between mt-4">
          <div style={{ width: "49%" }}>
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del menu"
                value={menu.name}
                onChange={(e) => setMenu({ ...menu, name: e.target.value })}
                required
              />
              <label>Nombre del menu</label>
            </div>
            <div className="d-flex mb-2">
              <select
                className="form-select me-2"
                value={menu.type}
                onChange={(e) => setMenu({ ...menu, type: e.target.value })}
                required
              >
                <option value="">Categoria</option>
                <option value="Menu Ejecutivo">Menu Ejecutivo</option>
                <option value="Minutas">Minutas</option>
                <option value="Bebidas">Bebidas</option>
              </select>
              <label>Stock</label>
              <input
                type="number"
                className="form-control"
                placeholder="Stock"
                value={menu.stock}
                onChange={(e) => setMenu({ ...menu, stock: e.target.value })}
                required
              />
              <label>Precio</label>
               <input
                type="number"
                className="form-control"
                placeholder="Precio"
                value={menu.price}
                onChange={(e) => setMenu({ ...menu, price: e.target.value })}
                required
              />
            </div>
            <div className="input-group mb-3">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <label className="input-group-text">Upload</label>
            </div>
            {image && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{ maxHeight: "150px" }}
                />
                <button
                  type="button"
                  className="btn btn-danger mt-2"
                  onClick={() => setImage(null)}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
          <div style={{ width: "50%" }}>
            <textarea
              className="form-control mb-2"
              placeholder="Descripcion detallada del plato"
              style={{ height: "200px" }}
              value={menu.description}
              onChange={(e) => setMenu({ ...menu, description: e.target.value })}
              required
            ></textarea>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="active"
                checked={menu.isActive}
                onChange={(e) => setMenu({ ...menu, isActive: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="active">
                Activo
              </label>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-3">
          <button type="reset" className="btn btn-secondary me-2">
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Aceptar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMenu;

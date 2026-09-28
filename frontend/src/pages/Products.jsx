import { useEffect, useState } from "react";
import api from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");

        setProducts(response.data.products);
      } catch (error) {
        setMessage("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);

      setMessage(response.data.message);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id),
      );
    } catch (error) {
      console.log("DELETE ERROR:", error);
      console.log("ERROR RESPONSE:", error.response?.data);

      setMessage(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      await api.post("/auth/logout", {
        refreshToken,
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.location.href = "/login";
    } catch (error) {
      console.log("LOGOUT ERROR:", error);
      console.log("ERROR RESPONSE:", error.response?.data);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.location.href = "/login";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (editingId) {
        response = await api.put(`/products/${editingId}`, formData);

        setMessage(response.data.message);

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === editingId ? response.data.product : product,
          ),
        );

        setEditingId(null);
      } else {
        response = await api.post("/products", formData);

        setMessage(response.data.message);

        setProducts((prevProducts) => [...prevProducts, response.data.product]);
      }

      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: "",
      });
    } catch (error) {
      const errors = error.response?.data?.errors;

      if (errors && errors.length > 0) {
        setMessage(errors[0].msg);
      } else {
        setMessage(error.response?.data?.message || "Failed to save product");
      }
    }
  };

  return (
    <div>
      <h1>Products</h1>

      <button onClick={handleLogout}>Logout</button>

      {message && <p>{message}</p>}

      <h2>{editingId ? "Edit Product" : "Create Product"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Update Product" : "Create Product"}
        </button>
      </form>

      <h2>All Products</h2>

      {products.map((product) => (
        <div key={product._id}>
          <h3>{product.name}</h3>

          <p>{product.description}</p>

          <p>Price: ₹{product.price}</p>

          <p>Category: {product.category}</p>

          <p>Stock: {product.stock}</p>

          <button onClick={() => handleEdit(product)}>Edit</button>

          <button onClick={() => handleDelete(product._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Products;
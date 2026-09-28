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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
      setMessage(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      localStorage.removeItem("accessToken");

      window.location.href = "/login";
    } catch (error) {
      localStorage.removeItem("accessToken");

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
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">
              PRODUCT MANAGER
            </p>

            <p className="mt-1 text-xs text-zinc-500">Manage your products</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900 hover:text-white"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Dashboard
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Products
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Create, update and manage your product inventory.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
            <p className="text-xs text-zinc-500">Total products</p>

            <p className="mt-1 text-xl font-semibold">{products.length}</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
            <p className="text-sm text-zinc-300">{message}</p>

            <button
              onClick={() => setMessage("")}
              className="ml-4 text-zinc-500 transition hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {/* Create / Edit Product */}
        <section className="mb-12 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              {editingId ? "Update" : "New Product"}
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              {editingId ? "Edit product" : "Create a product"}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {editingId
                ? "Update the product details below."
                : "Add a new product to your inventory."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Product name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="e.g. Wireless Headphones"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-700"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Category
                </label>

                <input
                  id="category"
                  type="text"
                  name="category"
                  placeholder="e.g. Electronics"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-700"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Describe your product..."
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-700"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Price
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                    ₹
                  </span>

                  <input
                    id="price"
                    type="number"
                    name="price"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-8 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-700"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="stock"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Stock
                </label>

                <input
                  id="stock"
                  type="number"
                  name="stock"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-700"
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Image URL
              </label>

              <input
                id="image"
                type="text"
                name="image"
                placeholder="https://example.com/product-image.jpg"
                value={formData.image}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-700"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                className="h-12 rounded-xl bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.99]"
              >
                {editingId ? "Update Product" : "Create Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);

                    setFormData({
                      name: "",
                      description: "",
                      price: "",
                      category: "",
                      stock: "",
                      image: "",
                    });
                  }}
                  className="h-12 rounded-xl border border-zinc-700 px-6 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Products */}
        <section>
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Inventory
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              All Products
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 px-6 py-16 text-center">
              <p className="text-lg font-medium text-zinc-300">
                No products yet
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Create your first product using the form above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition hover:-translate-y-1 hover:border-zinc-700"
                >
                  {/* Product Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-zinc-950">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-sm text-zinc-700">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-xs text-zinc-500">
                          {product.category}
                        </p>
                      </div>

                      <p className="whitespace-nowrap text-lg font-semibold text-white">
                        ₹{product.price}
                      </p>
                    </div>

                    <p className="mb-5 line-clamp-2 text-sm leading-6 text-zinc-500">
                      {product.description}
                    </p>

                    <div className="mb-5 flex items-center justify-between border-t border-zinc-800 pt-4">
                      <span className="text-xs uppercase tracking-wide text-zinc-600">
                        Stock
                      </span>

                      <span className="text-sm font-medium text-zinc-300">
                        {product.stock} units
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 rounded-xl border border-zinc-700 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 rounded-xl border border-red-900/60 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-950/40"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Products;

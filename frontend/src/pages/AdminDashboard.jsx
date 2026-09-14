import { useEffect, useState } from "react";
import api from "../api/axios.js";

const emptyForm = { name: "", description: "", price: "", category: "", imageUrl: "", stock: "" };

const AdminDashboard = () => {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadProducts = () => {
    api.get("/products", { params: { limit: 100 } }).then(({ data }) => setProducts(data.products));
  };

  const loadOrders = () => {
    api.get("/orders").then(({ data }) => setOrders(data));
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    loadOrders();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-6 border-b">
        {["products", "orders"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 px-1 capitalize font-medium ${
              tab === t ? "border-b-2 border-brand-500 text-brand-600" : "text-gray-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="space-y-3 lg:col-span-1">
            <h2 className="font-semibold">{editingId ? "Edit Product" : "Add New Product"}</h2>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
              rows={3}
            />
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <input
              name="imageUrl"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <input
              name="stock"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 rounded-md bg-brand-500 text-white font-medium hover:bg-brand-600"
              >
                {editingId ? "Update" : "Add"} Product
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="lg:col-span-2 space-y-2">
            <h2 className="font-semibold mb-2">All Products ({products.length})</h2>
            {products.map((p) => (
              <div
                key={p._id}
                className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg p-3"
              >
                <img
                  src={p.imageUrl || "https://placehold.co/60x60"}
                  alt={p.name}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-gray-400">
                    ${p.price.toFixed(2)} · {p.stock} in stock · {p.category}
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(p)}
                  className="text-brand-600 text-sm hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-3">
          <h2 className="font-semibold mb-2">All Orders ({orders.length})</h2>
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-medium text-sm">Order #{order._id.slice(-8)}</p>
                  <p className="text-xs text-gray-400">
                    {order.user?.name} ({order.user?.email}) ·{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-semibold">${order.itemsTotal.toFixed(2)}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="border rounded-md px-2 py-1 text-sm"
              >
                {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

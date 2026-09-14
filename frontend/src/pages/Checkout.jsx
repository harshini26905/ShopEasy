import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: form,
        paymentMethod,
      };
      const { data } = await api.post("/orders", payload);
      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 grid sm:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl font-bold mb-2">Shipping Details</h1>
        {["fullName", "address", "city", "postalCode", "country"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field === "fullName" ? "Full Name" : field.replace(/([A-Z])/g, " $1")}
            value={form[field]}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 text-sm capitalize"
          />
        ))}

        <div>
          <label className="text-sm font-medium">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm mt-1"
          >
            <option value="cod">Cash on Delivery</option>
            <option value="card">Credit / Debit Card</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={placing}
          className="w-full py-2.5 rounded-md bg-brand-500 text-white font-medium hover:bg-brand-600 disabled:bg-gray-300"
        >
          {placing ? "Placing order..." : "Place Order"}
        </button>
      </form>

      <div className="bg-white rounded-lg border border-gray-100 p-5 h-fit">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm py-1">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

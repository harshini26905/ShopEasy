import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";

const trackingSteps = ["pending", "processing", "shipped", "delivered"];

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => setError("Order not found"));
  }, [id]);

  if (error) return <p className="max-w-3xl mx-auto px-4 py-8 text-red-500">{error}</p>;
  if (!order) return <p className="max-w-3xl mx-auto px-4 py-8 text-gray-500">Loading...</p>;

  const currentStep = trackingSteps.indexOf(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Order #{order._id.slice(-8)}</h1>
      <p className="text-sm text-gray-400 mb-6">
        Placed on {new Date(order.createdAt).toLocaleString()}
      </p>

      {order.status !== "cancelled" ? (
        <div className="flex items-center mb-8">
          {trackingSteps.map((step, idx) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx <= currentStep ? "bg-brand-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {idx + 1}
              </div>
              <span className="text-xs ml-2 mr-4 capitalize">{step}</span>
              {idx < trackingSteps.length - 1 && (
                <div className={`h-0.5 flex-1 ${idx < currentStep ? "bg-brand-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-8 text-red-500 font-medium">This order was cancelled.</p>
      )}

      <div className="bg-white border border-gray-100 rounded-lg p-5 mb-6">
        <h2 className="font-semibold mb-3">Items</h2>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm py-1">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>${order.itemsTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <p className="text-sm text-gray-600">
          {order.shippingAddress.fullName}
          <br />
          {order.shippingAddress.address}, {order.shippingAddress.city}
          <br />
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>
        <p className="text-sm text-gray-400 mt-2 capitalize">
          Payment: {order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;

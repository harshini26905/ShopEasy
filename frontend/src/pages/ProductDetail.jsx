import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setError("Product not found"));
  }, [id]);

  if (error) return <p className="max-w-4xl mx-auto px-4 py-8 text-red-500">{error}</p>;
  if (!product) return <p className="max-w-4xl mx-auto px-4 py-8 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid sm:grid-cols-2 gap-8">
      <img
        src={product.imageUrl || "https://placehold.co/500x500?text=Product"}
        alt={product.name}
        className="w-full rounded-xl object-cover"
      />
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-sm text-gray-400 mt-1">{product.category}</p>
        <p className="text-2xl font-bold mt-4">${product.price.toFixed(2)}</p>
        <p className="text-gray-600 mt-4">{product.description}</p>
        <p className={`mt-3 text-sm ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>

        {product.stock > 0 && (
          <div className="flex items-center gap-3 mt-5">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))
              }
              className="w-20 border rounded-md px-2 py-2 text-sm"
            />
            <button
              onClick={() => addToCart(product, quantity)}
              className="px-5 py-2 rounded-md bg-brand-500 text-white font-medium hover:bg-brand-600"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product, quantity);
                navigate("/cart");
              }}
              className="px-5 py-2 rounded-md border border-brand-500 text-brand-600 font-medium hover:bg-brand-50"
            >
              Buy Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

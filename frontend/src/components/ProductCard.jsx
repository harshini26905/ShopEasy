import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.imageUrl || "https://placehold.co/400x400?text=Product"}
          alt={product.name}
          className="w-full h-44 object-cover"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${product._id}`} className="font-semibold hover:text-brand-600 line-clamp-1">
          {product.name}
        </Link>
        <p className="text-xs text-gray-400 mt-1">{product.category}</p>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-1">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
          <span className={`text-xs ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
        <button
          onClick={() => addToCart(product, 1)}
          disabled={product.stock === 0}
          className="mt-3 w-full py-2 rounded-md bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

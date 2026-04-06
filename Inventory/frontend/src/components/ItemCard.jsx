import React from "react";
import { FaBox, FaTag, FaTruck, FaCalendarAlt, FaCubes, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ItemCard = ({ item }) => {
  const navigate = useNavigate();
  const formattedExpiryDate = new Date(item.expiryDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-xs rounded-lg shadow-lg bg-gray-900 text-white overflow-hidden">
      {/* Item Image */}
      <div className="relative">
        <img
          src={item.imageUrl}
          alt={item.itemName}
          className="w-full h-48 object-cover border-b-2 border-gray-700"
        />
      </div>

      {/* Item Details */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 flex items-center">
          <FaBox className="text-green-500 mr-2" />
          {item.itemName}
        </h3>
        <p className="text-sm mb-1 flex items-center">
          <FaTag className="text-blue-500 mr-2" />
          Category: {item.itemCategory}
        </p>
        <p className="text-sm mb-1 flex items-center">
          <FaTruck className="text-yellow-500 mr-2" />
          Supplier: {item.supplierName}
        </p>
        <p className="text-sm mb-1 flex items-center">
          <FaCubes className="text-purple-500 mr-2" />
          Stock: {item.quantityInStock}
        </p>
        <p className="text-sm mb-4 flex items-center">
          <FaCalendarAlt className="text-red-500 mr-2" />
          Expiry: {formattedExpiryDate}
        </p>

        {/* Alerts */}
        <div className="flex items-center justify-between">
          {item.lowStockStatus && (
            <div className="flex items-center text-white bg-red-600 px-2 py-1 rounded-md text-xs">
              <FaExclamationTriangle className="mr-1" />
              <span>Low Stock</span>
            </div>
          )}

          {new Date(item.expiryDate) < new Date() && (
            <div className="flex items-center text-black bg-yellow-400 px-2 py-1 rounded-md text-xs">
              <FaExclamationTriangle className="mr-1" />
              <span>Expired</span>
            </div>
          )}
        </div>
      </div>

      {/* View Details Button */}
      <div className="bg-gray-800 px-4 py-2 text-center border-t border-gray-700">
        <button
          onClick={() => navigate("/details", { state: { item } })}
          className="text-green-500 font-semibold hover:underline"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ItemCard;

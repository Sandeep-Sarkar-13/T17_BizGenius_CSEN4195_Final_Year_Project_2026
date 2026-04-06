import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaBoxOpen,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaWarehouse,
  FaPhoneAlt,
  FaCalendarAlt,
  FaEdit,
} from "react-icons/fa";

const UpdateItem = () => {
  const { state } = useLocation();
  const { item } = state; // Item details passed via state
  const [formData, setFormData] = useState(item || {});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("warehouseExactLocation")) {
      const field = name.split(".")[1]; // Get the nested field name
      setFormData((prev) => ({
        ...prev,
        warehouseExactLocation: {
          ...prev.warehouseExactLocation,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://jawan-inventory.onrender.com/api/v1/items/${item._id}`,
        formData
      );
      toast.success("Item updated successfully!", { autoClose: 3000 });
      navigate("/details", { state: { item: response.data } });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update item. Please try again.");
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-12 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center text-green-500 flex items-center justify-center">
        <FaEdit className="mr-3 text-green-400" />
        Update Item
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-xl mx-auto"
      >
        {/* Item Name */}
        <div className="mb-4">
          <label htmlFor="itemName" className="block font-semibold mb-2">
            <FaBoxOpen className="inline-block mr-2 text-yellow-400" />
            Item Name
          </label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="itemCategory" className="block font-semibold mb-2">
            <FaLayerGroup className="inline-block mr-2 text-indigo-400" />
            Category
          </label>
          <input
            type="text"
            id="itemCategory"
            name="itemCategory"
            value={formData.itemCategory}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        {/* Supplier Name */}
        <div className="mb-4">
          <label htmlFor="supplierName" className="block font-semibold mb-2">
            <FaPhoneAlt className="inline-block mr-2 text-purple-400" />
            Supplier Name
          </label>
          <input
            type="text"
            id="supplierName"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        {/* Stock Quantity */}
        <div className="mb-4">
          <label htmlFor="quantityInStock" className="block font-semibold mb-2">
            <FaWarehouse className="inline-block mr-2 text-blue-400" />
            Stock Quantity
          </label>
          <input
            type="number"
            id="quantityInStock"
            name="quantityInStock"
            value={formData.quantityInStock}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        {/* Expiry Date */}
        <div className="mb-4">
          <label htmlFor="expiryDate" className="block font-semibold mb-2">
            <FaCalendarAlt className="inline-block mr-2 text-red-400" />
            Expiry Date
          </label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate.split("T")[0]}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        {/* Warehouse Location */}
        <div className="mb-4">
          <label htmlFor="warehouseLocation" className="block font-semibold mb-2">
            <FaMapMarkerAlt className="inline-block mr-2 text-green-400" />
            Warehouse Location
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="warehouseExactLocation.shelf"
              placeholder="Shelf"
              value={formData.warehouseExactLocation?.shelf || ""}
              onChange={handleChange}
              className="p-2 rounded bg-gray-700 text-white"
            />
            <input
              type="text"
              name="warehouseExactLocation.room"
              placeholder="Room"
              value={formData.warehouseExactLocation?.room || ""}
              onChange={handleChange}
              className="p-2 rounded bg-gray-700 text-white"
            />
            <input
              type="number"
              name="warehouseExactLocation.floor"
              placeholder="Floor"
              value={formData.warehouseExactLocation?.floor || ""}
              onChange={handleChange}
              className="p-2 rounded bg-gray-700 text-white"
            />
            <input
              type="number"
              name="warehouseExactLocation.rackNumber"
              placeholder="Rack Number"
              value={formData.warehouseExactLocation?.rackNumber || ""}
              onChange={handleChange}
              className="p-2 rounded bg-gray-700 text-white"
            />
            <input
              type="text"
              name="warehouseExactLocation.placeInRack"
              placeholder="Place in Rack"
              value={formData.warehouseExactLocation?.placeInRack || ""}
              onChange={handleChange}
              className="p-2 rounded bg-gray-700 text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Update Item
        </button>
      </form>
    </div>
  );
};

export default UpdateItem;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaWarehouse,
  FaPhoneAlt,
  FaCalendarAlt,
  FaBoxOpen,
  FaArrowUp,
  FaImage,
  FaRegClock,
  FaHome
} from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { GiFactory } from "react-icons/gi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiMapPinFill } from "react-icons/ri";

const AddItem = () => {
  const [newItem, setNewItem] = useState({
    itemName: "",
    itemCategory: "",
    supplierName: "",
    imageUrl: "",
    expiryDate: "",
    quantityInStock: "",
    unit: "",
    consumptionPerDayPerPerson: "",
    last14DaysConsumptionPerPerson: "",
    warehouseExactLocation: {
      shelf: "",
      room: "",
      floor: "",
      rackNumber: "",
      placeInRack: "",
    },
    reorderThreshold: "",
    contactNumber: "",
    lastUpdated: new Date().toISOString(),
    lowStockStatus: false,
    isExpired: false,
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("warehouseExactLocation")) {
      const [field, key] = name.split(".");
      setNewItem({
        ...newItem,
        warehouseExactLocation: {
          ...newItem.warehouseExactLocation,
          [key]: value,
        },
      });
    } else if (name === "last14DaysConsumptionPerPerson") {
      setNewItem({
        ...newItem,
        [name]: value,
      });
    } else {
      setNewItem({
        ...newItem,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const consumptionArray = newItem.last14DaysConsumptionPerPerson
      .split(",")
      .map((item) => parseFloat(item.trim()))
      .filter((item) => !isNaN(item));

    if (consumptionArray.length === 14) {
      const itemData = { ...newItem, last14DaysConsumptionPerPerson: consumptionArray };

      try {
        const response = await axios.post("https://jawan-inventory.onrender.com/api/v1/items", itemData);
        toast.success("Item added successfully!");
        navigate(`/details`, { state: { item: response.data } });
      } catch (error) {
        toast.error("Failed to add item.");
        console.error("Error adding item:", error);
      }
    } else {
      toast.error("Please enter exactly 14 valid consumption values.");
    }
  };

  return (
    <div className="bg-gray-900 p-6 text-white min-h-screen">
      <h1 className="text-4xl font-semibold mb-8 text-center text-green-500">
        Add New Item
      </h1>
      {/* Navigate to Home Button */}
             <button
              onClick={() => navigate("/")}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mb-4 flex items-center"
            >
              <FaHome className="mr-2" />
              Go to Back to Dashboard
            </button>
        
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        {/* Item Name */}
        <div className="mb-4">
          <label htmlFor="itemName" className="block text-lg font-medium mb-2">
            Item Name <FaBoxOpen className="inline-block ml-2 text-green-500" />
          </label>
          <input
            id="itemName"
            name="itemName"
            type="text"
            value={newItem.itemName}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 text-white rounded-md"
            placeholder="Enter item name"
            required
          />
        </div>

        {/* Item Category */}
        <div className="mb-4">
          <label htmlFor="itemCategory" className="block text-lg font-medium mb-2">
            Category <FaArrowUp className="inline-block ml-2 text-green-500" />
          </label>
          <select
            id="itemCategory"
            name="itemCategory"
            value={newItem.itemCategory}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 text-white rounded-md"
            required
          >
            <option value="">Select Category</option>
            <option value="Grains">Grains</option>
            <option value="Spices">Spices</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Dairy">Dairy</option>
            <option value="Fish">Fish</option>
            <option value="Poultry">Poultry</option>
            <option value="Meat">Meat</option>
            <option value="Snacks">Snacks</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Supplier Name */}
        <div className="mb-4">
          <label htmlFor="supplierName" className="block text-lg font-medium mb-2">
            Supplier Name <IoMdPerson className="inline-block ml-2 text-green-500" />
          </label>
          <input
            id="supplierName"
            name="supplierName"
            type="text"
            value={newItem.supplierName}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 text-white rounded-md"
            placeholder="Enter supplier name"
            required
          />
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-lg font-medium mb-2">
            Image URL <FaImage className="inline-block ml-2 text-green-500" />
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            value={newItem.imageUrl}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 text-white rounded-md"
            placeholder="Enter image URL"
            required
          />
        </div>

        {/* Expiry Date */}
        <div className="mb-4">
          <label htmlFor="expiryDate" className="block text-lg font-medium mb-2">
            Expiry Date <FaCalendarAlt className="inline-block ml-2 text-green-500" />
          </label>
          <input
            id="expiryDate"
            name="expiryDate"
            type="date"
            value={newItem.expiryDate}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 text-white rounded-md"
            required
          />
        </div>

        {/* Quantity in Stock */}
        <div className="mb-4">
          <label htmlFor="quantityInStock" className="block text-lg font-medium mb-2">
            Quantity in Stock (kg) <FaArrowUp className="inline-block ml-2 text-green-500" />
          </label>
          <input
            id="quantityInStock"
            name="quantityInStock"
            type="number"
            value={newItem.quantityInStock}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 text-white rounded-md"
            placeholder="Enter quantity in stock"
            required
          />
        </div>

        {/* Unit (Select dropdown) */}
        <div className="mb-4">
          <label htmlFor="unit" className="block text-lg font-medium mb-2">
            Unit <FaBoxOpen className="inline-block ml-2 text-green-500" />
          </label>
          <select
            id="unit"
            name="unit"
            value={newItem.unit}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 text-white rounded-md"
            required
          >
            <option value="">Select Unit</option>
            <option value="kg">kg</option>
            <option value="liters">liters</option>
            <option value="units">units</option>
          </select>
        </div>

        {/* Consumption per Day */}
        <div className="mb-4">
          <label htmlFor="consumptionPerDayPerPerson" className="block text-lg font-medium mb-2">
            Consumption per Day per Person (kg) <FaArrowUp className="inline-block ml-2 text-green-500" />
          </label>
          <input
            id="consumptionPerDayPerPerson"
            name="consumptionPerDayPerPerson"
            type="number"
            value={newItem.consumptionPerDayPerPerson}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 text-white rounded-md"
            placeholder="Enter consumption per day per person"
            required
          />
        </div>

        {/* Last 14 Days Consumption */}
        <div className="mb-4">
          <label htmlFor="last14DaysConsumptionPerPerson" className="block text-lg font-medium mb-2">
            Last 14 Days Consumption (kg) <FaRegClock className="inline-block ml-2 text-green-500" />
          </label>
          <input
            id="last14DaysConsumptionPerPerson"
            name="last14DaysConsumptionPerPerson"
            type="text"
            value={newItem.last14DaysConsumptionPerPerson}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 text-white rounded-md"
            placeholder="Enter last 14 days consumption, separated by commas"
            required
          />
        </div>

        {/* Warehouse Exact Location */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Warehouse Exact Location <RiMapPinFill className="inline-block ml-2 text-green-500" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <FaWarehouse className="mr-2 text-green-500" />
              <input
                type="text"
                name="warehouseExactLocation.shelf"
                value={newItem.warehouseExactLocation.shelf}
                onChange={handleInputChange}
                className="p-3 bg-gray-800 text-white rounded-md"
                placeholder="Shelf"
              />
            </div>

            <div className="flex items-center">
              <HiOutlineLocationMarker className="mr-2 text-green-500" />
              <input
                type="text"
                name="warehouseExactLocation.room"
                value={newItem.warehouseExactLocation.room}
                onChange={handleInputChange}
                className="p-3 bg-gray-800 text-white rounded-md"
                placeholder="Room"
              />
            </div>

            <div className="flex items-center">
              <FaBoxOpen className="mr-2 text-green-500" />
              <input
                type="text"
                name="warehouseExactLocation.floor"
                value={newItem.warehouseExactLocation.floor}
                onChange={handleInputChange}
                className="p-3 bg-gray-800 text-white rounded-md"
                placeholder="Floor"
              />
            </div>

            <div className="flex items-center">
              <FaWarehouse className="mr-2 text-green-500" />
              <input
                type="text"
                name="warehouseExactLocation.rackNumber"
                value={newItem.warehouseExactLocation.rackNumber}
                onChange={handleInputChange}
                className="p-3 bg-gray-800 text-white rounded-md"
                placeholder="Rack Number"
              />
            </div>

            <div className="flex items-center">
              <RiMapPinFill className="mr-2 text-green-500" />
              <input
                type="text"
                name="warehouseExactLocation.placeInRack"
                value={newItem.warehouseExactLocation.placeInRack}
                onChange={handleInputChange}
                className="p-3 bg-gray-800 text-white rounded-md"
                placeholder="Place in Rack"
              />
            </div>
          </div>
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label htmlFor="contactNumber" className="block text-lg font-medium mb-2">
            Contact Number <FaPhoneAlt className="inline-block ml-2 text-green-500" />
          </label>
          <input
            id="contactNumber"
            name="contactNumber"
            type="text"
            value={newItem.contactNumber}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 text-white rounded-md"
            placeholder="Enter supplier contact number"
            required
          />
        </div>

        {/* Reorder Threshold */}
        <div className="mb-4">
          <label htmlFor="reorderThreshold" className="block text-lg font-medium mb-2">
            Reorder Threshold <FaArrowUp className="inline-block ml-2 text-green-500" />
          </label>
          <input
            id="reorderThreshold"
            name="reorderThreshold"
            type="number"
            value={newItem.reorderThreshold}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 text-white rounded-md"
            placeholder="Enter reorder threshold"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white rounded-md flex items-center justify-center space-x-2 hover:bg-green-600"
        >
          <FaPlus /> <span>Add Item</span>
        </button>
      </form>
    </div>
  );
};

export default AddItem;

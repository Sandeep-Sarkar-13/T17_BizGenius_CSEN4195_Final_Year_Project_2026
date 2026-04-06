import React, { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import {
  FaSearch,
  FaBoxOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaRoute
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    itemName: "",
    itemCategory: "",
    supplierName: "",
    expiryDate: "",
    lowStock: false,
    expired: false,
  });
  const navigate = useNavigate();
  const lowStockData = [
    {
      campName: "Camp_A",
      item: "Rice",
      quantity: 40.0,
      date: "2025-01-12 17:28:40",
    },
    {
      campName: "Camp_B",
      item: "Green Tea",
      quantity: 55.0,
      date: "2025-01-12 17:28:41",
    },
    
    {
      campName: "Camp_C",
      item: "Rice",
      quantity: 20.0,
      date: "2025-01-12 17:28:42",
    },
    {
      campName: "Camp_D",
      item: "Green Tea",
      quantity: 60.0,
      date: "2025-01-12 17:28:42",
    },
    {
      campName: "Camp_E",
      item: "Mango",
      quantity: 30.0,
      date: "2025-01-12 17:28:43",
    },
  ];


  // Fetch all items or items based on filters
  const fetchItems = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `https://jawan-inventory.onrender.com/api/v1/search/items?${params}`
      );
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  const handleAddItem = () => {
    navigate("/add-item");
  };

  // Fetch items on initial load or when filters change
  useEffect(() => {
    fetchItems();
  }, [filters]);

  return (
    <div className="bg-gray-900 p-6 text-white min-h-screen">
      {/* Header */}
      <h1 className="text-4xl font-semibold mb-8 text-center text-green-500">
        Jawaan Inventory Dashboard
      </h1>

      {/* Filters Section */}
      <div className="mb-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Item Name Filter */}
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2" htmlFor="itemName">
            <FaBoxOpen className="inline-block mr-2 text-yellow-400" /> Item Name
          </label>
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-md">
            <input
              id="itemName"
              type="text"
              placeholder="Search by name"
              value={filters.itemName}
              onChange={(e) =>
                setFilters({ ...filters, itemName: e.target.value })
              }
              className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <FaSearch className="text-gray-400 mr-3" />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2" htmlFor="itemCategory">
            <FaBoxOpen className="inline-block mr-2 text-blue-400" /> Category
          </label>
          <select
            id="itemCategory"
            value={filters.itemCategory}
            onChange={(e) =>
              setFilters({ ...filters, itemCategory: e.target.value })
            }
            className="border p-3 rounded-md bg-gray-800 text-white focus:outline-none"
          >
            <option value="">Select Category</option>
            <option value="Grains">Grains</option>
            <option value="Spices">Spices</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Dairy">Dairy</option>
            <option value="Fish">Fish</option>
            <option value="Poultry">Poultry</option>
            <option value="Snacks">Snacks</option>
            <option value="Weapons">Weapons</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Supplier Name Filter */}
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2" htmlFor="supplierName">
            <FaSearch className="inline-block mr-2 text-purple-400" /> Supplier
            Name
          </label>
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-md">
            <input
              id="supplierName"
              type="text"
              placeholder="Search by supplier"
              value={filters.supplierName}
              onChange={(e) =>
                setFilters({ ...filters, supplierName: e.target.value })
              }
              className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <FaSearch className="text-gray-400 mr-3" />
          </div>
        </div>

        {/* Expiry Date Filter */}
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2" htmlFor="expiryDate">
            <FaCalendarAlt className="inline-block mr-2 text-red-400" /> Expiry
            Date
          </label>
          <input
            id="expiryDate"
            type="date"
            value={filters.expiryDate}
            onChange={(e) =>
              setFilters({ ...filters, expiryDate: e.target.value })
            }
            className="border p-3 rounded-md bg-gray-800 text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Low Stock and Expired Filters */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <label className="flex items-center text-lg font-medium text-yellow-400">
          <FaCheckCircle className="mr-2" />
          <input
            type="checkbox"
            checked={filters.lowStock}
            onChange={(e) =>
              setFilters({ ...filters, lowStock: e.target.checked })
            }
            className="mr-2"
          />
          Low Stock
        </label>
        <label className="flex items-center text-lg font-medium text-red-400">
          <FaTimesCircle className="mr-2" />
          <input
            type="checkbox"
            checked={filters.expired}
            onChange={(e) =>
              setFilters({ ...filters, expired: e.target.checked })
            }
            className="mr-2"
          />
          Expired
        </label>
      </div>
      <div className="flex justify-center mb-8">
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-6 py-3 rounded-md flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-600 transition"
        >
          <FaPlus className="mr-2" />
          Add Item
        </button>
        </div>
      

      {/* Search Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={fetchItems}
          className="bg-green-500 text-white px-6 py-3 rounded-md flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-green-600 transition"
        >
          <FaSearch className="mr-2" />
          Search
        </button>
      </div>

      {/* Items Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-7">
        {items.length > 0 ? (
          items.map((item) => <ItemCard key={item._id} item={item} />)
        ) : (
          <p className="text-center text-xl text-gray-400">No items found.</p>
        )}
        
      </div>
      {/* Low Stock Card */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8 mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-yellow-400">
            Current Items in Low Stock
          </h2>
          <button
            onClick={() => window.open("https://routelogistics.netlify.app/", "_blank")}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition"
          >
            <FaRoute className="mr-2" />
            Routes Planned
          </button>
        </div>
        <table className="w-full mt-4 text-left text-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-700">Camp Name</th>
              <th className="py-2 px-4 border-b border-gray-700">Item</th>
              <th className="py-2 px-4 border-b border-gray-700">Quantity</th>
              <th className="py-2 px-4 border-b border-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {lowStockData.map((data, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b border-gray-700">
                  {data.campName}
                </td>
                <td className="py-2 px-4 border-b border-gray-700">{data.item}</td>
                <td className="py-2 px-4 border-b border-gray-700">
                  {data.quantity}
                </td>
                <td className="py-2 px-4 border-b border-gray-700">{data.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
    
  );
};

export default Dashboard;

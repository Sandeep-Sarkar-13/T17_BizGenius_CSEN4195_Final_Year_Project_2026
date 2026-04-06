import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  FaBoxOpen,
  FaHome,
  FaPhoneAlt,
  FaCalendarAlt,
  FaWarehouse,
  FaChartLine,
  FaBuilding,
  FaTrashAlt,
  FaEdit,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaArrowAltCircleRight,
  FaChartBar,
  FaExclamationTriangle,
} from "react-icons/fa";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ViewDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { item } = state || {};

  // Fallback if `item` is not available
  if (!state || !item) {
    return (
      <div className="text-center text-red-500 p-6">
        <h1>Item details not found!</h1>
        <p>Please navigate back to the items list and select an item.</p>
      </div>
    );
  }

  // Format expiry date for display
  const formattedExpiryDate = new Date(item.expiryDate).toLocaleDateString(
    "en-GB",
    { day: "2-digit", month: "2-digit", year: "numeric" }
  );

  // Line chart data for consumption
  const consumptionData = {
    labels: Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: "Consumption per Day (kg)",
        data: item.last14DaysConsumptionPerPerson || Array(14).fill(0),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        borderWidth: 2,
        tension: 0.5,
        fill: true,
        pointStyle: "circle",
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#4CAF50",
      },
    ],
  };

  // Bar chart data for stock and reorder threshold
  const stockData = {
    labels: ["Current Stock", "Reorder Threshold"],
    datasets: [
      {
        label:item.itemCategory!=='Weapons'?"Quantity(kg)":"Quantity(units)",
        data: [item.quantityInStock, item.reorderThreshold],
        backgroundColor: ["#2196F3", "#FF5722"],
        borderColor: ["#1976D2", "#E64A19"],
        borderWidth: 1,
      },
    ],
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#FFFFFF",
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#FFFFFF",
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#FFFFFF",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  const handleUpdate = () => {
    navigate("/update", { state: { item } });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://jawan-inventory.onrender.com/api/v1/items/${item._id}`);
      toast.success("Item deleted successfully!");
      navigate("/"); // Redirect to items list after deletion
    } catch (error) {
      toast.error("Failed to delete item!");
    }
  };

  return (
    
    <div className="p-6 md:p-8 lg:p-12 bg-gray-900 text-white min-h-screen">
       {/* Navigate to Home Button */}
       <button
        onClick={() => navigate("/")}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mb-4 flex items-center"
      >
        <FaHome className="mr-2" />
        Go to Back to Dashboard
      </button>
  
      {/* Header */}
      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-center text-green-500 flex items-center justify-center">
        <FaChartLine className="mr-2 md:mr-3 text-green-400" />
        {item.itemName} Details
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Basic Details Section */}
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg space-y-3 md:space-y-4">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 flex items-center">
            <FaBoxOpen className="mr-2 text-yellow-400" />
            Basic Information
          </h2>
          <p>
            <span className="font-semibold">Category:</span> {item.itemCategory}
          </p>
          <p>
            <FaPhoneAlt className="inline-block mr-2 text-purple-400" />
            <span className="font-semibold">Supplier:</span> {item.supplierName}
          </p>
          <p>
            <FaCalendarAlt className="inline-block mr-2 text-red-400" />
            <span className="font-semibold">Expiry Date:</span>{" "}
            {formattedExpiryDate}
          </p>
          <p>
            <span className="font-semibold">Stock:</span> {item.quantityInStock}{" "}
            {item.unit}
          </p>
          {/* Action Buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded inline-flex items-center"
            >
              <FaEdit className="mr-2" /> Update Item
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded inline-flex items-center"
            >
              <FaTrashAlt className="mr-2" />
              Delete
            </button>
          </div>
        </div>

        {/* Warehouse Location Section */}
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg space-y-3 md:space-y-4">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 flex items-center">
            <FaWarehouse className="mr-2 text-blue-400" />
            Warehouse Exact Location
          </h2>
          <p>
            <FaBuilding className="inline-block mr-2 text-gray-400" />
            <span className="font-semibold">Shelf:</span>{" "}
            {item.warehouseExactLocation.shelf}
          </p>
          <p>
            <FaMapMarkerAlt className="inline-block mr-2 text-green-400" />
            <span className="font-semibold">Room:</span>{" "}
            {item.warehouseExactLocation.room}
          </p>
          <p>
            <FaLayerGroup className="inline-block mr-2 text-indigo-400" />
            <span className="font-semibold">Floor:</span>{" "}
            {item.warehouseExactLocation.floor}
          </p>
          <p>
            <FaArrowAltCircleRight className="inline-block mr-2 text-yellow-400" />
            <span className="font-semibold">Rack:</span>{" "}
            {item.warehouseExactLocation.rackNumber}
          </p>
          <p>
            <FaBoxOpen className="inline-block mr-2 text-teal-400" />
            <span className="font-semibold">Place in Rack:</span>{" "}
            {item.warehouseExactLocation.placeInRack}
          </p>
        </div>
      </div>

      {/* Line Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      {item.itemCategory!=='Weapons' && (<div className="mt-6 md:mt-8">
          <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
            <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center justify-center">
              <FaChartLine className="mr-2 text-green-400" />
              Last 14 Days Consumption per Day per Person
            </h2>
            <div className="h-60 md:h-80">
              <Line data={consumptionData} options={chartOptions} />
            </div>
          </div>
        </div>)
        }
        {/* Bar Chart Section */}
        <div className="mt-6 md:mt-8">
          <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
            <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center justify-center">
              <FaChartBar className="mr-2 text-blue-400" />
              Stock vs Reorder Threshold
            </h2>
            <div className="h-60 md:h-80">
              <Bar data={stockData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Warning Section */}
      {item.quantityInStock <= item.reorderThreshold && (
        <div className="mt-6 md:mt-8 bg-red-800 p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold flex items-center text-yellow-300">
            <FaExclamationTriangle className="mr-2" />
            Low Stock Alert!
          </h2>
          <p className="mt-2">
            The current stock is below the reorder threshold. Please reorder
            soon to avoid running out of stock.
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewDetails;

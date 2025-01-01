import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaHeart } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProductInfo = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });

    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => {
        setRecommendedProducts(
          response.data.filter((p) => p.id !== parseInt(id)).slice(0, 4)
        );
      })
      .catch((error) => {
        console.error("Error fetching recommended products:", error);
      });
  }, [id]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((fav) => fav !== id)
        : [...prevFavorites, id]
    );
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  // Fake price data for the past year
  const priceHistory = [
    { month: "January", price: product.price - 10 },
    { month: "February", price: product.price - 8 },
    { month: "March", price: product.price - 6 },
    { month: "April", price: product.price - 4 },
    { month: "May", price: product.price - 2 },
    { month: "June", price: product.price },
    { month: "July", price: product.price + 2 },
    { month: "August", price: product.price + 4 },
    { month: "September", price: product.price + 6 },
    { month: "October", price: product.price + 8 },
    { month: "November", price: product.price + 10 },
    { month: "December", price: product.price + 12 },
  ];

  const data = {
    labels: priceHistory.map((entry) => entry.month),
    datasets: [
      {
        label: "Price History",
        data: priceHistory.map((entry) => entry.price),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Price History for the Past Year",
      },
    },
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-center">{product.title}</h1>
      <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-lg">
        <img
          src={product.image}
          alt={product.title}
          className="w-48 h-48 object-cover mb-4 md:mb-0 md:mr-6 rounded-lg"
        />
        <div className="flex flex-col items-start">
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-bold mb-4">{product.price} USD</p>
          <div className="flex items-center">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-110 active:scale-90 duration-300 mr-4">
              Add to Cart
            </button>
            <button
              onClick={() => toggleFavorite(product.id)}
              className="transition-transform transform hover:scale-110 active:scale-90 duration-300"
            >
              {favorites.includes(product.id) ? (
                <FaHeart className="h-6 w-6 text-red-500" />
              ) : (
                <FaHeart className="h-6 w-6 text-gray-500 hover:text-red-500 transition-colors duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 w-full md:w-1/2">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ProductInfo;

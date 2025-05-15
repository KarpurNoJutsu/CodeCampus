import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaReceipt, FaDownload, FaCalendarAlt, FaRupeeSign, FaSpinner } from "react-icons/fa";
import { getPurchaseHistory } from "../../../../services/operations/StudentFeaturesAPI";
import "./PurchaseHistory.css";

const PurchaseHistory = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await getPurchaseHistory(token);
        setPurchases(response.data);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [token]);

  const handleDownloadReceipt = (orderId) => {
    // TODO: Implement receipt download functionality
    console.log("Downloading receipt for order:", orderId);
  };

  if (loading) {
    return (
      <div className="purchase-history-container">
        <div className="loading-spinner">
          <FaSpinner className="spinner" />
          <p>Loading purchase history...</p>
        </div>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="purchase-history-container">
        <div className="empty-state">
          <h2>No Purchase History</h2>
          <p>You haven't made any course purchases yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="purchase-history-container">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="purchase-history-title"
      >
        Purchase History
      </motion.h1>

      <div className="purchase-history-grid">
        {purchases.map((purchase) => (
          <motion.div
            key={purchase.orderId}
            className="purchase-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="purchase-header">
              <h3>{purchase.courseName}</h3>
              <span className={`status-badge ${purchase.status}`}>
                {purchase.status}
              </span>
            </div>

            <div className="purchase-details">
              <div className="detail-row">
                <span>Amount Paid:</span>
                <span>₹{purchase.amount}</span>
              </div>
              <div className="detail-row">
                <span>Purchase Date:</span>
                <span>{new Date(purchase.date).toLocaleDateString()}</span>
              </div>
              <div className="detail-row">
                <span>Order ID:</span>
                <span>{purchase.orderId}</span>
              </div>
              <div className="detail-row">
                <span>Payment ID:</span>
                <span>{purchase.paymentId}</span>
              </div>
              <div className="detail-row">
                <span>Progress:</span>
                <span>{purchase.progressCount}%</span>
              </div>
            </div>

            <button
              className="download-button"
              onClick={() => handleDownloadReceipt(purchase.orderId)}
            >
              <FaDownload /> Download Receipt
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseHistory; 
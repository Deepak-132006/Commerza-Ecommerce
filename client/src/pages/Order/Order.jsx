import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../layouts/Navbar";
import api from "../../axios/api";

const Order = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelOrder = async () => {
    try {
      const res = await api.patch(`/orders/${orderId}/cancel`);

      setOrder(res.data);

      alert("Order Cancelled");
    } catch (error) {
      console.error(error);
    }
  };

  if (!order) {
    return (
      <>
        <Navbar />
        <h2 className="text-center mt-10">Loading...</h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Order Details</h1>

        <div className="border rounded-xl p-6 shadow">
          <p>
            <strong>Order Number:</strong> {order.orderNumber}
          </p>

          <p className="mt-3">
            <strong>Status:</strong> {order.status}
          </p>

          <p className="mt-3">
            <strong>Payment:</strong> {order.paymentMethod}
          </p>

          <p className="mt-3">
            <strong>Shipping Address:</strong>
          </p>

          <p className="text-gray-600">{order.shippingAddress}</p>

          <p className="mt-3">
            <strong>Placed On:</strong>
          </p>

          <p>{new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-5">
          Ordered Items
        </h2>

        {order.items.map((item) => (
          <div
            key={item.productId}
            className="border rounded-xl p-5 mb-4 flex justify-between"
          >
            <div>
              <h3 className="font-bold text-lg">
                {item.productName}
              </h3>

              <p>Quantity : {item.quantity}</p>

              <p>₹{item.price}</p>
            </div>

            <div className="font-bold text-xl">
              ₹{item.subtotal}
            </div>
          </div>
        ))}

        <div className="border-t mt-8 pt-5 flex justify-between text-2xl font-bold">
          <span>Total</span>

          <span className="text-hunter-green">
            ₹{order.totalAmount}
          </span>
        </div>

        {(order.status === "PENDING" ||
          order.status === "CONFIRMED") && (
          <button
            onClick={cancelOrder}
            className="mt-6 bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700"
          >
            Cancel Order
          </button>
        )}
      </div>
    </>
  );
};

export default Order;
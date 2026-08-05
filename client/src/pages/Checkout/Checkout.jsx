import React, { useEffect, useState } from "react";
import Navbar from "../../layouts/Navbar";
import api from "../../axios/api";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);

  const [shippingAddress, setShippingAddress] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const placeOrder = async () => {
    if (!shippingAddress.trim()) {
      alert("Shipping address is required.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/orders", {
        shippingAddress,
        paymentMethod,
      });

      navigate(`/orders/${res.data.orderId}`);
    } catch (err) {
      console.error(err);
      alert("Unable to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
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

      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">

        {/* Left */}

        <div>

          <h2 className="text-3xl font-bold mb-6">
            Checkout
          </h2>

          <label className="font-semibold">
            Shipping Address
          </label>

          <textarea
            rows={6}
            className="border rounded-lg w-full p-3 mt-2"
            value={shippingAddress}
            onChange={(e) =>
              setShippingAddress(e.target.value)
            }
          />

          <h3 className="mt-8 font-semibold text-xl">
            Payment Method
          </h3>

          <div className="mt-3 space-y-3">

            <label className="flex gap-2">

              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() =>
                  setPaymentMethod("COD")
                }
              />

              Cash on Delivery

            </label>

            <label className="flex gap-2 text-gray-400">

              <input disabled type="radio" />

              UPI (Coming Soon)

            </label>

            <label className="flex gap-2 text-gray-400">

              <input disabled type="radio" />

              Card (Coming Soon)

            </label>

          </div>

        </div>

        {/* Right */}

        <div className="border rounded-xl p-6 h-fit">

          <h3 className="text-2xl font-bold mb-5">
            Order Summary
          </h3>

          {cart.items.map((item) => (

            <div
              key={item.cartItemId}
              className="flex justify-between mb-4"
            >

              <span>

                {item.productName}

                ×

                {item.quantity}

              </span>

              <span>

                ₹{item.subtotal}

              </span>

            </div>

          ))}

          <hr className="my-5" />

          <div className="flex justify-between font-bold text-xl">

            <span>Total</span>

            <span>

              ₹{cart.totalPrice}

            </span>

          </div>

          <button
            disabled={loading}
            onClick={placeOrder}
            className="w-full mt-8 bg-hunter-green text-white py-3 rounded-lg"
          >

            {loading
              ? "Placing Order..."
              : "Place Order"}

          </button>

        </div>

      </div>
    </>
  );
};

export default Checkout;
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../axios/api";
import Navbar from "../../layouts/Navbar";

const FIELDS = [
  { key: "fullName", label: "Full Name" },
  { key: "phone", label: "Phone" },
  { key: "house", label: "House no." },
  { key: "street", label: "Street" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "pincode", label: "Pincode" },
];

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowProduct = location.state?.buyNowProduct;

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const checkoutItems = buyNowProduct
    ? [
        {
          cartItemId: buyNowProduct.id,
          productName: buyNowProduct.name,
          imageUrl: buyNowProduct.imageUrl,
          quantity: 1,
          subtotal: buyNowProduct.price,
        },
      ]
    : cart?.items || [];

  const totalItems = buyNowProduct ? 1 : cart?.totalItems || 0;

  const totalPrice = buyNowProduct
    ? buyNowProduct.price
    : cart?.totalPrice || 0;

  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      // Buy Now doesn't need the cart
      if (buyNowProduct) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/cart");
        setCart(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [buyNowProduct]);

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const isAddressComplete = FIELDS.every((f) => address[f.key].trim() !== "");
  const placeOrder = async () => {
    const shippingAddress = `
${address.fullName}
${address.phone}
${address.house}
${address.street}
${address.city}
${address.state}
${address.pincode}
`;

    setPlacing(true);

    try {
      let res;

      if (buyNowProduct) {
        res = await api.post("/orders/buy-now", {
          productId: buyNowProduct.id,
          quantity: 1,
          shippingAddress,
          paymentMethod,
        });
      } else {
        res = await api.post("/orders", {
          shippingAddress,
          paymentMethod,
        });
      }

      const orderId = res.data.orderId;

      // COD → no Razorpay
      if (paymentMethod === "COD") {
        navigate(`/orders/${orderId}`);
        return;
      }

      // Create Razorpay payment order
      const paymentRes = await api.post("/payments/create-order", {
        orderId: orderId,
      });

      const paymentData = paymentRes.data;

      const options = {
        key: paymentData.keyId,

        amount: paymentData.amount * 100,

        currency: paymentData.currency,

        name: "Commerza",

        description: `Order ${orderId}`,

        order_id: paymentData.razorpayOrderId,

        handler: async function (response) {
          try {
            const verifyRes = await api.post("/payments/verify", {
              orderId: orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            navigate(`/orders/${verifyRes.data.orderId}`);
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: address.fullName,
          contact: address.phone,
        },

        theme: {
          color: "#14532d",
        },

        modal: {
          ondismiss: function () {
            console.log("Razorpay checkout closed");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error("Order/payment failed:", error);
    } finally {
      setPlacing(false);
    }
  };
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center bg-porcelain">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-soft-fawn border-t-hunter-green animate-spin" />
            <p className="text-olive-bark text-sm tracking-wide">
              Preparing checkout…
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .font-serif-display { font-family: 'Fraunces', serif; }
        .font-sans-body { font-family: 'Inter', sans-serif; }
      `}</style>
      <Navbar />

      <div className="bg-porcelain min-h-screen font-sans-body">
        <div className="max-w-5xl mx-auto px-5 pt-10 pb-16">
          <h1 className="font-serif-display text-4xl text-evergreen mb-1">
            Checkout
          </h1>
          <p className="text-olive-bark text-sm mb-8">
            {totalItems} item{totalItems !== 1 ? "s" : ""} · Review before you
            place your order
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Shipping Address */}
            <div className="bg-cwhite rounded-2xl p-6 shadow-sm border border-soft-fawn/20">
              <h2 className="font-serif-display text-xl text-evergreen mb-5">
                Shipping Address
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {FIELDS.map((field) => (
                  <input
                    key={field.key}
                    type="text"
                    name={field.key}
                    placeholder={field.label + " *"}
                    value={address[field.key]}
                    onChange={handleChange}
                    required
                    className={`border border-soft-fawn/30 rounded-xl p-3 text-sm text-evergreen placeholder:text-olive-bark/60 focus:outline-none focus:ring-2 focus:ring-hunter-green/40 transition-shadow ${
                      field.key === "fullName" || field.key === "street"
                        ? "col-span-2"
                        : ""
                    }`}
                  />
                ))}
              </div>

              <h2 className="font-serif-display text-lg text-evergreen mt-8 mb-4">
                Payment Method
              </h2>

              <div className="space-y-3">
                <label
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-hunter-green bg-porcelain"
                      : "border-soft-fawn/30 hover:border-soft-fawn/60"
                  }`}
                >
                  <input
                    type="radio"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-hunter-green w-4 h-4"
                  />
                  <div>
                    <p className="text-sm font-medium text-evergreen">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-olive-bark">
                      Pay when your order arrives
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === "UPI"
                      ? "border-hunter-green bg-porcelain"
                      : "border-soft-fawn/30 hover:border-soft-fawn/60"
                  }`}
                >
                  <input
                    type="radio"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-hunter-green w-4 h-4"
                  />

                  <div>
                    <p className="text-sm font-medium text-evergreen">
                      Razorpay
                    </p>

                    <p className="text-xs text-olive-bark">
                      UPI, Cards, Net Banking & more
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-cwhite rounded-2xl p-6 shadow-sm border border-soft-fawn/20 sticky top-6">
              <h2 className="font-serif-display text-xl text-evergreen mb-5">
                Order Summary
              </h2>

              <div className="max-h-80 overflow-y-auto pr-1 space-y-3">
                {checkoutItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center gap-3 pb-3 border-b border-porcelain last:border-0"
                  >
                    <div className="w-16 h-16 rounded-lg bg-porcelain overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-evergreen truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-olive-bark">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-hunter-green">
                      ₹{item.subtotal}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-porcelain space-y-2">
                <div className="flex justify-between text-sm text-olive-bark">
                  <span>Total Items</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-evergreen font-medium">Total</span>
                  <span className="font-serif-display text-2xl text-hunter-green">
                    ₹{Number(totalPrice).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={!isAddressComplete || placing}
                className="w-full mt-6 bg-hunter-green text-cwhite py-3.5 rounded-full font-medium hover:bg-evergreen active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {placing ? "Placing order…" : "Place Order"}
              </button>

              {!isAddressComplete && (
                <p className="text-xs text-olive-bark text-center mt-2">
                  Fill in your shipping address to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;

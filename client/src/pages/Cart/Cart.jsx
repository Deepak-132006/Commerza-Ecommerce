import { useEffect, useState } from "react";
import Navbar from "../../layouts/Navbar";
import api from "../../axios/api";

const FREE_SHIPPING_THRESHOLD = 999;

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState([]);
  const [pendingQty, setPendingQty] = useState({});

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    setPendingQty((p) => ({ ...p, [cartItemId]: quantity }));
    try {
      await api.put(`/cart/items/${cartItemId}?quantity=${quantity}`);
      await fetchCart();
    } catch (error) {
      console.error(error);
    } finally {
      setPendingQty((p) => {
        const next = { ...p };
        delete next[cartItemId];
        return next;
      });
    }
  };

  const removeItem = async (cartItemId) => {
    setRemovingIds((ids) => [...ids, cartItemId]);
    setTimeout(async () => {
      try {
        await api.delete(`/cart/items/${cartItemId}`);
        await fetchCart();
      } catch (error) {
        console.error(error);
      } finally {
        setRemovingIds((ids) => ids.filter((id) => id !== cartItemId));
      }
    }, 280);
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center bg-porcelain">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-soft-fawn border-t-hunter-green animate-spin" />
            <p className="text-olive-bark text-sm tracking-wide">Loading your cart…</p>
          </div>
        </div>
      </>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-porcelain px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-cwhite border border-soft-fawn/40 flex items-center justify-center mb-6 shadow-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#355834" strokeWidth="1.5">
              <path
                d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2.2 4.4A1 1 0 0 0 5.7 19H17M17 19a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM9 19a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="font-serif-display text-3xl text-evergreen mb-2">
            Your cart's taking a breather
          </h1>
          <p className="text-olive-bark mb-6 max-w-sm">
            Nothing in here yet. Go find something worth carrying home.
          </p>
          
           < a href="/"
            className="bg-hunter-green text-cwhite px-6 py-3 rounded-full font-medium hover:bg-evergreen transition-colors"
          >
            Start shopping
          </a>
        </div>
      </>
    );
  }

  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - cart.totalPrice, 0);
  const progressPct = Math.min((cart.totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .font-serif-display { font-family: 'Fraunces', serif; }
        .font-sans-body { font-family: 'Inter', sans-serif; }
      `}</style>
      <Navbar />

      <div className="bg-porcelain min-h-screen font-sans-body">
        <div className="max-w-5xl mx-auto px-5 pt-10 pb-32 md:pb-16">
          <div className="flex items-end justify-between mb-2">
            <h1 className="text-4xl text-evergreen">Cart</h1>
            <button
              onClick={clearCart}
              className="text-sm text-olive-bark hover:text-evergreen underline underline-offset-4 transition-colors"
            >
              Clear all
            </button>
          </div>
          <p className="text-olive-bark text-sm mb-8">
            {cart.totalItems} item{cart.totalItems !== 1 ? "s" : ""}
          </p>



          <div className="grid md:grid-cols-3 gap-8">
            {/* Items */}
            <div className="md:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const isRemoving = removingIds.includes(item.cartItemId);
                const qty = pendingQty[item.cartItemId] ?? item.quantity;
                return (
                  <div
                    key={item.cartItemId}
                    className={`flex gap-4 bg-cwhite rounded-2xl p-4 shadow-sm border border-transparent hover:border-soft-fawn/30 transition-all duration-300 ease-out ${
                      isRemoving ? "opacity-0 -translate-x-3 scale-95" : "opacity-100 translate-x-0 scale-100"
                    }`}
                  >
                    <div className="w-24 h-24 rounded-xl bg-porcelain overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h2 className="font-medium text-evergreen truncate pr-2">
                          {item.productName}
                        </h2>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          aria-label="Remove item"
                          className="text-olive-bark/60 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path
                              d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      <p className="text-sm text-olive-bark mt-1">₹{item.unitPrice}</p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 bg-porcelain rounded-full p-1">
                          <button
                            onClick={() => qty > 1 && updateQuantity(item.cartItemId, qty - 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-evergreen hover:bg-cwhite active:scale-90 transition-all"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-evergreen">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, qty + 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-evergreen hover:bg-cwhite active:scale-90 transition-all"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold text-hunter-green">₹{item.subtotal}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary - desktop */}
            <div className="hidden md:block">
              <div className="bg-cwhite rounded-2xl p-6 shadow-sm border border-soft-fawn/30 sticky top-6">
                <h3 className="font-serif-display text-xl text-evergreen mb-5">Order Summary</h3>
                <div className="flex justify-between text-sm text-olive-bark mb-2">
                  <span>Items</span>
                  <span>{cart.totalItems}</span>
                </div>
                <div className="flex justify-between items-baseline pt-4 mt-4 border-t border-porcelain">
                  <span className="text-evergreen font-medium">Total</span>
                  <span className="font-inter text-2xl text-hunter-green">
                    ₹{Number(cart.totalPrice).toLocaleString()}
                  </span>
                </div>
                <button className="w-full mt-6 bg-hunter-green text-cwhite py-3.5 rounded-full font-medium hover:bg-evergreen active:scale-[0.98] transition-all"
                onClick={() => navigate("/checkout")}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary - sticky mobile bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-cwhite border-t border-soft-fawn/30 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-olive-bark">{cart.totalItems} items</span>
            <span className="font-inter text-xl text-hunter-green">
              ₹{Number(cart.totalPrice).toLocaleString()}
            </span>
          </div>
          <button className="w-full bg-hunter-green text-cwhite py-3.5 rounded-full font-medium hover:bg-evergreen active:scale-[0.98] transition-all"
          onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
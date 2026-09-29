import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import "./App.css";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import HomePage from "./pages/Home/HomePage";
import OrdersPage from "./pages/Orders/OrdersPage";
import TrackingPage from "./pages/TrackingPage";

function App() {
  const [cart, setCart] = useState([]);

  const loadCart = async () => {
    const response = await axios.get("/api/cart-items?expand=product");
    setCart(response.data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <Routes>
      <Route index element={<HomePage cart={cart} loadCart={loadCart} />} />
      <Route
        path="/checkout"
        element={<CheckoutPage cart={cart} loadCart={loadCart} />}
      />
      <Route
        path="/orders"
        element={<OrdersPage cart={cart} loadCart={loadCart} />}
      />
      <Route
        path="/tracking/:orderId/:productId"
        element={<TrackingPage cart={cart} />}
      />
    </Routes>
  );
}

export default App;

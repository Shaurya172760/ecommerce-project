import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Header from "../components/Header";
import "./TrackingPage.css";

function TrackingPage({ cart }) {
  const { orderId, productId } = useParams();
  const [order, setOrder] = useState(null);
  const [deliveryPercent, setDeliveryPercent] = useState(0);

  const productItem = order?.products.find(
    (product) => product.productId === productId,
  );

  useEffect(() => {
    const loadTracking = async () => {
      const response = await axios.get(
        `/api/orders/${orderId}?expand=products`,
      );
      setOrder(response.data);
    };

    loadTracking();
  }, [orderId, productId]);

  useEffect(() => {
    if (!productItem || !order) {
      return;
    } else {
      const totalDeliveryTimeMs =
        productItem.estimatedDeliveryTimeMs - order.orderTimeMs;
      const timePassedMs = dayjs().valueOf() - order.orderTimeMs;
      setDeliveryPercent(
        Math.min(Math.max((timePassedMs / totalDeliveryTimeMs) * 100, 4), 100),
      );
    }
  }, [order, productItem]);

  const isPreparing = deliveryPercent < 33 ? true : false;
  const isShipped =
    deliveryPercent >= 33 && deliveryPercent < 100 ? true : false;
  const isDelivered = deliveryPercent === 100 ? true : false;

  return !order ? null : (
    <>
      <title>Tracking</title>

      <Header cart={cart} />

      <div className="tracking-page">
        <div className="order-tracking">
          <a className="back-to-orders-link link-primary" href="/orders">
            View all orders
          </a>

          <div className="delivery-date">
            {isDelivered ? "Delivered on" : "Arriving on"}{" "}
            {dayjs(productItem.estimatedDeliveryTimeMs).format("dddd, MMMM D")}
          </div>

          <div className="product-info">{productItem.product.name}</div>

          <div className="product-info">Quantity: {productItem.quantity}</div>

          <img className="product-image" src={productItem.product.image} />

          <div className="progress-labels-container">
            <div
              className={`progress-label ${isPreparing && "current-status"}`}
            >
              Preparing
            </div>
            <div className={`progress-label ${isShipped && "current-status"}`}>
              Shipped
            </div>
            <div
              className={`progress-label ${isDelivered && "current-status"}`}
            >
              Delivered
            </div>
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${deliveryPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TrackingPage;

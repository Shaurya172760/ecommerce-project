import { CartOrderItem } from "./CartOrderItem.jsx";

export function OrderSummary({ deliveryOptions, cart, loadCart }) {
  return (
    <div className="order-summary">
      {deliveryOptions.length > 0 &&
        cart.map((cartItem) => (
          <CartOrderItem
            key={cartItem.productId}
            cartItem={cartItem}
            deliveryOptions={deliveryOptions}
            loadCart={loadCart}
          />
        ))}
    </div>
  );
}

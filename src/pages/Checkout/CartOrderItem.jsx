import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { formatMoney } from "../../utils/money";

export function CartOrderItem({ cartItem, deliveryOptions, loadCart }) {
  const selectedDeliveryOption = deliveryOptions.find((deliveryOption) => {
    return deliveryOption.id === cartItem.deliveryOptionId;
  });

  const [updateInputActive, setUpdateInputActive] = useState(false);

  async function updateCartQuantity() {
    const inputEl = document.querySelector(
      `input[name="cartQtyUpdate-${cartItem.productId}"]`,
    );
    await axios.put(`/api/cart-items/${cartItem.productId}`, {
      quantity: Number(inputEl.value),
    });
    setUpdateInputActive(false);
    await loadCart();
  }

  async function deleteCartItem() {
    await axios.delete(`api/cart-items/${cartItem.productId}`);
    await loadCart();
  }

  return (
    <div className="cart-item-container" key={cartItem.productId}>
      <div className="delivery-date">
        Delivery date:{" "}
        {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format(
          "dddd, MMMM D",
        )}
      </div>

      <div className="cart-item-details-grid">
        <img className="product-image" src={cartItem.product.image} />

        <div className="cart-item-details">
          <div className="product-name">{cartItem.product.name}</div>
          <div className="product-price">
            {formatMoney(cartItem.product.priceCents)}
          </div>
          <div className="product-quantity">
            {updateInputActive ? (
              <>
                <span>
                  Quantity:{" "}
                  <input
                    className="updateCrtQtyInput"
                    type="number"
                    defaultValue={cartItem.quantity}
                    name={`cartQtyUpdate-${cartItem.productId}`}
                  />
                </span>
                <span
                  className="update-quantity-link link-primary"
                  onClick={() => updateCartQuantity()}
                >
                  Save
                </span>
              </>
            ) : (
              <>
                <span>
                  Quantity:{" "}
                  <span className="quantity-label">{cartItem.quantity}</span>
                </span>
                <span
                  className="update-quantity-link link-primary"
                  onClick={() => setUpdateInputActive(true)}
                >
                  Update
                </span>
              </>
            )}
            <span
              className="delete-quantity-link link-primary"
              onClick={deleteCartItem}
            >
              Delete
            </span>
          </div>
        </div>

        <div className="delivery-options">
          <div className="delivery-options-title">
            Choose a delivery option:
          </div>
          {deliveryOptions.map((deliveryOption) => {
            let priceString = "FREE Shipping";

            if (deliveryOption.priceCents > 0) {
              priceString = `${formatMoney(deliveryOption.priceCents)} - Shipping`;
            }

            const updateDeliveryOption = async () => {
              await axios.put(`/api/cart-items/${cartItem.productId}`, {
                deliveryOptionId: deliveryOption.id,
              });
              loadCart();
            };

            return (
              <div
                className="delivery-option"
                key={deliveryOption.id}
                onClick={updateDeliveryOption}
              >
                <input
                  type="radio"
                  checked={deliveryOption.id === cartItem.deliveryOptionId}
                  onChange={() => {}}
                  className="delivery-option-input"
                  name={`delivery-option-${cartItem.productId}`}
                />
                <div>
                  <div className="delivery-option-date">
                    {dayjs(deliveryOption.estimatedDeliveryTimeMs).format(
                      "dddd, MMMM D",
                    )}
                  </div>
                  <div className="delivery-option-price">{priceString}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

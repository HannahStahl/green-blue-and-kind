import React from "react";

const CartAmount = ({ cart }) => {
  let total = 0;
  cart.forEach((item) => {
    total += item.quantity;
  });
  return total > 0 && <div className="cart-number">{total}</div>
};

export default CartAmount;

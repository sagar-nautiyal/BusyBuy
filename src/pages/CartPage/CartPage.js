import React, { useEffect, useContext, useState } from "react";
import Loader from "../../components/UI/Loader/Loader";
import styles from "./CartPage.module.css";
import AuthContext from "../../context/Auth/AuthContext";
import { ProductContext } from "../../context/Products/ProductContext";
import ProductCard from "../../components/Product/ProductCard/ProductCard";
import ProductContainer from "../../components/Product/ProductContainer/ProductContainer";
import ProductImage from "../../components/Product/ProductContainer/ProductImage/ProductImage";
import ProductDetails from "../../components/Product/ProductContainer/ProductDetails/ProductDetails";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const { loading } = useContext(ProductContext);
  const {
    cartItems,
    total,
    removeFromCart,
    updateProductQuantity,
    placeOrder,
  } = useContext(ProductContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  if (!user) return null;
  // Write logic to Clear user cart

  // Write logic to Fetch user cart products

  // Write logic to Remove product from cart and cart products list

  // Write logic to Remove product from the database

  const handlePurchase = async () => {
    await placeOrder();
    navigate("/myorders");
  };

  if (loading) return <Loader />;

  return (
    <>
      <aside className={styles.totalPrice}>
        <p>Total: ₹{total()}</p>
        <button className={styles.purchaseBtn} onClick={handlePurchase}>
          Purchase
        </button>
      </aside>
      <div className={styles.cartPageContainer}>
        {/* {cartItems.length > 0 ? (
          cartItems.map((product, idx) => (
            <ProductDetails key={idx} product={product} onCart={true} />
          ))
        ) : (
          <h1>Cart is Empty!</h1>
        )} */}

        {cartItems && cartItems.length > 0 ? (
          <div className={styles.cartItemsContainer}>
            {cartItems.map((product, idx) => (
              <ProductContainer key={idx}>
                <ProductImage image={product.image} />
                <ProductDetails
                  title={product.title}
                  price={product.price}
                  onCart={true} // Set to true to show cart-specific UI
                  productId={product.id}
                  product={product}
                  quantity={product.quantity}
                  removeFromCart={removeFromCart}
                  updateProductQuantity={updateProductQuantity}
                />
              </ProductContainer>
            ))}
          </div>
        ) : (
          <h1>Cart is Empty!</h1>
        )}
      </div>
    </>
  );
};

export default CartPage;

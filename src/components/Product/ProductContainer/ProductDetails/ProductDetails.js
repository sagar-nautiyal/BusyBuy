import React, { useState, useContext } from "react";
import styles from "./ProductDetails.module.css";
import MinusIcon from "../../../UI/Icons/MinusIcon";
import PlusIcon from "../../../UI/Icons/PlusIcon";
import { ProductContext } from "../../../../context/Products/ProductContext";
import AuthContext from "../../../../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductDetails = ({
  title,
  onCart,
  product,
  quantity,
  price,
  removeFromCart,
  updateProductQuantity,
}) => {
  const [productAddingToCart, setProductAddingToCart] = useState(false);
  const [productRemovingFromCart, setProductRemovingCart] = useState(false);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(ProductContext);

  const navigate = useNavigate();
  const handleAddToCart = async () => {
    if (!user) {
      navigate("/signin");
      toast.error("Please login First");
      return;
    }
    try {
      setProductAddingToCart(true);
      addToCart(product);
      setTimeout(() => {
        setProductAddingToCart(false);
        toast.success("Product Added Successfully");
      }, 500);
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }
  };

  const removeProductFromCart = async () => {
    try {
      setProductRemovingCart(true);
      removeFromCart(product);
      setTimeout(() => {
        setProductRemovingCart(false);
        toast.success("Product Removed Successfully");
      }, 500);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleQuantityDecrease = () => {
    updateProductQuantity(product.id, -1);
  };

  const handleQuantityIncrease = () => {
    updateProductQuantity(product.id, 1);
  };
  // Create a Function to add product to cart

  // Create a new cart if it does not exist

  // Create a function to remove the cart

  //Create a Function for Handling the product quantity increase

  //Create a function for  Handling the product quantity decrease

  return (
    <div className={styles.productDetails}>
      <div className={styles.productName}>
        <p>{`${title.slice(0, 35)}...`}</p>
      </div>
      <div className={styles.productOptions}>
        <p>₹ {price}</p>
        {onCart && (
          <div className={styles.quantityContainer}>
            <MinusIcon handleRemove={handleQuantityDecrease} />
            {quantity}
            <PlusIcon handleAdd={handleQuantityIncrease} />
          </div>
        )}
      </div>
      {/* Conditionally Rendering buttons based on the screen */}
      {!onCart ? (
        <button
          className={styles.addBtn}
          title="Add to Cart"
          onClick={handleAddToCart}
        >
          {productAddingToCart ? "Adding" : "Add To Cart"}
        </button>
      ) : (
        <button
          className={styles.removeBtn}
          title="Remove from Cart"
          onClick={removeProductFromCart}
        >
          {productRemovingFromCart ? "Removing" : "Remove From Cart"}
        </button>
      )}
    </div>
  );
};

export default ProductDetails;

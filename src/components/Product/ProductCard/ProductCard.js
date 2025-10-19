import React from "react";
import ProductContainer from "../ProductContainer/ProductContainer";
import ProductDetails from "../ProductContainer/ProductDetails/ProductDetails";
import ProductImage from "../ProductContainer/ProductImage/ProductImage";

// Product Card component
const ProductCard = ({
  product,
  onOwnPage,
  onCart,
  removeProductFromCart,
  updateProductQuantity,
  filterProductFromState,
}) => {
  return (
    <ProductContainer>
      <ProductImage image={product.image} />
      <ProductDetails
        title={product.title}
        price={product.price}
        onOwnPage={onOwnPage}
        productId={product.id}
        onCart={onCart}
        product={product}
        quantity={product.quantity}
        removeProductFromCart={removeProductFromCart}
        updateProductQuantity={updateProductQuantity}
        filterProductFromState={filterProductFromState}
      />
    </ProductContainer>
  );
};

export default ProductCard;

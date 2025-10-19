import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "../Auth/AuthContext";
import { db } from "../../config/firebase";
import {
  getUserCartProducts,
  getProductsUsingProductIds,
} from "../../utils/utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!user) {
  //       setCartItems([]);
  //       return;
  //     }

  //     setLoading(true);
  //     try {
  //       const { data } = await getUserCartProducts(user.uid);

  //       console.log("Cart Data from Firestore:", data);

  //       if (
  //         !data ||
  //         !data.products ||
  //         Object.keys(data.products).length === 0
  //       ) {
  //         setCartItems([]);
  //         return;
  //       }

  //       const products = await getProductsUsingProductIds(data.products);
  //       console.log("Resolved Product Details:", products);

  //       if (products && products.length > 0) {
  //         setCartItems(products);
  //       } else {
  //         setCartItems([]);
  //       }
  //     } catch (err) {
  //       console.log(err.message);
  //       setCartItems([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [user]);

  // const addToCart = async (product) => {
  //   try {
  //     let updatedCart;
  //     const existingIndex = isInCart(product);

  //     if (existingIndex !== -1) {
  //       // Product exists, increase quantity
  //       updatedCart = cartItems.map((item, index) =>
  //         index === existingIndex
  //           ? { ...item, quantity: item.quantity + 1 }
  //           : item
  //       );
  //     } else {
  //       // Product doesn't exist, add new item
  //       console.log("Adding Item in Cart", product);
  //       updatedCart = [
  //         ...cartItems,
  //         {
  //           id: product.id,
  //           title: product.title,
  //           image: product.image,
  //           price: product.price,
  //           quantity: 1,
  //         },
  //       ];
  //     }

  //     // Create cart data for Firebase (only store ID and quantity)
  //     const cartData = {};
  //     updatedCart.forEach((item) => {
  //       cartData[item.id] = item.quantity;
  //     });

  //     // Update Firebase first
  //     await setDoc(doc(db, "usersCarts", user.uid), {
  //       products: cartData,
  //     });

  //     // Only update local state if Firebase update succeeds
  //     setCartItems(updatedCart);

  //     console.log("Cart updated successfully:", updatedCart);
  //   } catch (err) {
  //     console.error("Error updating cart:", err.message);
  //     throw err; // Re-throw for toast handling
  //   }
  // };

  // Fetch cart data when user changes
  useEffect(() => {
    const fetchCartData = async () => {
      if (!user) {
        setCartItems([]);
        return;
      }

      setLoading(true);
      try {
        const { data } = await getUserCartProducts(user.uid);
        console.log("Cart Data from Firestore:", data);

        if (
          !data ||
          !data.products ||
          Object.keys(data.products).length === 0
        ) {
          setCartItems([]);
          return;
        }

        const products = await getProductsUsingProductIds(data.products);
        console.log("Resolved Product Details:", products);

        if (products && products.length > 0) {
          setCartItems(products);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [user]);

  // Add product to cart or increase quantity if already exists
  const addToCart = async (product) => {
    if (!user) return;

    console.log("Adding Product", product);

    // Check if product already exists in cart
    const existingItem = cartItems.find((item) => item.id === product.id);

    let updatedCart;

    if (existingItem) {
      // If product exists, increase quantity
      updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      // If product doesn't exist, add new item
      updatedCart = [
        ...cartItems,
        {
          id: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
          quantity: 1,
        },
      ];
    }

    // Update Firebase
    try {
      const cartData = {};
      updatedCart.forEach((item) => {
        cartData[item.id] = item.quantity;
      });

      await setDoc(doc(db, "usersCart", user.uid), {
        products: cartData,
      });

      setCartItems(updatedCart);
    } catch (error) {
      console.error("Error updating cart in database:", error);
    }
  };

  const removeFromCart = async (product) => {
    if (!user) return;
    const updatedCart = cartItems.filter((item) => item.id !== product.id);
    setCartItems(updatedCart);

    try {
      const cartData = {};
      updatedCart.forEach((item) => {
        cartData[item.id] = item.quantity;
      });

      await setDoc(doc(db, "usersCart", user.uid), {
        products: cartData,
      });
    } catch (error) {
      console.error("Error removing product from database:", error);
    }
  };

  const updateProductQuantity = async (productId, amount) => {
    if (!user) {
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.id === productId
        ? { ...item, quantity: Math.max(item.quantity + amount, 1) }
        : item
    );

    setCartItems(updatedCart);
    try {
      const cartData = {};
      updatedCart.forEach((item) => {
        cartData[item.id] = item.quantity;
      });

      await setDoc(doc(db, "usersCart", user.uid), {
        products: cartData,
      });
    } catch (error) {
      console.error("Error removing product from database:", error);
    }
  };

  const placeOrder = async () => {
    if (!user) return;

    if (!cartItems || cartItems.length === 0) {
      toast.error("Cart is empty, No Orders Found");
      return;
    }
    // updaing firestore
    try {
      const ordersData = {
        products: cartItems,
        total: total(),
        date: serverTimestamp(),
        userId: user.uid,
      };

      await addDoc(collection(db, "orders"), ordersData);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (err) {
      console.log(err.message);
    }

    console.log("Placing orders ", cartItems);
  };

  //fetch orders from firestor

  const getUsersOrder = async () => {
    if (!user) return;

    const q = query(collection(db, "orders"), where("userId", "==", user.uid));
    const querySnapShot = await getDocs(q);

    const usersOrders = querySnapShot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setOrders(usersOrders);
  };
  const isInCart = (product) => {
    return cartItems.findIndex((item) => item.id === product.id);
  };

  const total = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const clearCart = async () => {
    if (!user) return;

    setCartItems([]);

    try {
      await setDoc(doc(db, "usersCart", user.uid), {
        products: {},
      });
    } catch (error) {
      console.error("Error clearing cart in database:", error);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        addToCart,
        cartItems,
        total,
        loading,
        setLoading,
        removeFromCart,
        updateProductQuantity,
        clearCart,
        orders,
        placeOrder,
        getUsersOrder,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

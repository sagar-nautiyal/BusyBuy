import React, { useState, useEffect, useContext } from "react";
import styles from "./OrdersPage.module.css";
import { ProductContext } from "../../context/Products/ProductContext";
import AuthContext from "../../context/Auth/AuthContext";
import Loader from "../../components/UI/Loader/Loader";
import OrderTable from "../../components/OrderTable/OrderTable";

const OrdersPage = () => {
  // Fetch user orders from firestore
  const { orders, getUsersOrder, loading, setLoading } =
    useContext(ProductContext);
  const { user } = useContext(AuthContext);

  console.log("Fetched orders in orderPage", orders);

  useEffect(() => {
    setLoading(true);
    const fetchOrders = async () => {
      if (!user) return;

      await getUsersOrder();

      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  // if(write condition when there are no order present and the loader has been set to false)

  if (loading) {
    return <Loader />;
  }

  // Check if there are no orders after loading is complete
  if (!loading && orders.length === 0) {
    return <h1 style={{ textAlign: "center" }}>No Orders Found!</h1>;
  }

  return (
    <div className={styles.ordersContainer}>
      <h1>Your Orders</h1>
      {orders.map((order, index) => (
        <OrderTable key={order.id || index} order={order} />
      ))}
    </div>
  );
};

export default OrdersPage;

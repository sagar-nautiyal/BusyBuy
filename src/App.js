import React, { useEffect, useContext } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar/Navbar";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import CartPage from "./pages/CartPage/CartPage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

const Layout = () => {
  return (
    <div className="App">
      {/* Define your ContextProvider */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <header>
        <Navbar />
      </header>

      <main>
        <Outlet />
      </main>
      {/* Define your routes here for 
        "/"     ->   HomePage
        "/signup"   ->   RegisterPage
        "/signin"   ->   LoginPage
        "/cart"     ->   CartPage
        "/myorders" ->   OrdersPage
        "/*"        ->   NotFoundPage
        */}
    </div>
  );
};

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "/signup", element: <RegisterPage /> },
        { path: "/signin", element: <LoginPage /> },
        { path: "/cart", element: <CartPage /> },
        { path: "/myorders", element: <OrdersPage /> },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;

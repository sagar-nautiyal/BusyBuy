import React, { useEffect, useState, useContext } from "react";
import styles from "./HomePage.module.css";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import AuthContext from "../../context/Auth/AuthContext";
import data from "../../utils/data";
import Loader from "../../components/UI/Loader/Loader";
import ProductList from "../../components/Product/ProductList/ProductList";

function HomePage() {
  const { loading, setLoading } = useContext(AuthContext);
  // const [priceRange, setPriceRange] = useState(75000);
  // const [categories, setCategories] = useState("");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: [],
    price: 75000,
    search: "",
  });
  // Write logic to Fetch products on app mount

  useEffect(() => {
    setLoading(true);
    setProducts(data);
    setAllProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    handleFilter();
  }, [filters, allProducts]);

  // Write logic to Rerender the products if the search or filter parameters change

  // const handleFilter = () => {
  //   const filtered = allProducts.filter(
  //     (product) =>
  //       product.category === categories && product.price <= priceRange
  //   );
  //   setProducts(filtered);
  // };

  const handleFilter = () => {
    const filtered = allProducts.filter((product) => {
      const matchCategory =
        filters.category.length > 0
          ? filters.category.includes(product.category)
          : true;

      const matchPrice = product.price <= filters.price;

      const matchSearch = filters.search
        ? product.title.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      return matchCategory && matchPrice && matchSearch;
    });

    setProducts(filtered);
  };

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   const value = e.target.value.trim().toLowerCase();
  //   const searchedItem = allProducts.filter((product) => {
  //     const title = product.title.toLowerCase();
  //     return title.includes(value);
  //   });
  //   setProducts(searchedItem);
  // };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setFilters((prev) => ({ ...prev, search: value }));
  };

  // Display loader while products are fetching

  if (loading) return <Loader />;

  return (
    <div className={styles.homePageContainer}>
      <FilterSidebar filters={filters} setFilters={setFilters} />
      <form className={styles.form}>
        <input
          type="search"
          placeholder="Search By Name"
          className={styles.searchInput}
          onChange={(e) => handleSearch(e)}
        />
      </form>
      {/* Write logic to display the product using the ProductList */}
      <ProductList products={products} />
    </div>
  );
}

export default HomePage;

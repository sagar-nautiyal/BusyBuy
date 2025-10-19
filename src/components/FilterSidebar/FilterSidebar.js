import React from "react";
import styles from "./FilterSidebar.module.css";

// const FilterSidebar = ({ setCategories, setPriceRange, priceRange }) => {
//   const handleRangeInput = (e) => {
//     console.log(e.target.value);
//     setPriceRange(e.target.value);
//   };

//   const handleInput = () => {
//     const mens = document.getElementById("mensFashion").checked;
//     const womens = document.getElementById("womensFashion").checked;
//     const jewelery = document.getElementById("jewelery").checked;
//     const electronics = document.getElementById("electronics").checked;

//     if (mens) {
//       setCategories("men's clothing");
//     } else if (womens) {
//       setCategories("women's clothing");
//     } else if (jewelery) {
//       setCategories("jewelery");
//     } else if (electronics) {
//       setCategories("electronics");
//     } else {
//       setCategories(""); // Reset
//     }
//   };

//   return (
//     <aside className={styles.filterContainer}>
//       <h2>Filter</h2>
//       <form>
//         <label htmlFor="price">Price: {priceRange}</label>
//         <input
//           type="range"
//           id="price"
//           name="price"
//           min="1"
//           max="100000"
//           value={priceRange}
//           className={styles.priceRange}
//           step="10"
//           onChange={handleRangeInput}
//         />
//         <h2>Category</h2>
//         <div className={styles.categoryContainer}>
//           <div className={styles.inputContainer}>
//             <input
//               type="checkbox"
//               id="mensFashion"
//               name="mensFashion"
//               onChange={handleInput}
//             />
//             <label htmlFor="mensFashion">Men's Clothing</label>
//           </div>
//           <div className={styles.inputContainer}>
//             <input
//               type="checkbox"
//               id="womensFashion"
//               name="womensFashion"
//               onChange={handleInput}
//             />
//             <label htmlFor="womensFashion">Women's Clothing</label>
//           </div>
//           <div className={styles.inputContainer}>
//             <input
//               type="checkbox"
//               id="jewelery"
//               name="jewelery"
//               onChange={handleInput}
//             />
//             <label htmlFor="jewelery">Jewelery</label>
//           </div>
//           <div className={styles.inputContainer}>
//             <input
//               type="checkbox"
//               id="electronics"
//               name="electronics"
//               onChange={handleInput}
//             />
//             <label htmlFor="electronics">Electronics</label>
//           </div>
//         </div>
//       </form>
//     </aside>
//   );
// };

const FilterSidebar = ({ setFilters, filters }) => {
  const handleRangeInput = (e) => {
    const value = Number(e.target.value);
    setFilters((prev) => ({ ...prev, price: value }));
  };

  const handleInput = (e) => {
    const valueMap = {
      mensFashion: "men's clothing",
      womensFashion: "women's clothing",
      jewelery: "jewelery",
      electronics: "electronics",
    };

    const { id, checked } = e.target;
    const value = valueMap[id];

    setFilters((prev) => {
      let updatedCategory = [...prev.category];

      if (checked) {
        updatedCategory.push(value);
      } else {
        updatedCategory = updatedCategory.filter((cat) => cat !== value);
      }

      return { ...prev, category: updatedCategory };
    });
  };

  return (
    <aside className={styles.filterContainer}>
      <h2>Filter</h2>
      <form>
        <label htmlFor="price">Price: {filters.price}</label>
        <input
          type="range"
          id="price"
          name="price"
          min="1"
          max="100000"
          value={filters.price}
          className={styles.priceRange}
          step="10"
          onChange={handleRangeInput}
        />
        <h2>Category</h2>
        <div className={styles.categoryContainer}>
          <div className={styles.inputContainer}>
            <input
              type="checkbox"
              id="mensFashion"
              name="mensFashion"
              onChange={handleInput}
            />
            <label htmlFor="mensFashion">Men's Clothing</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              type="checkbox"
              id="womensFashion"
              name="womensFashion"
              onChange={handleInput}
            />
            <label htmlFor="womensFashion">Women's Clothing</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              type="checkbox"
              id="jewelery"
              name="jewelery"
              onChange={handleInput}
            />
            <label htmlFor="jewelery">Jewelery</label>
          </div>
          <div className={styles.inputContainer}>
            <input
              type="checkbox"
              id="electronics"
              name="electronics"
              onChange={handleInput}
            />
            <label htmlFor="electronics">Electronics</label>
          </div>
        </div>
      </form>
    </aside>
  );
};

export default FilterSidebar;

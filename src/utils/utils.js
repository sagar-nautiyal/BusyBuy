import data from "./data";
import {
  doc,
  writeBatch,
  query,
  where,
  getDocs,
  collection,
  getDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Add data to the products collection only for one time so that they can be used again.
const addDataToCollection = async () => {
  try {
    const batch = writeBatch(db);
    data.forEach((product) => {
      const docRef = doc(db, "products", product.id.toString());
      batch.set(docRef, product);
    });

    const res = await batch.commit();
  } catch (error) {
    console.log(error);
  }
};

// Fetch products from firestore based on their ids. Firestore 'in' queries support up to 10
// values, so we batch requests when needed. Falls back to local `data` on errors or empty
// results.
const getProductsUsingProductIds = async (cart) => {
  console.log("Cart object received:", cart);

  if (!cart || typeof cart !== "object" || Object.keys(cart).length === 0) {
    console.log("No cart items found");
    return [];
  }

  const productIds = Object.keys(cart).map(Number).filter((n) => !Number.isNaN(n));
  console.log("Product IDs to fetch:", productIds);

  if (!productIds.length) return [];

  const productsRef = collection(db, "products");
  const BATCH_SIZE = 10; // Firestore 'in' supports up to 10 values
  const batches = [];

  for (let i = 0; i < productIds.length; i += BATCH_SIZE) {
    batches.push(productIds.slice(i, i + BATCH_SIZE));
  }

  try {
    const allDocs = [];

    for (const batchIds of batches) {
      const q = query(productsRef, where("id", "in", batchIds));
      const snap = await getDocs(q);
      if (!snap.empty) {
        allDocs.push(...snap.docs);
      }
    }

    if (!allDocs.length) {
      console.log("No products found in database, using local data");
      const productsData = data
        .filter((product) => productIds.includes(product.id))
        .map((product) => ({
          ...product,
          quantity: cart[product.id] || 1,
        }));

      console.log("Products from local data:", productsData);
      return productsData;
    }

    const productsData = allDocs.map((docSnap) => {
      const productData = docSnap.data();
      return {
        ...productData,
        quantity: cart[productData.id] || 1,
      };
    });

    console.log("Products from Firestore:", productsData);
    return productsData;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback to local data if Firestore fails
    const productsData = data
      .filter((product) => productIds.includes(product.id))
      .map((product) => ({
        ...product,
        quantity: cart[product.id] || 1,
      }));

    console.log("Products from local data (fallback):", productsData);
    return productsData;
  }
};

// Fetch users cart products from firestore
const getUserCartProducts = async (uid) => {
  if (!uid) return { docRef: null, data: null };

  const docRef = doc(db, "usersCart", uid);
  try {
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      // Return a consistent shape when there's no document
      return { docRef, data: null };
    }

    return { docRef, data: docSnap.data() };
  } catch (error) {
    console.error("Error fetching user cart:", error);
    return { docRef, data: null };
  }
};

// Simple function to format date
// const convertDate = (date) => {
//   return new Date(date).toISOString().split("T")[0];
// };
const convertDate = (timestamp) => {
  if (!timestamp) return "";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  return date.toISOString().split("T")[0];
};
export {
  addDataToCollection,
  getProductsUsingProductIds,
  getUserCartProducts,
  convertDate,
};

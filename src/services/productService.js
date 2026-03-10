import { db, storage } from "../firebase/firebase.config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export const getProducts = async (filters = {}) => {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  let products = snapshot.docs.map((d) => ({
    _id: d.id,
    id: d.id,
    ...d.data(),
  }));

  // Client-side filtering (avoids needing Firestore composite indexes)
  products = products.filter((p) => p.active !== false);

  if (filters.category) {
    products = products.filter((p) => p.category === filters.category);
  }
  if (filters.brand) {
    products = products.filter((p) => p.brand === filters.brand);
  }
  if (filters.priceMin !== undefined && filters.priceMin !== null) {
    products = products.filter((p) => Number(p.price) >= filters.priceMin);
  }
  if (filters.priceMax !== undefined && filters.priceMax !== null) {
    products = products.filter((p) => Number(p.price) <= filters.priceMax);
  }
  if (filters.color) {
    products = products.filter((p) =>
      p.color && p.color.toLowerCase().includes(filters.color.toLowerCase())
    );
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    products = products.filter((p) =>
      p.productName.toLowerCase().includes(s)
    );
  }

  return products;
};

export const getProductById = async (id) => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { _id: docSnap.id, id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const getProductsBySection = async (section) => {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => ({ _id: d.id, id: d.id, ...d.data() }))
    .filter((p) => p.active !== false && p.section === section);
};

const uploadImage = async (file) => {
  const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const createProduct = async (data, imageFiles = []) => {
  const imageUrls = [];
  for (const file of imageFiles) {
    const url = await uploadImage(file);
    imageUrls.push(url);
  }

  const docRef = await addDoc(collection(db, "products"), {
    ...data,
    images: imageUrls,
    img: imageUrls[0] || "",
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateProduct = async (id, data, newImageFiles = [], existingImages = []) => {
  const newUrls = [];
  for (const file of newImageFiles) {
    const url = await uploadImage(file);
    newUrls.push(url);
  }

  const allImages = [...existingImages, ...newUrls];
  const updateData = {
    ...data,
    images: allImages,
    img: allImages[0] || "",
    updatedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, "products", id), updateData);
};

export const getAllProducts = async () => {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() }));
};

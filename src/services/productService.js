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
  const constraints = [where("active", "==", true)];

  if (filters.category) {
    constraints.push(where("category", "==", filters.category));
  }
  if (filters.brand) {
    constraints.push(where("brand", "==", filters.brand));
  }

  constraints.push(orderBy("createdAt", "desc"));

  const q = query(collection(db, "products"), ...constraints);
  const snapshot = await getDocs(q);
  let products = snapshot.docs.map((d) => ({
    _id: d.id,
    id: d.id,
    ...d.data(),
  }));

  if (filters.priceMin !== undefined && filters.priceMin !== null) {
    products = products.filter((p) => Number(p.price) >= filters.priceMin);
  }
  if (filters.priceMax !== undefined && filters.priceMax !== null) {
    products = products.filter((p) => Number(p.price) <= filters.priceMax);
  }
  if (filters.color) {
    products = products.filter((p) =>
      p.color.toLowerCase().includes(filters.color.toLowerCase())
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
  const q = query(
    collection(db, "products"),
    where("active", "==", true),
    where("section", "==", section),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() }));
};

export const createProduct = async (data, imageFile) => {
  let imageUrl = data.img || "";

  if (imageFile) {
    const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    imageUrl = await getDownloadURL(storageRef);
  }

  const docRef = await addDoc(collection(db, "products"), {
    ...data,
    img: imageUrl,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateProduct = async (id, data, imageFile) => {
  const updateData = { ...data, updatedAt: serverTimestamp() };

  if (imageFile) {
    const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    updateData.img = await getDownloadURL(storageRef);
  }

  await updateDoc(doc(db, "products", id), updateData);
};

export const getAllProducts = async () => {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() }));
};

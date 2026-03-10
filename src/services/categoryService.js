import { db } from "../firebase/firebase.config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export const getAllCategories = async () => {
  const q = query(collection(db, "categories"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getActiveCategories = async () => {
  const q = query(collection(db, "categories"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((cat) => cat.active !== false);
};

export const createCategory = async (data) => {
  const docRef = await addDoc(collection(db, "categories"), {
    ...data,
    active: true,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateCategory = async (id, data) => {
  await updateDoc(doc(db, "categories", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteCategory = async (id) => {
  // Check if any products use this category
  const catDoc = await getDoc(doc(db, "categories", id));
  if (!catDoc.exists()) return;

  const catName = catDoc.data().name;
  const q = query(
    collection(db, "products"),
    where("category", "==", catName)
  );
  const snap = await getDocs(q);
  if (snap.size > 0) {
    throw new Error(`No se puede eliminar: ${snap.size} productos usan esta categoría`);
  }

  await deleteDoc(doc(db, "categories", id));
};

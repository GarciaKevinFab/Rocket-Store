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
  writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const createOrder = async (orderData, proofFile) => {
  let paymentProof = "";

  if (proofFile) {
    const storageRef = ref(
      storage,
      `payment-proofs/${Date.now()}_${proofFile.name}`
    );
    await uploadBytes(storageRef, proofFile);
    paymentProof = await getDownloadURL(storageRef);
  }

  const docRef = await addDoc(collection(db, "orders"), {
    ...orderData,
    paymentProof,
    status: "pendiente",
    notes: "",
    tracking: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getUserOrders = async (userId) => {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getAllOrders = async (statusFilter) => {
  let q;
  if (statusFilter && statusFilter !== "todos") {
    q = query(
      collection(db, "orders"),
      where("status", "==", statusFilter),
      orderBy("createdAt", "desc")
    );
  } else {
    q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getOrderById = async (orderId) => {
  const docRef = doc(db, "orders", orderId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const getOrderByIdAndEmail = async (orderId, email) => {
  const docRef = doc(db, "orders", orderId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.userEmail === email || data.guestEmail === email) {
      return { id: docSnap.id, ...data };
    }
  }
  return null;
};

export const updateOrderStatus = async (orderId, status, notes) => {
  await updateDoc(doc(db, "orders", orderId), {
    status,
    notes: notes || "",
    updatedAt: serverTimestamp(),
  });
};

export const updateOrderTracking = async (orderId, trackingNumber, carrier) => {
  await updateDoc(doc(db, "orders", orderId), {
    tracking: { number: trackingNumber, carrier },
    updatedAt: serverTimestamp(),
  });
};

export const linkGuestOrdersToUser = async (email, userId) => {
  const q = query(
    collection(db, "orders"),
    where("guestEmail", "==", email),
    where("isGuest", "==", true)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return 0;

  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => {
    batch.update(d.ref, { userId, isGuest: false });
  });
  await batch.commit();
  return snapshot.size;
};

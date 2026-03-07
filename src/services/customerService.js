import { db } from "../firebase/firebase.config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export const getAllCustomers = async () => {
  // Get registered users
  const usersSnap = await getDocs(collection(db, "users"));
  const registeredUsers = {};
  usersSnap.docs.forEach((d) => {
    const data = d.data();
    registeredUsers[data.email] = {
      id: d.id,
      type: "registrado",
      name: data.displayName || "",
      email: data.email,
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || "",
      department: data.department || "",
      district: data.district || "",
      role: data.role || "customer",
      createdAt: data.createdAt,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: null,
    };
  });

  // Get all orders to aggregate customer data
  const ordersSnap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
  const guestCustomers = {};

  ordersSnap.docs.forEach((d) => {
    const order = d.data();
    const email = order.userEmail || order.guestEmail;
    if (!email) return;

    if (registeredUsers[email]) {
      // Aggregate for registered user
      registeredUsers[email].totalOrders += 1;
      if (order.status !== "cancelado") {
        registeredUsers[email].totalSpent += order.total || 0;
      }
      if (!registeredUsers[email].lastOrderDate) {
        registeredUsers[email].lastOrderDate = order.createdAt;
      }
    } else if (order.isGuest) {
      // Aggregate for guest
      if (!guestCustomers[email]) {
        guestCustomers[email] = {
          id: email,
          type: "invitado",
          name: order.userName || "",
          email: email,
          phone: order.userPhone || "",
          address: order.shippingAddress?.address || "",
          city: order.shippingAddress?.city || "",
          department: order.shippingAddress?.department || "",
          district: order.shippingAddress?.district || "",
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: null,
        };
      }
      guestCustomers[email].totalOrders += 1;
      if (order.status !== "cancelado") {
        guestCustomers[email].totalSpent += order.total || 0;
      }
      if (!guestCustomers[email].lastOrderDate) {
        guestCustomers[email].lastOrderDate = order.createdAt;
      }
    }
  });

  // Combine and sort by last order date
  const allCustomers = [
    ...Object.values(registeredUsers).filter((u) => u.role !== "admin"),
    ...Object.values(guestCustomers),
  ];

  allCustomers.sort((a, b) => {
    const dateA = a.lastOrderDate?.toDate ? a.lastOrderDate.toDate() : a.lastOrderDate ? new Date(a.lastOrderDate) : new Date(0);
    const dateB = b.lastOrderDate?.toDate ? b.lastOrderDate.toDate() : b.lastOrderDate ? new Date(b.lastOrderDate) : new Date(0);
    return dateB - dateA;
  });

  return allCustomers;
};

export const getCustomerOrders = async (email) => {
  // Query orders by userEmail or guestEmail
  const q1 = query(collection(db, "orders"), where("userEmail", "==", email), orderBy("createdAt", "desc"));
  const q2 = query(collection(db, "orders"), where("guestEmail", "==", email), orderBy("createdAt", "desc"));

  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

  const ordersMap = {};
  snap1.docs.forEach((d) => { ordersMap[d.id] = { id: d.id, ...d.data() }; });
  snap2.docs.forEach((d) => { ordersMap[d.id] = { id: d.id, ...d.data() }; });

  const orders = Object.values(ordersMap);
  orders.sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
    return dateB - dateA;
  });

  return orders;
};

export const getCustomerById = async (customerId) => {
  // Try as Firestore user ID first
  const userDoc = await getDoc(doc(db, "users", customerId));
  if (userDoc.exists()) {
    const data = userDoc.data();
    return {
      id: userDoc.id,
      type: "registrado",
      name: data.displayName || "",
      email: data.email,
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || "",
      department: data.department || "",
      district: data.district || "",
      createdAt: data.createdAt,
    };
  }

  // Otherwise treat customerId as email (guest)
  const email = decodeURIComponent(customerId);
  const orders = await getCustomerOrders(email);
  if (orders.length > 0) {
    const firstOrder = orders[orders.length - 1];
    return {
      id: email,
      type: "invitado",
      name: firstOrder.userName || "",
      email: email,
      phone: firstOrder.userPhone || "",
      address: firstOrder.shippingAddress?.address || "",
      city: firstOrder.shippingAddress?.city || "",
      department: firstOrder.shippingAddress?.department || "",
      district: firstOrder.shippingAddress?.district || "",
      createdAt: firstOrder.createdAt,
    };
  }

  return null;
};

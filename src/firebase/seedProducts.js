import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.config";
import { paginationItems, SplOfferData } from "../constants";

// Maps products to Firestore format with categories
const categoryMap = {
  "Perfume": "Perfumes",
  "iPhone": "Smartphones",
  "Samsung Galaxy": "Smartphones",
  "Xiaomi": "Smartphones",
  "AirPods": "Accesorios Tech",
  "Audifonos": "Accesorios Tech",
  "Cargador": "Accesorios Tech",
  "Cable": "Accesorios Tech",
  "Funda": "Accesorios Tech",
  "Case": "Accesorios Tech",
  "Vidrio Templado": "Accesorios Tech",
  "Power Bank": "Accesorios Tech",
  "Adaptador": "Accesorios Tech",
  "Hub": "Accesorios Tech",
  "Apple Watch": "Relojes",
  "Galaxy Watch": "Relojes",
  "Reloj": "Relojes",
  "Crema": "Cuidado Personal",
  "Set de Cuidado": "Cuidado Personal",
  "Serum": "Cuidado Personal",
  "Protector Solar": "Cuidado Personal",
  "Bloqueador": "Cuidado Personal",
  "Mascarilla Facial": "Cuidado Personal",
  "Agua Micelar": "Cuidado Personal",
  "Contorno de Ojos": "Cuidado Personal",
};

const brandMap = {
  "Paco Rabanne": "Paco Rabanne",
  "Dior": "Dior",
  "Carolina Herrera": "Carolina Herrera",
  "Versace": "Versace",
  "Chanel": "Chanel",
  "Louis Vuitton": "Louis Vuitton",
  "Dolce & Gabbana": "Dolce & Gabbana",
  "Armani": "Armani",
  "Jean Paul Gaultier": "Jean Paul Gaultier",
  "Hugo Boss": "Hugo Boss",
  "Lancome": "Lancome",
  "iPhone": "Apple",
  "AirPods": "Apple",
  "MagSafe": "Apple",
  "Apple Watch": "Apple",
  "Cable USB-C Lightning": "Apple",
  "Samsung": "Samsung",
  "Galaxy": "Samsung",
  "Xiaomi": "Xiaomi",
  "Redmi": "Xiaomi",
  "JBL": "JBL",
  "Casio": "Casio",
};

const getCategory = (name) => {
  for (const [key, value] of Object.entries(categoryMap)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return "Otros";
};

const getBrand = (name) => {
  for (const [key, value] of Object.entries(brandMap)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return "Rocket";
};

// Remove duplicate products by name
const getUniqueProducts = () => {
  const seen = new Set();
  const unique = [];
  for (const item of paginationItems) {
    if (!seen.has(item.productName)) {
      seen.add(item.productName);
      unique.push(item);
    }
  }
  return unique;
};

export const seedProducts = async () => {
  // Check if products already exist
  const existing = await getDocs(collection(db, "products"));
  if (existing.size > 0) {
    console.log(`Ya existen ${existing.size} productos. No se hizo seed.`);
    return { seeded: false, count: existing.size };
  }

  const uniqueProducts = getUniqueProducts();
  let count = 0;

  for (const item of uniqueProducts) {
    await addDoc(collection(db, "products"), {
      productName: item.productName,
      price: Number(item.price),
      color: item.color,
      badge: item.badge,
      des: item.des,
      img: typeof item.img === "string" ? item.img : "",
      category: getCategory(item.productName),
      brand: getBrand(item.productName),
      stock: 50,
      active: true,
      section: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    count++;
  }

  console.log(`Seed completado: ${count} productos creados.`);
  return { seeded: true, count };
};

import { db } from "./firebase";
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { getUserRole, canManageBooks } from "./roles";
import type { Book } from "@/types/Book";

// додати книгу
export async function addBook(book: Omit<Book, "id">, userId: string) {
  const role = await getUserRole(userId);
  if (!role) throw new Error("Unauthorized");

  await addDoc(collection(db, "books"), { ...book, ownerId: userId, createdAt: Date.now() });
}

// отримати книги користувача
export async function getUserBooks(userId: string) {
  const q = query(collection(db, "books"), where("ownerId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Book[];
}

// додат  всі книги 
export async function getAllBooks() {
  const snap = await getDocs(collection(db, "books"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Book[];
}

// оновити книгу
export async function updateBook(bookId: string, data: Partial<Book>, userId: string) {
  const snap = await getDoc(doc(db, "books", bookId));
  if (!snap.exists()) throw new Error("Book not found");

  const book = snap.data() as Book;
  const role = await getUserRole(userId);

  if (!canManageBooks(role, book.ownerId, userId)) throw new Error("Forbidden");

  await updateDoc(doc(db, "books", bookId), data);
}

// видалити книгу
export async function deleteBook(bookId: string, userId: string) {
  const snap = await getDoc(doc(db, "books", bookId));
  if (!snap.exists()) throw new Error("Book not found");

  const book = snap.data() as Book;
  const role = await getUserRole(userId);

  if (!canManageBooks(role, book.ownerId, userId)) throw new Error("Forbidden");

  await deleteDoc(doc(db, "books", bookId));
}

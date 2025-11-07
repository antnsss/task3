"use server";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Book } from "@/types/Book";

// ─ Мої книги
export async function getUserBooks(userId: string): Promise<Book[]> {
  const q = query(collection(db, "books"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Book, "id">) }));
}

// ─ Додати книгу
export async function addBook(book: Omit<Book, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(collection(db, "books"), {
    ...book,
    createdAt: Date.now(),
  });
  return docRef.id;
}

// ─ Видалити книгу
export async function deleteBook(bookId: string): Promise<void> {
  await deleteDoc(doc(db, "books", bookId));
}

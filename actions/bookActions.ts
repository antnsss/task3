"use server";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, getDoc, orderBy, startAfter, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Book } from "@/types/Book";

// ─ Мої книги (для конкретного користувача)
export async function getUserBooks(userId: string): Promise<Book[]> {
  const q = query(collection(db, "books"), where("userId", "==", userId), orderBy("createdAt", "desc"));
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

// ─ Список книг з пошуком, сортуванням і пагінацією
export async function getBooks(
  search: string = "",
  sort: "name" | "author" = "name",
  pageSize: number = 5,
  lastDocId?: string
): Promise<{ books: Book[]; lastDocId?: string }> {
  let q = query(collection(db, "books"), orderBy(sort), limit(pageSize));

  if (lastDocId) {
    const lastDocSnap = await getDoc(doc(db, "books", lastDocId));
    if (lastDocSnap.exists()) {
      q = query(collection(db, "books"), orderBy(sort), startAfter(lastDocSnap), limit(pageSize));
    }
  }

  const snap = await getDocs(q);

  // Мапимо документи у Book
  let books: Book[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Book, "id">) }));

  // Пошук з безпечним доступом до name/author
  if (search) {
    const searchLower = search.toLowerCase();
    books = books.filter(
      b =>
        (b.name?.toLowerCase().includes(searchLower) || false) ||
        (b.author?.toLowerCase().includes(searchLower) || false)
    );
  }

  const lastVisible = snap.docs[snap.docs.length - 1];
  return { books, lastDocId: lastVisible?.id };
}

// ─ Деталі книги
export async function getBookById(id?: string): Promise<Book | null> {
  if (!id) return null; // якщо id не переданий
  try {
    const snap = await getDoc(doc(db, "books", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<Book, "id">) };
  } catch (err) {
    console.error("getBookById error:", err);
    return null;
  }
}

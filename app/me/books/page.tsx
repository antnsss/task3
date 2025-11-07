"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserBooks, addBook, deleteBook } from "@/actions/bookActions";
import { Book } from "@/types/Book";

export default function MyBooksPage() {
  const [user, setUser] = useState<any>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const myBooks = await getUserBooks(u.uid);
        setBooks(myBooks);
      } else {
        setUser(null);
        setBooks([]);
      }
    });
    return () => unsub();
  }, []);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Увійдіть для додавання книги");

    await addBook({ userId: user.uid, name, author, photo });
    const updated = await getUserBooks(user.uid);
    setBooks(updated);
    setName(""); setAuthor(""); setPhoto("");
  };

  const handleDelete = async (id: string) => {
    await deleteBook(id);
    setBooks(books.filter(b => b.id !== id));
  };

  if (!user) return <p>Увійдіть, щоб переглянути свої книги</p>;

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Мої книги</h1>

      <form onSubmit={handleAddBook} className="flex flex-col gap-3 mb-6">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Назва" className="border p-2 rounded" required />
        <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Автор" className="border p-2 rounded" required />
        <input value={photo} onChange={e => setPhoto(e.target.value)} placeholder="Фото URL" className="border p-2 rounded" />
        <button className="bg-blue-600 text-white p-2 rounded">Додати книгу</button>
      </form>

      <ul className="space-y-3">
        {books.map(b => (
          <li key={b.id} className="border p-3 flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{b.name}</h2>
              <p className="text-gray-600">{b.author}</p>
            </div>
            <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-700">🗑</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

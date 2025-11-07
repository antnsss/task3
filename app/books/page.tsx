"use client";

import { useState, useEffect } from "react";
import { getBooks } from "@/actions/bookActions";
import Link from "next/link";
import { Book } from "@/types/Book";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"name" | "author">("name");
  const [lastDocId, setLastDocId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async (reset = false) => {
    setLoading(true);
    const res = await getBooks(search, sort, 5, reset ? undefined : lastDocId);
    if (reset) setBooks(res.books);
    else setBooks(prev => [...prev, ...res.books]);
    setLastDocId(res.lastDocId);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks(true);
  }, [search, sort]);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Список книг</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Пошук за назвою або автором"
          className="border p-2 rounded flex-1"
        />
        <select value={sort} onChange={e => setSort(e.target.value as "name" | "author")} className="border p-2 rounded">
          <option value="name">Сортувати за назвою</option>
          <option value="author">Сортувати за автором</option>
        </select>
      </div>

      <ul className="space-y-3">
        {books.map(b => (
          <li key={b.id} className="border p-3 flex justify-between items-center">
            <div>
              <Link href={`/books/${b.id}`} className="font-semibold text-blue-600 hover:underline">
                {b.name || "Без назви"}
              </Link>
              <p className="text-gray-600">{b.author || "Без автора"}</p>
            </div>
          </li>
        ))}
      </ul>

      {lastDocId && (
        <button
          onClick={() => fetchBooks()}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Завантаження..." : "Завантажити ще"}
        </button>
      )}
    </main>
  );
}

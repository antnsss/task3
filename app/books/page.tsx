"use client";

import { useState, useEffect } from "react";
import { getBooks } from "@/actions/bookActions";
import Link from "next/link";
import { Book } from "@/types/Book";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"name" | "author">("name");
  const [lastDocId, setLastDocId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchBooks = async (reset = false) => {
    setLoading(true);
    const res = await getBooks(search, sort, 5, reset ? undefined : lastDocId);
    if (reset) setBooks(res.books);
    else setBooks((prev) => [...prev, ...res.books]);
    setLastDocId(res.lastDocId);
    setLoading(false);
    setInitialLoading(false);
  };

  useEffect(() => {
    fetchBooks(true);
  }, [search, sort]);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 Список книг</h1>

    
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder="Пошук за назвою або автором"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={sort} onValueChange={(v: "name" | "author") => setSort(v)}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Сортувати за..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Сортувати за назвою</SelectItem>
            <SelectItem value="author">Сортувати за автором</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {initialLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-5 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </Card>
          ))}
        </div>
      ) : books.length === 0 ? (
        <p className="text-center text-gray-500">Немає книг для відображення</p>
      ) : (
        <div className="space-y-4">
          {books.map((b) => (
            <Card key={b.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>
                  <Link
                    href={`/books/${b.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {b.name || "Без назви"}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Автор: {b.author || "Без автора"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}


      {lastDocId && !initialLoading && (
        <div className="flex justify-center mt-6">
          <Button onClick={() => fetchBooks()} disabled={loading}>
            {loading ? "Завантаження..." : "Завантажити ще"}
          </Button>
        </div>
      )}
    </main>
  );
}

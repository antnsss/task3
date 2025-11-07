"use client";

import { useEffect, useState } from "react";
import { getUserBooks, addBook, deleteBook } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function MyBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadBooks() {
      if (!auth.currentUser) return;
      const list = await getUserBooks(auth.currentUser.uid);
      setBooks(list);
    }
    loadBooks();
  }, []);

  async function handleAdd() {
    if (!auth.currentUser || !name.trim() || !author.trim()) return;

    setLoading(true);
    await addBook(
      {
        name,
        author,
        available: true,
        ownerId: auth.currentUser.uid,
        createdAt: Date.now(),
      },
      auth.currentUser.uid
    );

    setName("");
    setAuthor("");
    const list = await getUserBooks(auth.currentUser.uid);
    setBooks(list);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!auth.currentUser) return;
    await deleteBook(id, auth.currentUser.uid);
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">📚 My Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 mb-4">
            <div>
              <Label htmlFor="name">Book Name</Label>
              <Input
                id="name"
                placeholder="Enter book name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="Enter author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd} disabled={loading}>
              {loading ? "Adding..." : "Add Book"}
            </Button>
          </div>

          <Separator className="my-4" />

          <ul className="space-y-3">
            {books.length === 0 ? (
              <p className="text-gray-500 text-center">No books yet 😔</p>
            ) : (
              books.map((b) => (
                <li
                  key={b.id}
                  className="flex justify-between items-center border p-3 rounded-lg hover:bg-muted transition"
                >
                  <div>
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-sm text-gray-600">{b.author}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(b.id)}
                  >
                    Delete
                  </Button>
                </li>
              ))
            )}
          </ul>
        </CardContent>
        <CardFooter className="text-sm text-gray-500 justify-center">
          Manage your personal book collection
        </CardFooter>
      </Card>
    </main>
  );
}

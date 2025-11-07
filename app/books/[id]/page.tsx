// app/books/[id]/page.tsx
import { getBookById } from "@/actions/bookActions";
import { Book } from "@/types/Book";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>; // params — це Promise
}

export default async function BookDetailsPage({ params }: Props) {
  const { id } = await params; // Розпаковуємо асинхронно

  const book: Book | null = await getBookById(id);

  if (!book) {
    return (
      <main className="p-6 max-w-2xl mx-auto">
        <p className="text-red-500">Книга не знайдена або неправильний id</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{book.name || "Без назви"}</h1>
      <p className="text-gray-600 mb-2">Автор: {book.author || "Без автора"}</p>
      {book.photo && (
        <img src={book.photo} alt={book.name} className="mb-4 max-w-full rounded" />
      )}
    </main>
  );
}

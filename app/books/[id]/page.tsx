import { getBookById } from "@/actions/bookActions";
import { Book } from "@/types/Book";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookDetailsPage({ params }: Props) {
  const { id } = await params;
  const book: Book | null = await getBookById(id);

  if (!book) {
    return (
      <main className="p-6 flex justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Помилка</AlertTitle>
          <AlertDescription>Книга не знайдена або неправильний ID.</AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className="p-6 flex justify-center">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{book.name || "Без назви"}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Автор: {book.author || "Без автора"}
          </p>
        </CardHeader>
        <CardContent>
          {book.photo ? (
            <img
              src={book.photo}
              alt={book.name}
              className="w-full rounded-md mb-3"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-md text-gray-400">
              Без зображення
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="secondary" onClick={() => history.back()}>
            Назад
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

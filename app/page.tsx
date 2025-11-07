"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="p-6">
      {user ? (
        <>
          <h1 className="text-2xl font-bold mb-2">
            Вітаю, {user.email}
          </h1>
          <button
            onClick={() => signOut(auth)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Вийти
          </button>
        </>
      ) : (
        <>
          <h1 className="text-xl mb-4">Ви не авторизовані</h1>
          <div className="flex gap-4">
            <Link href="/login" className="text-blue-600 underline">
              Увійти
            </Link>
            <Link href="/register" className="text-blue-600 underline">
              Реєстрація
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [bookCount, setBookCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

  
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) setUserData(userSnap.data());

  
      const q = query(collection(db, "books"), where("ownerId", "==", currentUser.uid));
      const snapshot = await getDocs(q);
      setBookCount(snapshot.size);

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-10">Завантаження...</p>;
  }

  if (!userData) {
    return <p className="text-center mt-10">Помилка: дані не знайдено</p>;
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-[400px] shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Профіль користувача
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-gray-700">
          <p><strong>Ім’я:</strong> {userData.name || "—"}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>UID:</strong> {userData.uid}</p>
          <p><strong>Кількість книг:</strong> {bookCount}</p>

          <Button
            onClick={async () => {
              await signOut(auth);
              router.push("/login");
            }}
            className="w-full mt-4 bg-red-600 hover:bg-red-700"
          >
            Вийти
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

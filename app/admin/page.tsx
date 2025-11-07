"use client";
import { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUserRole } from "@/lib/roles";
import { auth } from "@/lib/firebase";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      if (!auth.currentUser) return;
      const userRole = await getUserRole(auth.currentUser.uid);
      setRole(userRole);

      if (userRole !== "admin") {
        alert("Access denied");
        return;
      }

      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    fetchUsers();
  }, []);

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "users", id));
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  async function promoteToAdmin(id: string) {
    await updateDoc(doc(db, "users", id), { role: "admin" });
    alert("User promoted to admin");
  }

  if (role !== "admin") return <p>Only admin can access this page</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Admin Panel</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id} className="flex justify-between mb-2">
            <span>{u.name} ({u.role})</span>
            <div>
              <button onClick={() => promoteToAdmin(u.id)} className="mr-2 text-blue-600">Make Admin</button>
              <button onClick={() => handleDelete(u.id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

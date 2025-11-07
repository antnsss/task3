import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getUserRole(userId: string): Promise<"admin" | "user"> {
  const snap = await getDoc(doc(db, "users", userId));
  if (!snap.exists()) return "user";
  const data = snap.data();
  return data.role || "user";
}

export function canManageUsers(role: string) {
  return role === "admin";
}

export function canManageBooks(role: string, bookOwnerId: string, userId: string) {
  return role === "admin" || bookOwnerId === userId;
}

import { cookies } from "next/headers";

export async function login(username, password) {
  // Dummy check (replace with DB or API)
  if (username === "admin" && password === "password123") {
    cookies().set("session", "valid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    return { success: true };
  }
  return { success: false, message: "Invalid credentials" };
}

export function logout() {
  cookies().delete("session");
}

export function isAuthenticated() {
  return cookies().get("session")?.value === "valid";
}

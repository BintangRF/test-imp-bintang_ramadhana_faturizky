"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-base-200">
      <h1 className="text-4xl font-bold mb-4 text-primary text-center">
        Selamat Datang di Hono Blog
      </h1>
      <p className="mb-6 text-base text-base-content/80">
        Kelola postinganmu dengan mudah. Silakan login untuk memulai.
      </p>

      <div className="flex gap-3.5">
        <button
          className="btn btn-primary btn-lg hover:btn-secondary transition-colors duration-300"
          onClick={() => router.push("/signup")}
        >
          Sign Up
        </button>
        <button
          className="btn btn-primary btn-lg hover:btn-secondary transition-colors duration-300"
          onClick={() => router.push("/signin")}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";

export default function SignupPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const mutation = useMutation(
    async (data) => {
      const res = await api.post("/auth/signup", data);
      return res.data;
    },
    {
      onSuccess: () => {
        router.push("/signin");
      },
      onError: (err) => {
        alert(err.response?.data?.message || "Sign Up gagal");
      },
    }
  );

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-base-100 p-8 rounded-2xl shadow-lg w-96 flex flex-col gap-4"
      >
        <h2 className="text-3xl font-bold text-center text-primary mb-2">
          Sign Up
        </h2>
        <p className="text-sm text-base-content/70 text-center mb-4">
          Buat akun baru untuk mengelola postingan
        </p>
        <input
          type="text"
          placeholder="Username"
          className="input input-bordered w-full"
          {...register("username")}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
          {...register("password")}
          required
        />

        <button
          type="submit"
          className="btn btn-primary w-full mt-2 hover:btn-secondary transition-colors duration-300"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Loading..." : "Sign Up"}
        </button>
        <p className="text-sm text-center text-base-content/50 mt-2">
          Sudah punya akun?{" "}
          <button
            type="button"
            className="text-primary font-semibold hover:underline"
            onClick={() => router.push("/signin")}
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
}

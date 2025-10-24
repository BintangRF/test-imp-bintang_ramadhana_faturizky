"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/utils/axios";
import { Eye, EyeOff } from "lucide-react";
import Toast from "@/components/Toast";

export default function SigninPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const mutation = useMutation(
    async (data) => {
      const res = await api.post("/auth/signin", data);
      return res.data;
    },
    {
      onSuccess: () => {
        setTimeout(() => router.push("/dashboard"), 500);
      },
      onError: (err) => {
        setToast({
          message: err.response?.data?.message || "Sign In gagal",
          type: "error",
        });
      },
    }
  );

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-base-100 p-8 rounded-2xl shadow-lg w-96 flex flex-col gap-4"
      >
        <h2 className="text-3xl font-bold text-center text-primary mb-2">
          Sign In
        </h2>
        <p className="text-sm text-base-content/70 text-center mb-4">
          Masukkan username dan password untuk melanjutkan
        </p>

        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Username"
            className="input input-bordered w-full"
            {...register("username", { required: "Username wajib diisi" })}
          />
          {errors.username && (
            <p className="text-xs text-error mt-1">{errors.username.message}</p>
          )}
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input input-bordered w-full pr-10"
            {...register("password", { required: "Password wajib diisi" })}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>

          {errors.password && (
            <p className="text-xs text-error mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full mt-2 hover:btn-secondary transition-colors duration-300"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Loading..." : "Sign In"}
        </button>

        <p className="text-sm text-center text-base-content/50 mt-2">
          Belum punya akun?{" "}
          <button
            type="button"
            className="text-primary font-semibold hover:underline"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}

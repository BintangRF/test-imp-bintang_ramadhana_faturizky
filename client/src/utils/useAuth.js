"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "./axios";

export const useAuth = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["authMe"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data.user;
    },
  });

  return { user: data, isLoading, isError };
};

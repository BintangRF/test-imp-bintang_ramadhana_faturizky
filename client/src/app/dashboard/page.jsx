"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/utils/axios";
import { useAuth } from "@/utils/useAuth";
import Toast from "@/components/Toast";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [toast, setToast] = useState(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await api.get("/posts");
      return res.data.data;
    },
  });

  const createOrUpdateMutation = useMutation({
    mutationFn: async (post) => {
      if (editingPost) return api.put(`/posts/${editingPost.id}`, post);
      else return api.post("/posts", post);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setModalOpen(false);
      setEditingPost(null);
      setToast({ message: res.data.message || "Berhasil", type: "success" });
    },
    onError: (err) => {
      const message = err.response?.data?.message || "Gagal";
      setToast({ message, type: "error" });
    },
  });

  const deleteMutation = useMutation(async (id) => api.delete(`/posts/${id}`), {
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setToast({
        message: res.data.message || "Post deleted",
        type: "success",
      });
    },
    onError: (err) => {
      const message = err.response?.data?.message || "Gagal hapus post";
      setToast({ message, type: "error" });
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const openModalForEdit = (post) => {
    setEditingPost(post);
    reset({ title: post.title, content: post.content });
    setModalOpen(true);
  };

  const openModalForCreate = () => {
    setEditingPost(null);
    reset({ title: "", content: "" });
    setModalOpen(true);
  };

  const onSubmit = (data) => createOrUpdateMutation.mutate(data);

  if (isLoading)
    return (
      <DashboardLayout>
        <p className="text-center text-base-content/70">Loading posts...</p>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">
          Posts Dashboard
        </h1>
        <button
          className="btn btn-primary"
          onClick={openModalForCreate}
          disabled={createOrUpdateMutation.isPending}
        >
          + Create Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="card bg-base-100 shadow-md border border-base-300"
          >
            <div className="card-body">
              <h2 className="card-title text-base-content">{post.title}</h2>
              <p className="text-sm text-base-content/70 mb-2">
                {post.content}
              </p>
              <p className="text-xs text-base-content/50 mb-4">
                Author: {post.username}
              </p>

              {(user?.role === "admin" || user?.id === post.user_id) && (
                <div className="card-actions justify-end gap-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => openModalForEdit(post)}
                    disabled={createOrUpdateMutation.isPending}
                  >
                    {createOrUpdateMutation.isPending ? "Loading..." : "Edit"}
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => deleteMutation.mutate(post.id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-100 shadow-md rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-base-content">
              {editingPost ? "Edit Post" : "Create Post"}
            </h3>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <input
                type="text"
                placeholder="Title"
                className="input input-bordered w-full"
                {...register("title")}
                required
              />
              <textarea
                placeholder="Content"
                className="textarea textarea-bordered w-full"
                {...register("content")}
                required
              />
              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createOrUpdateMutation.isPending}
                >
                  {createOrUpdateMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setModalOpen(false)}
                  disabled={createOrUpdateMutation.isPending}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/utils/axios";
import Toast from "@/components/Toast";
import PostCard from "@/components/PostCard";
import PostModal from "@/components/PostModal";
import PostDetailModal from "@/components/PostDetailModal";
import Pagination from "@/components/Pagination";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [detailPost, setDetailPost] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["posts", page],
    queryFn: async () => (await api.get(`/posts?page=${page}`)).data,
    keepPreviousData: true,
  });

  const posts = data?.data || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };
  const totalPages = pagination.totalPages;

  const createOrUpdateMutation = useMutation({
    mutationFn: async (post) =>
      editingPost
        ? api.put(`/posts/${editingPost.id}`, post)
        : api.post("/posts", post),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setModalOpen(false);
      setEditingPost(null);
      setToast({ message: res.data.message || "Berhasil", type: "success" });
    },
    onError: (err) =>
      setToast({
        message: err.response?.data?.message || "Gagal",
        type: "error",
      }),
  });

  const deleteMutation = useMutation(async (id) => api.delete(`/posts/${id}`), {
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setToast({
        message: res.data.message || "Post deleted",
        type: "success",
      });
    },
    onError: (err) =>
      setToast({
        message: err.response?.data?.message || "Gagal hapus post",
        type: "error",
      }),
  });

  const openModalForEdit = (post) => {
    setEditingPost(post);
    setModalOpen(true);
  };
  const openModalForCreate = () => {
    setEditingPost(null);
    setModalOpen(true);
  };
  const openDetailModal = (post) => setDetailPost(post);
  const closeDetailModal = () => setDetailPost(null);

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
        <button className="btn btn-primary" onClick={openModalForCreate}>
          + Create Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onEdit={openModalForEdit}
            onDelete={(id) => deleteMutation.mutate(id)}
            onDetail={openDetailModal}
          />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <PostModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onSubmit}
        editingPost={editingPost}
      />
      <PostDetailModal post={detailPost} onClose={closeDetailModal} />
    </DashboardLayout>
  );
}

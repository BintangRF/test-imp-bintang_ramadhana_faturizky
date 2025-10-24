"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function PostModal({ isOpen, onClose, onSubmit, editingPost }) {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (editingPost)
      reset({ title: editingPost.title, content: editingPost.content });
    else reset({ title: "", content: "" });
  }, [editingPost, reset]);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-base-100 shadow-md rounded-xl">
        <h3 className="font-bold text-lg mb-4 text-base-content">
          {editingPost ? "Edit Post" : "Create Post"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

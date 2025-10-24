"use client";

import { useAuth } from "@/utils/useAuth";

export default function PostCard({ post, onEdit, onDelete, onDetail }) {
  const { user } = useAuth();
  const isOwner = user?.role === "admin" || user?.id === post.user_id;

  return (
    <div className="card bg-base-100 shadow-md border border-base-300">
      <div className="card-body">
        <h2 className="card-title text-base-content">{post.title}</h2>
        <p className="text-sm text-base-content/70 mb-2 line-clamp-3">
          {post.content}
        </p>
        <p className="text-xs text-base-content/50 mb-4">
          Author: {post.username}
        </p>
        <div className="card-actions justify-end gap-2">
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => onDetail(post)}
          >
            Detail
          </button>
          {isOwner && (
            <>
              <button
                className="btn btn-sm btn-info"
                onClick={() => onEdit(post)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => onDelete(post.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

export default function PostDetailModal({ post, onClose }) {
  if (!post) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl bg-base-100 shadow-md rounded-xl">
        <h3 className="font-bold text-xl mb-4 text-base-content">
          {post.title}
        </h3>
        <p className="text-base-content/80 mb-4 whitespace-pre-line">
          {post.content}
        </p>
        <p className="text-xs text-base-content/50 mb-2">
          Author: {post.username}
        </p>
        <div className="modal-action">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

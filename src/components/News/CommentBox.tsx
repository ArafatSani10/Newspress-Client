"use client";

import { useState } from "react";

export default function CommentBox() {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComment("");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6 font-sans">
      <h3 className="text-lg font-black  mb-6 border-b-2 border-black pb-2 inline-block">
        Leave a Comment
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
      
        <textarea
          rows={5}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-black resize-none transition-colors"
          required
        ></textarea>
        <button
          type="submit"
          className="bg-black text-white text-[11px] font-black  px-8 py-3 rounded-sm hover:bg-gray-800 transition-all "
        >
          Post Comment
        </button>
      </form>
    </div>
  );
}
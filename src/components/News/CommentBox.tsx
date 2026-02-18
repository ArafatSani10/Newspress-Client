"use client";

import { useForm } from "@tanstack/react-form";
import { commentService } from "@/services/comment.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // sonner ইমপোর্ট করলাম

interface CommentBoxProps {
  postId: string;
}

export default function CommentBox({ postId }: CommentBoxProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      text: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await commentService.create({
          text: value.text,
          postId: postId,
        });

        if (response.success) {
          toast.success("Comment posted successfully!");
          form.reset();
          router.refresh();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Failed to post comment");
      }
    },
  });

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-2 font-sans">
      <h3 className="text-lg font-black mb-6 border-b-2 border-black pb-2 inline-block ">
        Leave a Comment
      </h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="text">
          {(field) => (
            <textarea
              rows={5}
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-black resize-none transition-colors"
              required
            ></textarea>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="bg-black text-white text-[11px] font-black px-8 py-3 rounded-sm hover:bg-gray-800 transition-all uppercase disabled:bg-gray-400"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
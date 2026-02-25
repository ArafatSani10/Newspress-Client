"use client";

import { authClient } from "@/lib/auth-client";
import { Comment, commentService } from "@/services/comment.service";
import { Clock, CornerDownRight, Edit3, LogIn, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const fetchComments = async () => {
    const res = await commentService.getByPostId(postId);
    if (!res.error) setComments(res.data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const totalCommentsCount = comments.reduce((acc, curr) => {
    return acc + 1 + (curr.replies?.length || 0);
  }, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUpdate = async (commentId: string) => {
    if (!editText.trim()) return;
    setIsSubmitting(true);
    const res = await commentService.update(commentId, editText);
    setIsSubmitting(false);
    if (res.success) {
      toast.success("Updated!");
      setEditingId(null);
      fetchComments();
    } else {
      toast.error(res.message);
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!session) { setShowAuthModal(true); return; }
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    const res = await commentService.create({ text: replyText, postId, parentId });
    setIsSubmitting(false);
    if (res.success) {
      toast.success("Reply posted!");
      setReplyText("");
      setReplyTo(null);
      fetchComments();
    }
  };

  const UserAvatar = ({ user, size }: { user: any, size: string }) => (
    <div className={`relative ${size} rounded-full overflow-hidden bg-gray-900 text-white shrink-0 border border-gray-200`}>
      {user?.image ? (
        <Image src={user.image} alt="" fill className="object-cover" />
      ) : (
        <div className="h-full w-full flex items-center justify-center font-bold uppercase text-[10px]">
          {user?.name?.charAt(0)}
        </div>
      )}
    </div>
  );

  const ActionButtons = ({ id, userId, text }: { id: string, userId: string, text: string }) => {
    const currentUser = session?.user as
      | { id?: string; role?: string }
      | undefined;
    const isOwner = currentUser?.id === userId;
    const isAdmin = currentUser?.role === "ADMIN";
    if (!isOwner && !isAdmin) return null;
    return (
      <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity bg-white px-2 py-1 rounded-full shadow-sm border border-gray-100">
        {isOwner && (
          <button onClick={() => { setEditingId(id); setEditText(text); }} className="text-gray-400 hover:text-black">
            <Edit3 size={12} />
          </button>
        )}
        <button onClick={() => { if(confirm("Delete?")) commentService.delete(id).then(() => fetchComments()) }} className="text-gray-400 hover:text-red-600">
          <Trash2 size={12} />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 mt-10 font-sans relative">
      <h3 className="text-sm font-black border-b border-black pb-2 tracking-wide text-black uppercase inline-block">
        Comments ({totalCommentsCount})
      </h3>

      <div className="space-y-10 mt-6">
        {comments.map((c) => (
          <div key={c.id} className="group/item relative">
            <div className="flex gap-4">
               <UserAvatar user={c.user} size="h-10 w-10" />
               <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-black text-gray-900 uppercase tracking-tight">{c.user.name}</span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock size={10} /> {formatDate(c.createdAt)}
                      </span>
                    </div>
                    <ActionButtons id={c.id} userId={c.userId} text={c.text} />
                  </div>
                  {editingId === c.id ? (
                    <div className="mt-2 space-y-2">
                      <textarea className="w-full border-2 border-black p-3 text-sm focus:outline-none min-h-[80px]" value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus />
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdate(c.id)} className="bg-black text-white text-[10px] px-4 py-2 uppercase font-black">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 text-[10px] uppercase font-black">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[14px] text-gray-700 leading-relaxed">{c.text}</p>
                  )}
                  <button onClick={() => setReplyTo(replyTo === c.id ? null : c.id)} className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-1 transition-colors">
                    <CornerDownRight size={12} /> Reply
                  </button>
               </div>
            </div>

            {(c.replies?.length || replyTo === c.id) && (
              <div className="ml-5 mt-4 border-l-2 border-gray-200 pl-8 space-y-8 relative">
                {c.replies?.map((reply) => (
                  <div key={reply.id} className="group/item relative">
                    <div className="absolute -left-[34px] top-5 w-8 h-8 border-l-2 border-b-2 border-gray-200 rounded-bl-xl"></div>
                    <div className="flex gap-3">
                      <UserAvatar user={reply.user} size="h-8 w-8" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-3">
                            <span className="text-[12px] font-bold text-gray-800 uppercase tracking-tight">{reply.user?.name}</span>
                            <span className="text-[9px] text-gray-400 flex items-center gap-1">
                               <Clock size={9} /> {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <ActionButtons id={reply.id} userId={reply.userId} text={reply.text} />
                        </div>
                        {editingId === reply.id ? (
                          <div className="mt-2 space-y-2">
                            <textarea className="w-full border-2 border-black p-2 text-sm focus:outline-none min-h-[60px]" value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus />
                            <button onClick={() => handleUpdate(reply.id)} className="bg-black text-white text-[9px] px-3 py-1.5 uppercase font-black">Save</button>
                          </div>
                        ) : (
                          <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-sm border border-gray-100">{reply.text}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {replyTo === c.id && (
                  <div className="relative animate-in slide-in-from-left-4 duration-300">
                     <div className="absolute -left-[34px] top-5 w-8 h-8 border-l-2 border-b-2 border-gray-200 rounded-bl-xl"></div>
                     <div className="flex gap-3 items-start pl-2">
                        <div className="flex-1 bg-white border border-black p-1 flex gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <input className="flex-1 p-2 text-sm focus:outline-none" placeholder="Write a reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} autoFocus />
                          <button disabled={isSubmitting} onClick={() => handleReplySubmit(c.id)} className="bg-black text-white text-[10px] px-4 py-2 uppercase font-black hover:bg-gray-800 transition-colors">
                            {isSubmitting ? "..." : "Post"}
                          </button>
                        </div>
                        <button onClick={() => setReplyTo(null)} className="p-2 text-gray-400 hover:text-red-500 mt-1"><X size={16}/></button>
                     </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-10 border-2 border-black max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300 relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"><X size={24} /></button>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6 border-2 border-black"><LogIn size={32} /></div>
              <h4 className="text-xl font-black  mb-4">Login Required</h4>
              <p className="text-sm text-gray-600 mb-8 ">Please sign in to join the conversation. Only registered members can post comments or replies.</p>
              <Link href="/login" className="block w-full bg-black text-white text-xs font-black py-4  hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(150,150,150,1)] active:shadow-none active:translate-x-0 active:translate-y-0">Sign In Now</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
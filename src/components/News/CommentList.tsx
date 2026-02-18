"use client";

export default function CommentList() {
  const dummyComments = [
    { id: 1, name: "User One", date: "Feb 18, 2026", text: "This is a very insightful article. Keep up the good work!" },
    { id: 2, name: "User Two", date: "Feb 17, 2026", text: "I really like the clean design of this news portal." }
  ];

  return (
    <div className="space-y-6 mt-10">
      <h3 className="text-sm font-semibold border-b border-gray-200 pb-2 tracking-wide text-gray-500 uppercase">
        Comments ({dummyComments.length})
      </h3>
      <div className="space-y-6">
        {dummyComments.map((c) => (
          <div key={c.id} className="border-b border-gray-50 pb-4 last:border-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-gray-900 tracking-wide">{c.name}</span>
              <span className="text-[10px] text-gray-400 font-sans">{c.date}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-sans">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";
import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/supabase-utils/browser-client";


export function TicketComments({ticket, initialComments}) {
  const commentRef = useRef(null);
  const supabase = getSupabaseBrowserClient()
  const [comments, setComments] = useState(initialComments || []);
  const { id } = ticket

  useEffect(() => {
    const listener = (payload) => {
      const eventType = payload.eventType
      console.log("Realtime event received!", payload);
      if (eventType === "INSERT") {
        setComments((prevComments) => [...prevComments, payload.new]);
      } else if (eventType === "DELETE") {
      setComments((prevComments) =>
        prevComments
          .filter((comment) => comment.id !== payload.old.id)
      );
    } else if (eventType === "UPDATE") {
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === payload.new.id ? payload.new : comment
        )
      );
    }
    };
    const subscription = supabase
      .channel("my-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `ticket=eq.${id}`
        },
        listener,
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, []);

  return (
    <section>
      <h4>Comments</h4>
      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          const comment_text = commentRef.current.value.trim();
          if (!comment_text) return alert("Please enter a comment");
          commentRef.disabled = true;
          supabase
            .from("comments")
            .insert({
              // we need to reference to ticket id
              ticket: id,
              comment_text,
            })
            .then(() => {
              commentRef.current.value = "";
              commentRef.disabled = false;
            });
        }}
      >
        <div>
          <label htmlFor="comment" className="sr-only">
            Add your comment
          </label>
          <textarea
            ref={commentRef}
            rows="3"
            name="comment"
            id="comment"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Add your comment..."
          ></textarea>
        </div>
        <div className="mt-3 flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Post comment
          </button>
        </div>
      </form>
      <section>
        <ul role="list" className="divide-y divide-gray-200">
          {comments.map((comment) => (
            <li key={comment.id} className="py-4">
              <article key={comment.created_at}>
                <strong>{comment.author_name} </strong>
                <time>at {new Date(comment.created_at).toLocaleString("en-US")}</time>
                <p>{comment.comment_text}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
      <section>We have {initialComments.length} comments.</section>
    </section>
  );
}

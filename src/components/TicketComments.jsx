"use client";
import { useRef } from "react";

const comments = [
  {
    author: "Dave",
    date: "2027-01-01",
    content: "This is a comment from Dave",
  },
  {
    author: "Alice",
    date: "2027-01-02",
    content: "This is a comment from Alice",
  },
];

export function TicketComments() {
  const commentRef = useRef(null);
  return (
    <section>
      <h4>Comments</h4>
      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          alert("TODO: Add comment");
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
            <li key={comment.author} className="py-4">
              <article key={comment.date}>
                <strong>{comment.author} </strong>
                <time>{comment.date}</time>
                <p>{comment.content}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
      <section>We have {comments.length} comments.</section>
    </section>
  );
}

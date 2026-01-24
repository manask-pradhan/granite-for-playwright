import React from "react";

import Button from "components/Button";

const Comments = ({
  comments,
  loading,
  setNewComment,
  newComment,
  handleSubmit,
}) => (
  <>
    <form className="mb-16" onSubmit={handleSubmit}>
      <div className="sm:grid sm:grid-cols-1 sm:items-start sm:gap-1">
        <label className="block text-sm font-medium text-nitro-gray-800 sm:mt-px sm:pt-2">
          Comment
        </label>
        <textarea
          className="block w-full flex-1 resize-none rounded-md border border-bb-border p-2 text-bb-gray-600 shadow-sm focus:border-bb-purple focus:ring-bb-purple sm:text-sm"
          data-testid="comments-text-field"
          placeholder="Ask a question or post an update"
          rows={3}
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
        />
      </div>
      <Button
        buttonText="Comment"
        dataTestId="comments-submit-button"
        loading={loading}
        type="submit"
      />
    </form>
    {comments?.map((comment, index) => (
      <div
        className="text-md my-2 flex justify-between rounded border border-bb-border px-8 py-3 leading-5"
        data-testid="task-comment"
        key={comment.id}
      >
        <p
          className="text-bb-gray-600"
          data-testid="task-comment-content"
          key={index}
        >
          {comment.content}
        </p>
        <p
          className="text-bb-gray-600 text-opacity-50"
          data-testid="task-comment-creation-date"
        >
          {new Date(comment.created_at).toLocaleString()}
        </p>
      </div>
    ))}
  </>
);

export default Comments;

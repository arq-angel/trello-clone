
const CommentItem = ({comment, handleDeleteComment}) => {
  return (
    <li className="bg-gray-100/50 rounded">
      <div className="flex flex-col p-2">
        <div>
          {comment?.text}
        </div>
        <div>
          <p className="text-sm text-gray-700 italic">By: {comment?.author?.name}</p>
        </div>

      </div>
    </li>
  );
};

export default CommentItem;
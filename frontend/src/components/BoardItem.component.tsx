import {Link} from "react-router-dom";
import {Trash2} from "lucide-react";

const BoardItem = ({workspaceId, board, handleDeleteBoard}) => {
  return (
      <li key={board.id} className="relative h-48">
          <Link
              to={`/workspaces/${workspaceId}/boards/${board.id}/lists`}
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full flex flex-col justify-between"
          >
              <div className="text-lg font-semibold">{board.name}</div>
              <div className="text-sm text-gray-500">Last updated: 2 days ago</div>
          </Link>

          <button
              type="button"
              className="absolute bottom-4 right-4 p-1 text-red-600 hover:text-red-800 transition-colors rounded bg-white"
              onClick={(e) => {
                  e.stopPropagation();  // just in case
                  handleDeleteBoard(board.id);
              }}
              aria-label="Delete board"
          >
              <Trash2 size={18} className="hover: cursor-pointer"/>
          </button>
      </li>
  );
};

export default BoardItem;
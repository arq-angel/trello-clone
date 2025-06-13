import type {IComment} from "@/models";
import {Trash2} from "lucide-react";
import {useCommentActions} from "@/hooks/useCommentActions.ts";
import {confirmDialog} from "@/utils/confirm-dailog.ts";
import {toast} from "react-hot-toast";
import {useSelector} from "react-redux";
import type {RootState} from "@/app/store.ts";

interface CommentItemProps {
    comment: IComment;
    className?: string;
}

const CommentItem = ({comment, className}: CommentItemProps) => {
    const {deleteComment} = useCommentActions();

    const user = useSelector((state: RootState) => state.auth.user)

    const handleDelete = async () => {

        if (!user || !comment) return;

        if (user.id !== comment.author.id) return;

        const confirmed = await confirmDialog({
            title: `Delete Comment "${comment.text}"?`,
            text: "This action cannot be undone.",
            confirmButtonText: "Delete",
        });

        if (confirmed) {
            if (!comment) return;
            const {success} = await deleteComment(comment.id);
            if (!success) toast.error("Could not delete comment");
        }
    };

    return (
        <div
            className={`inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 ${className ?? ""}`}
        >
            <div className="flex justify-between items-start gap-2 w-full">
                <div className="flex flex-col gap-1 max-w-[90%]">
                    <div className="flex gap-1 flex-wrap break-words">
                        <p className="font-medium">{comment?.author?.name}:</p>
                        <p className="whitespace-pre-wrap break-all">{comment?.text}</p>
                    </div>
                </div>
                {user?.id === comment.author.id && (
                    <div className="text-red-500 hover:cursor-pointer">
                        <Trash2 className="w-4 h-4" onClick={handleDelete}/>
                    </div>
                )}
            </div>
        </div>
    )
};

export default CommentItem;
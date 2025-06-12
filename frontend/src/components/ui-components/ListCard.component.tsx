import ListSettings from "@/components/list-card-components/ListSettings.component.tsx";

interface ListCardProps {
    board: IBoard;
    list: IList;
}

const ListCard = ({board, list}: ListCardProps) => {
    return (
        <div
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col h-auto min-h-[300px] min-w-[250px]"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold">{list.name}</div>
                <ListSettings list={list} board={board}/>
            </div>
        </div>
    );
};

export default ListCard;
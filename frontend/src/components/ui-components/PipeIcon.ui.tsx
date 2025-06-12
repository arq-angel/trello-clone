const PipeIcon = ({className = ''}: { className?: string }) => {
    return (
        <span className={`mx-2 text-gray-500 ${className ?? ''}`}>|</span>
    )
};

export default PipeIcon;
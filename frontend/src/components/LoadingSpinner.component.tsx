interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-50"></div>
            <p className="text-gray-500 text-sm">{message}</p>
        </div>
    );
};

export default LoadingSpinner;

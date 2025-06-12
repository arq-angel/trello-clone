interface MenuItemProps {
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    label?: string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

const MenuItem = ({icon: Icon, label, onClick, className, disabled}: MenuItemProps) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center px-3 py-1 text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-200 ${className ?? ""}`}
    >
        {Icon && !label && <Icon className="h-5 w-5"/>}
        {Icon && label && <Icon className="h-5 w-5 mr-2"/>}
        {label ?? ''}
    </button>
);

export default MenuItem;
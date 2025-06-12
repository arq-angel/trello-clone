import {Link} from "react-router-dom";

const UnAuthenticatedNavbar = () => {
    return (
        <nav className="p-4 border-b border-gray-300 flex items-center">
            <Link
                to="/"
                className="mr-4 font-semibold text-lg text-blue-500"
            >Dashboard</Link>
            <div className="ml-auto">
                <Link
                    to="/login"
                    className="mr-4 ml-auto px-3 py-1 border border-blue-500 rounded text-blue-500 hover:bg-blue-500 hover:text-white hover: cursor-pointer transition-colors duration-200"
                >Login</Link>
                <Link
                    to="/register"
                    className="ml-auto px-3 py-1 border border-blue-500 rounded text-blue-500 hover:bg-blue-500 hover:text-white hover: cursor-pointer transition-colors duration-200"
                >Register</Link>
            </div>
        </nav>
    )
};

export default UnAuthenticatedNavbar;
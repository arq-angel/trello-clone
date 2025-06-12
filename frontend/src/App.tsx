import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "./pages/Login.page.tsx";
import RegisterPage from "./pages/Register.page.tsx";
import Dashboard from "./pages/Dashboard.page.tsx";
import ProtectedRoutes from "./routes/ProtectedRoutes.tsx";
import PublicRoute from "./routes/PublicRoute.tsx";
import Navbar from "./components/Navbar.component.tsx";
import Lists from "./pages/Lists.page.tsx";
import Boards from "./pages/Boards.tsx";

function App() {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage/>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <RegisterPage/>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoutes>
                            <Dashboard/>
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/workspaces/:workspaceId/boards"
                    element={
                        <ProtectedRoutes>
                            <Boards/>
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/workspaces/:workspaceId/boards/:boardId/lists"
                    element={
                        <ProtectedRoutes>
                            <Lists/>
                        </ProtectedRoutes>
                    }
                />
            </Routes>
        </Router>
    )
}

export default App;

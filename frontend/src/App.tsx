import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "./pages/Login.page.tsx";
import RegisterPage from "./pages/Register.page.tsx";
import DashboardPage from "./pages/Dashboard.page.tsx";
import ProtectedRoutes from "./routes/ProtectedRoutes.tsx";
import PublicRoute from "./routes/PublicRoute.tsx";
import NavbarComponent from "./components/Navbar.component.tsx";
import BoardPage from "./pages/Board.page.tsx";
import WorkspacePage from "./pages/Workspace.page.tsx";

function App() {
    return (
        <Router>
            <NavbarComponent/>
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
                            <DashboardPage/>
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/workspaces/:workspaceId"
                    element={
                        <ProtectedRoutes>
                            <WorkspacePage/>
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/boards/:boardId"
                    element={
                        <ProtectedRoutes>
                            <BoardPage/>
                        </ProtectedRoutes>
                    }
                />
            </Routes>
        </Router>
    )
}

export default App;

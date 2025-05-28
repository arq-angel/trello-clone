import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/auth.routes";
import boardRoutes from "./routes/board.routes";
import listRoutes from "./routes/list.routes";
import taskRoutes from "./routes/task.routes";
import commentRoutes from "./routes/comment.routes";
import workspaceRoutes from "./routes/workspace.routes";
import dotenv from "dotenv";

// this needs to be initialized before calling and using the .env variables
dotenv.config();

const app = express();

// CORS Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // Allow sending Authorization headers
}));
app.use(express.json());

// Auth Routes
app.use('/api/auth', authRoutes);

// Workspace Routes
app.use('/api/workspaces', workspaceRoutes);

// Board Routes
app.use('/api/boards', boardRoutes);

// List Routes
app.use('/api/lists', listRoutes);

// Task Routes
app.use('/api/tasks', taskRoutes);

// Comment Routes
app.use('/api/comments', commentRoutes);

// Error handling middleware (must be last)
app.use((err: any, req: any, res: any, next: any) => {
    const isDev = process.env.NODE_ENV === "development";

    console.error('Error stack:', err.stack);
    console.error('Request info:', {
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        params: req.params,
        query: req.query,
        user: req.user, // if you attach a user in auth middleware
    });

    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message ?? "Internal Server Error",
        error: isDev ? err.stack : undefined
    });
});


export default app;
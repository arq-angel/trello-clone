import app from "./app";
import {connectDB} from "./config/db";

//simpler way to connect DB and start server for small applications
/*// Connect to DB
const MONGODB_URI = process.env.MONGODB_URI!;
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.log("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});*/

// Connect to DB and Start server
const PORT = process.env.PORT ?? 3000;

(async () => {
    await connectDB(); // Connect to MongoDB

    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
})();



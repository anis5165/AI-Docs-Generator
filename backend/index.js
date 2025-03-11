const express = require("express");
const cors = require("cors");
const connectDB = require("./connection");
const documentationRoutes = require("./routers/docsRouter");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// API Routes
app.use("/api", documentationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

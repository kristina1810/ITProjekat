const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { poolPromise } = require("./db");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);

app.get("/", async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .query("SELECT GETDATE() AS currentDate");

        res.json({
            message: "Lost & Found API radi",
            databaseTime: result.recordset[0].currentDate
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
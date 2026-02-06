const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000; // Use Render's assigned port if available

app.use(cors());
app.use(express.json());

// Routes (must match the exact file name and path)
const transactionRoutes = require("./routes/transactions"); 
app.use("/api/transactions", transactionRoutes);

// Connect to MongoDB
mongoose
  .connect(
    "mongodb://ranjanih213_db_user:Ranjani213@ac-ywxi39y-shard-00-00.zw5dmjh.mongodb.net:27017,ac-ywxi39y-shard-00-01.zw5dmjh.mongodb.net:27017,ac-ywxi39y-shard-00-02.zw5dmjh.mongodb.net:27017/?ssl=true&replicaSet=atlas-ahvjs0-shard-0&authSource=admin"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo error:", err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

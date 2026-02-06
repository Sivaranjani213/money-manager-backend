const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");


// ================= ADD =================
router.post("/", async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ================= GET ALL =================
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= SUMMARY =================
router.get("/summary", async (req, res) => {
  try {
    const income = await Transaction.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const expense = await Transaction.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      income: income[0]?.total || 0,
      expense: expense[0]?.total || 0,
      balance:
        (income[0]?.total || 0) -
        (expense[0]?.total || 0)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= CATEGORY SUMMARY =================
router.get("/category-summary", async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= REPORT FILTER =================
router.get("/report/:type", async (req, res) => {
  try {
    const { type } = req.params;

    let startDate = new Date();

    if (type === "week") {
      startDate.setDate(startDate.getDate() - 7);
    } 
    else if (type === "month") {
      startDate.setMonth(startDate.getMonth() - 1);
    } 
    else if (type === "year") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const income = await Transaction.aggregate([
      {
        $match: {
          type: "income",
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const expense = await Transaction.aggregate([
      {
        $match: {
          type: "expense",
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json({
      income: income[0]?.total || 0,
      expense: expense[0]?.total || 0,
      balance:
        (income[0]?.total || 0) -
        (expense[0]?.total || 0)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= UPDATE =================
router.put("/:id", async (req, res) => {
  try {
    const { title, amount, type, category, division } = req.body;

    const updatedTransaction =
      await Transaction.findByIdAndUpdate(
        req.params.id,
        {
          title,
          amount: Number(amount),
          type,
          category,
          division,
        },
        { new: true }
      );

    res.json(updatedTransaction);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= DELETE =================
router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

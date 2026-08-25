const express = require("express");
const db = require("../db");
const router = express.Router();
const upload = require("../middleware/uploads");

/////////////Add Customar

router.post("/", upload.single("photo"), (req, res) => {
  const { name, phone } = req.body;
  const photo = req.file ? req.file.filename : null;

  const sql = `INSERT INTO customers (name,phone,photo) VALUES (?,?,?)`;

  db.query(sql, [name, phone, photo], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          message: "Phone Number Already Exists",
        });
      }
      return res.status(500).json({
        message: "Failed to Save Customer",
      });
    }
    return res.status(201).json({
      message: "Customer saved successfully",
      customerId: result.insertId,
    });
  });
});

//////Photo Upload

// router.post("/upload-test", upload.single("photo"), (req, res) => {
//   console.log(req.file);

//   res.json({
//     message: "Photo Upload Successfully",
//     file: req.file,
//   });
// });

//////////////////////////Fetch All Customar

router.get("/", (req, res) => {
  const sql = ` SELECT id, name, phone, photo, created_at
    FROM customers ORDER BY id DESC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Failed to fetch customers", err.message);
      return res.status(500).json({
        message: "Failed to fetch Customers",
      });
    } else {
      res.json(results);
    }
  });
});

/////////////////Fetch Single Customar

router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT id, name, phone, photo, created_at
    FROM customers
    WHERE id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Failed to fetch customer:", err.message);

      return res.status(500).json({
        message: "Failed to fetch customer",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json(results[0]);
  });
});

///////////////////Update Customar//////////////////////////////

router.put("/:id", upload.single("photo"), (req, res) => {
  const id = req.params.id;
  const { name, phone } = req.body;

  // Find old photo
  const findSql = `SELECT photo FROM customers WHERE id = ?`;

  db.query(findSql, [id], (err, results) => {
    if (err) {
      console.error("Failed to find customer:", err.message);

      return res.status(500).json({
        message: "Failed to find customer",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const oldPhoto = results[0].photo;

    const newPhoto = req.file ? req.file.filename : oldPhoto;

    // Update customer
    const updateSql = `UPDATE customers SET name = ?, phone = ?, photo = ? WHERE id = ?`;

    db.query(updateSql, [name, phone, newPhoto, id], (err, results) => {
      if (err) {
        console.error("Failed to update customer:", err.message);

        return res.status(500).json({
          message: "Failed to update customer",
        });
      }

      return res.json({
        message: "Customer updated successfully",
      });
    });
  });
});

//////////////////////////Delete Customers

const fs = require("fs");
const path = require("path");

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const selectSql = `SELECT photo FROM customers WHERE id =?`;

  db.query(selectSql, [id], (err, results) => {
    if (err) {
      console.error("Failed to find customer:", err.message);

      return res.status(500).json({
        message: "Failed to delete customer",
      });
    }
    if (results.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }
    const photo = results[0].photo;

    const deleteSql = `DELETE FROM customers WHERE id = ?`;

    db.query(deleteSql, [id], (err) => {
      if (err) {
        console.error("Failed to delete customer:", err.message);

        return res.status(500).json({
          message: "Failed to delete customer",
        });
      }

      if (photo) {
        const photoPath = path.join(
          __dirname,
          "..",
          "uploads",
          "customers",
          photo,
        );
        fs.unlink(photoPath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error("Failed to delete photo:", err.message);
          }
        });

        return res.json({
          message: "Customer deleted successfully",
        });
      }
    });
  });
});

module.exports = router;

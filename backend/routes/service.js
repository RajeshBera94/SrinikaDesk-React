const express = require("express");
const db = require("../db");

const router = express.Router();

// ============================================
// GET ALL PARENT SERVICES
// ============================================

router.get("/", (req, res) => {
  const sql = `
    SELECT *
    FROM services
    WHERE parent_id IS NULL
      AND status = 1
    ORDER BY sort_order ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch services",
      });
    }

    res.json(results);
  });
});

// ============================================
// GET CHILD SERVICES
// ============================================

router.get("/:parentId/children", (req, res) => {
  const parentId = Number(req.params.parentId);

  const sql = `
    SELECT *
    FROM services
    WHERE parent_id = ?
      AND status = 1
    ORDER BY sort_order ASC
  `;

  db.query(sql, [parentId], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch child services",
      });
    }

    res.json(results);
  });
});

// ============================================
// ADD SERVICE
// ============================================

router.post("/", (req, res) => {
  const { name, parent_id, icon, badge, sort_order, status } = req.body;

  // -------------------------------
  // Basic validation
  // -------------------------------

  if (!name || !name.trim()) {
    return res.status(400).json({
      message: "Service name is required",
    });
  }

  // -------------------------------
  // Parent ID
  // Parent হলে NULL
  // Child হলে parent ID
  // -------------------------------

  const parentId =
    parent_id === null || parent_id === "" || parent_id === undefined
      ? null
      : Number(parent_id);

  // -------------------------------
  // Sort Order
  // -------------------------------

  const sortOrder =
    sort_order === "" || sort_order === undefined ? 0 : Number(sort_order);

  // -------------------------------
  // Status
  // -------------------------------

  const serviceStatus = status === undefined ? 1 : Number(status);

  // -------------------------------
  // Insert
  // -------------------------------

  const sql = `
    INSERT INTO services
    (
      name,
      icon,
      parent_id,
      badge,
      sort_order,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name.trim(),
      icon || null,
      parentId,
      badge || null,
      sortOrder,
      serviceStatus,
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to add service",
        });
      }

      res.status(201).json({
        message: "Service added successfully",
        service: {
          id: result.insertId,
          name: name.trim(),
          icon: icon || null,
          parent_id: parentId,
          badge: badge || null,
          sort_order: sortOrder,
          status: serviceStatus,
        },
      });
    },
  );
});
// ============================================
// UPDATE SERVICE
// ============================================

router.put("/:id", (req, res) => {
  const { id } = req.params;

  const { name, parent_id, icon, badge, sort_order, status } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      message: "Service name is required",
    });
  }

  const parentId =
    parent_id === null || parent_id === "" || parent_id === undefined
      ? null
      : Number(parent_id);

  const sortOrder =
    sort_order === "" || sort_order === undefined ? 0 : Number(sort_order);

  const serviceStatus = status === undefined ? 1 : Number(status);

  const sql = `
    UPDATE services
    SET
      name = ?,
      icon = ?,
      parent_id = ?,
      badge = ?,
      sort_order = ?,
      status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name.trim(),
      icon || null,
      parentId,
      badge || null,
      sortOrder,
      serviceStatus,
      Number(id),
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to update service",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Service not found",
        });
      }

      res.json({
        message: "Service updated successfully",
      });
    },
  );
});


// ============================================
// DELETE SERVICE
// ============================================

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM services
    WHERE id = ?
  `;

  db.query(sql, [Number(id)], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete service",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.json({
      message: "Service deleted successfully",
    });
  });
});

module.exports = router;

const express = require("express");
const db = require("../db");

const serviceUpload = require("../middleware/serviceUpload");

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

// ============================================
// ADD SERVICE
// ============================================

router.post("/", serviceUpload.single("icon"), (req, res) => {
  const { name, parent_id, badge, sort_order, status, url } = req.body;

  // -----------------------------------------
  // Service name validation
  // -----------------------------------------

  if (!name || !name.trim()) {
    return res.status(400).json({
      message: "Service name is required",
    });
  }

  // -----------------------------------------
  // Parent ID
  // -----------------------------------------

  const parentId =
    parent_id === null || parent_id === "" || parent_id === undefined
      ? null
      : Number(parent_id);

  // -----------------------------------------
  // Sort Order
  // -----------------------------------------

  const sortOrder =
    sort_order === "" || sort_order === undefined ? 0 : Number(sort_order);

  // -----------------------------------------
  // Status
  // -----------------------------------------

  const serviceStatus = status === undefined ? 1 : Number(status);

  // -----------------------------------------
  // Icon path
  // -----------------------------------------

  const iconPath = req.file ? `/uploads/services/${req.file.filename}` : null;

  // -----------------------------------------
  // Insert into database
  // -----------------------------------------

  const sql = `
      INSERT INTO services
      (
        name,
        icon,
        parent_id,
        badge,
        sort_order,
        status,
         url
      )
      VALUES (?, ?, ?, ?, ?, ?,?)
    `;

  db.query(
    sql,
    [
      name.trim(),
      iconPath,
      parentId,
      badge || null,
      sortOrder,
      serviceStatus,
      url || null,
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
          icon: iconPath,
          parent_id: parentId,
          badge: badge || null,
          sort_order: sortOrder,
          status: serviceStatus,
          url: url || null,
        },
      });
    },
  );
});

// ============================================
// UPDATE SERVICE
// ============================================

router.put("/:id", serviceUpload.single("icon"), (req, res) => {
  const { id } = req.params;

  const { name, parent_id, badge, url, sort_order, status } = req.body;

  // -----------------------------------------
  // Validate name
  // -----------------------------------------

  if (!name || !name.trim()) {
    return res.status(400).json({
      message: "Service name is required",
    });
  }

  // -----------------------------------------
  // Parent ID
  // -----------------------------------------

  const parentId =
    parent_id === null || parent_id === "" || parent_id === undefined
      ? null
      : Number(parent_id);

  // -----------------------------------------
  // Sort Order
  // -----------------------------------------

  const sortOrder =
    sort_order === "" || sort_order === undefined ? 0 : Number(sort_order);

  // -----------------------------------------
  // Status
  // -----------------------------------------

  const serviceStatus = status === undefined ? 1 : Number(status);

  // -----------------------------------------
  // First get old icon
  // -----------------------------------------

  const getOldIconSql = `
      SELECT icon
      FROM services
      WHERE id = ?
    `;

  db.query(getOldIconSql, [Number(id)], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to find service",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // -------------------------------------
    // Keep old icon if no new file selected
    // -------------------------------------

    const oldIcon = results[0].icon;

    const iconPath = req.file
      ? `/uploads/services/${req.file.filename}`
      : oldIcon;

    // -------------------------------------
    // Update service
    // -------------------------------------

    const sql = `
          UPDATE services
          SET
            name = ?,
            icon = ?,
            parent_id = ?,
            
            badge = ?,
              url = ?,
            sort_order = ?,
            status = ?
          WHERE id = ?
        
        `;

    db.query(
      sql,
      [
        name.trim(),
        iconPath,
        parentId,
        badge || null,
         url || null,
        sortOrder,
        serviceStatus,
        Number(id)
       
      ],
      (err, result) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Failed to update service",
          });
        }

        res.json({
          message: "Service updated successfully",

          service: {
            id: Number(id),
            name: name.trim(),
            icon: iconPath,
            parent_id: parentId,
            badge: badge || null,
            sort_order: sortOrder,
            status: serviceStatus,
            url: url || null,
          },
        });
      },
    );
  });
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

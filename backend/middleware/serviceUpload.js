const multer = require("multer");
const path = require("path");

// ============================================
// ICON UPLOAD CONFIGURATION
// ============================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(
        __dirname,
        "../uploads/services"
      )
    );
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const name = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const uniqueName =
      `${name}-${Date.now()}${ext}`;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/x-icon",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, PNG, WEBP, SVG and ICO files are allowed."
        )
      );
    }
  },
});

module.exports = upload;
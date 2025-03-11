const express = require("express");
const multer = require("multer");
const { uploadFile, getAllDocs } = require("../controllers/docsController");

const router = express.Router();
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    // Accept common code file extensions
    const allowedExtensions = [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".py",
      ".java",
      ".html",
      ".css",
    ];
    const fileExt = "." + file.originalname.split(".").pop().toLowerCase();

    if (allowedExtensions.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only code files are allowed."));
    }
  },
});

router.post("/upload", upload.single("file"), uploadFile);
router.get("/docs", getAllDocs);

module.exports = router;

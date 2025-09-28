const express = require("express");
const multer = require("multer");
const { uploadFile, getAllDocs } = require("../controllers/docsController");
const { Model } = require("mongoose");
const model = require("../models/docsModel");

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

router.get("/docs/:id", (req, res) => {
  model
    .findById(req.params.id)
    .then((doc) => {
      if (!doc) return res.status(404).json({ error: "Not found" });
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
});

router.delete("/delete/docs/:id", (req, res) => {
  model.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: "Documentation not found" });
      }
      res.status(200).json({ message: "Documentation deleted successfully" });
    })
    .catch((err) => {
      console.error("Delete error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

router.get("/docs/user/:userId", (req, res) => {
  model.find({ userId: req.params.userId })
    .then((docs) => res.json(docs))
    .catch((err) => res.status(500).json({ error: "Internal Server Error" }));
});

module.exports = router;

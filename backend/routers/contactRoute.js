const express = require("express");
const Model = require("../models/contactModel");
const router = express.Router();

router.post("/add", (req, res) => {
  new Model(req.body)
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
}

);


router.get("/getall", (req, res) => {
    Model.find()
        .then((result) => {
        res.status(200).json(result);
        })
        .catch((err) => {
        res.status(500).json({ error: "Internal Server Error" });
        });
    }
);


module.exports = router;
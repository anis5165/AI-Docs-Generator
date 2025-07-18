const express = require("express");
const Model = require("../models/userModel");
const { model } = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  new Model(req.body)
    .save()

    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(500).json({ error: "Internal Server Error" });
    });
});

router.get("/getall", (req, res) => {
  Model.find()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
});


router.post("/login", (req, res) => {
    Model.findOne(req.body)
    .then((result) => {
        if(result){
            const {_id, name, email} = result;
            const payload = { _id, name, email };
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: "1h" },
                (err, token)=>{
                    if(err){
                        res.status(500).json({ error: "Internal Server Error" });
                    }
                    else{
                        res.status(200).json({ user: payload, token });
                    }
                }
            )
        }
        else{
            res.status(400).json({ error: "Invalid Credentials" });
        }
    }).catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    });
})

module.exports = router;

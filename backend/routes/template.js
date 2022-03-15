const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");

router.get("/:view", (req, res) => {
  const { view } = req.params;
  const filepath = path.join(__dirname, "..", "/static", `/${view}.html`);
  fs.readFile(filepath, "utf-8", (err, data) => {
    res.status(200).json({ data: data });
  });
});

module.exports = router;

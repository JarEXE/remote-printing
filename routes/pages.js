const express = require("express");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  // if (req.user) {
  //   res.render("index", {
  //     user: req.user,
  //     username:
  //       req.user.username.charAt(0).toUpperCase() + req.user.username.slice(1),
  //   });
  // } else {
  //   res.redirect("/login");
  // }
  res.render("home", { layout: false });
});

router.post("/fileUpload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400);
  }

  let uploadedFile = req.files.file;

  // Use the mv() method to place the file somewhere on server
  uploadedFile.mv(
    path.join(__dirname, "../uploads", uploadedFile.name),
    (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      return res.status(200).json(uploadedFile.name);
    }
  );
});

router.post("/print", (req, res) => {
  const { format, orientation, color, fileName } = req.body;
  const filePath = path.join(__dirname, "../uploads", fileName);

  exec(
    `lp -d C3850 -o media=${format} -o orientation-requested=${orientation} -o KMSelectColor=${color} "${filePath}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json("Print failed!");
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).json("Print failed!");
      }

      // Delete the file after successful execution
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err.message}`);
          res.status(500).send(`Error deleting file: ${err.message}`);
          return;
        }
      });

      res.status(200).json("Print successful!");
    }
  );
});

module.exports = router;

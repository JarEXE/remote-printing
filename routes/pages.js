const express = require("express");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});

const router = express.Router();
const printerName = process.env.PRINTER_NAME;

router.get(["/", "/remoteprint/"], (req, res) => {
  res.render("home", { layout: false });
});

router.post("/fileUpload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400);
  }

  let uploadedFile = req.files.file[0];

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
  const { format, orientation, color, fileName, duplex, copies } = req.body;
  const filePath = path.join(__dirname, "../uploads", fileName);

  exec(
    `lp -d ${printerName} -o media=${format} -o orientation-requested=${orientation} -o KMSelectColor=${color} -o KMDuplex=${duplex} -n ${copies} "${filePath}"`,
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
          res.status(500).json(`Error deleting file: ${err.message}`);
          return;
        }
      });

      res.status(200).json("Printing successful!");
    }
  );
});

module.exports = router;

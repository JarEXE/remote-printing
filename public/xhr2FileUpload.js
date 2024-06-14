// const uploadForm = document.getElementById("uploadForm");

// addEventListener("DOMContentLoaded", () => {
//   const fileInput = document.getElementById("file");
//   const progressBar = document.querySelector("progress");
//   const log = document.querySelector("output");
//   const fileName = document.getElementById("fileName");

//   fileInput.addEventListener("change", () => {
//     const xhr = new XMLHttpRequest();

//     // When the upload starts, we display the progress bar
//     xhr.upload.addEventListener("loadstart", (event) => {
//       progressBar.classList.add("visible");
//       progressBar.value = 0;
//       progressBar.max = event.total;
//       log.textContent = "Uploading (0%)…";
//     });

//     // Each time a progress event is received, we update the bar
//     xhr.upload.addEventListener("progress", (event) => {
//       progressBar.value = event.loaded;
//       log.textContent = `Uploading (${(
//         (event.loaded / event.total) *
//         100
//       ).toFixed(2)}%)…`;
//     });

//     // When the upload is finished, we hide the progress bar.
//     xhr.upload.addEventListener("loadend", (event) => {
//       progressBar.classList.remove("visible");
//       if (event.loaded !== 0) {
//         fileName.value = fileInput.files[0].name;
//         log.textContent = "Upload finished.";
//       }
//     });

//     // In case of an error, an abort, or a timeout, we hide the progress bar
//     // Note that these events can be listened to on the xhr object too
//     function errorAction(event) {
//       progressBar.classList.remove("visible");
//       log.textContent = `Upload failed: ${event.type}`;
//     }
//     xhr.upload.addEventListener("error", errorAction);
//     xhr.upload.addEventListener("timeout", errorAction);

//     // Build the payload
//     const fileData = new FormData();
//     fileData.append("file", fileInput.files[0]);

//     // Theoretically, event listeners could be set after the open() call
//     // but browsers are buggy here
//     xhr.open("POST", "/fileUpload", true);

//     // Note that the event listener must be set before sending (as it is a preflighted request)
//     xhr.send(fileData);
//   });
// });

const form = document.getElementById("uploadForm");
const fileInput = document.querySelector(".file-input");
const progressArea = document.querySelector(".progress-area");
const uploadedArea = document.querySelector(".uploaded-area");
const fileNameInput = document.getElementById("fileName");
let unmodifiedFileName;
let fileName;

form.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = ({ target }) => {
  let file = target.files[0];
  if (file) {
    unmodifiedFileName = file.name;
    fileName = file.name;
    if (fileName.length >= 12) {
      let splitName = fileName.split(".");
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    uploadFile(fileName);
  }
};

function uploadFile(name) {
  let xhr = new XMLHttpRequest();

  xhr.upload.addEventListener("progress", ({ loaded, total }) => {
    let fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    let fileSize;
    fileTotal < 1024
      ? (fileSize = fileTotal + " KB")
      : (fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB");
    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;
    if (loaded == total) {
      fileNameInput.value = unmodifiedFileName;
      progressArea.innerHTML = "";
      let uploadedHTML = `<li class="row">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${name} • Uploaded <i class="fas fa-check"></i></span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                          </li>`;
      uploadedArea.classList.remove("onprogress");
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
    }
  });
  let data = new FormData(form);
  xhr.open("POST", "/fileUpload", true);
  xhr.send(data);
}

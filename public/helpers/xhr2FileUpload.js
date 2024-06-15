const form = document.getElementById("uploadForm");
const fileInput = document.querySelector(".file-input");
const progressArea = document.querySelector(".progress-area");
const uploadedArea = document.querySelector(".uploaded-area");
const fileNameInput = document.getElementById("fileName");
const wrapper = document.getElementById("wrapper");

let unmodifiedFileName;
let fileName;

form.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = ({ target }) => {
  let file = target.files[0];
  if (file) {
    handleFile(file);
  }
};

wrapper.addEventListener("dragover", (event) => {
  event.preventDefault();
  wrapper.classList.add("on-drag-over");
});

wrapper.addEventListener("dragleave", () => {
  wrapper.classList.remove("on-drag-over");
});

wrapper.addEventListener("drop", (event) => {
  event.preventDefault();
  wrapper.classList.remove("on-drag-over");

  let file = event.dataTransfer.files[0];
  if (file) {
    handleFile(file);
  }
});

function handleFile(file) {
  unmodifiedFileName = file.name;
  fileName = file.name;
  if (fileName.length >= 12) {
    let splitName = fileName.split(".");
    fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
  }
  uploadFile(file, fileName);
}

function uploadFile(file, name) {
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
    if (loaded === total) {
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
  data.append("file", file);
  xhr.open("POST", "/fileUpload", true);
  xhr.send(data);
}

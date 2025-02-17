const fileGroups = [
  ["png", "jpg", "webp"],
  ["mp3", "mp4", "mov"]
];

const mimeTypes = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  mp4: "video/mp4",
  mov: "video/quicktime"
};

const dropArea = document.getElementById("inputArea");
const fileInput = document.getElementById("fileInput");
const outputArea = document.getElementById("outputArea");

["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, (e) => e.preventDefault(), false);
});

dropArea.addEventListener("drop", (event) => {
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    fileInput.files = files;
    proceedOnUpload();
  }
});

function getFileExtension(fileName) {
  return fileName.split('.').pop().toLowerCase();
}

function changeFileExtension(filename, newExt) {
  return filename.substring(0, filename.lastIndexOf('.')) + '.' + newExt;
}

function convertAndDownload(targetExtension) {
  const file = fileInput.files[0];
  if (!file) return;
  const newFileName = changeFileExtension(file.name, targetExtension);
  const reader = new FileReader();
  reader.onload = function(e) {

    const arrayBuffer = e.target.result;
    const mimeType = mimeTypes[targetExtension] || file.type;
    const blob = new Blob([arrayBuffer], { type: mimeType });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = newFileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  reader.readAsArrayBuffer(file);
}

function proceedOnUpload() {
  const chooseButton = document.getElementById("chooseButton");
  const optionsContainer = document.getElementById("options");

  if (fileInput.files.length === 0) {
    chooseButton.textContent = 'Choose file';
    optionsContainer.innerHTML = ``;
    outputArea.style.display = 'none';
  } else {
    outputArea.style.display = 'block';
    const fileName = fileInput.files[0].name;
    const extension = getFileExtension(fileName);
    chooseButton.textContent = fileName;
    optionsContainer.innerHTML = ""; 

    const fileGroup = fileGroups.find(group => group.includes(extension));
    if (!fileGroup) {
      optionsContainer.innerHTML = `<p>Unsupported file type</p>`;
      return;
    }

    fileGroup.forEach(format => {
      if (format !== extension) {
        const btn = document.createElement("button");
        btn.classList.add("option");
        btn.textContent = format;
        btn.addEventListener("click", () => {
          convertAndDownload(format);
        });
        optionsContainer.appendChild(btn);
      }
    });
  }
}
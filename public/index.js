const $ = document.querySelector.bind(document);

const dropZone = $(".drop-zone");
const uploadFile = $(".upload-file");
const progress_bar = $(".upload-progress-bar");
const progress = $(".upload-progress");
const show_more_input = $(".show-link-input");
const show_more = $(".show-link");
const submitFormContainer = $(".form-style-4");
const send_Form = $(".send-form");
const toast = $(".toast");

dropZone.addEventListener("dragover", (e) => {
  if (!dropZone.classList.contains("dragged"))
    dropZone.classList.add("dragged");
  e.preventDefault();
});

dropZone.addEventListener("dragleave", (e) => {
  dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragged");
  const files = e.dataTransfer.files;
  if (files.length) upload(files[0]);
});

uploadFile.addEventListener("change", (e) => {
  if (uploadFile.files.length > 0) upload(uploadFile.files[0]);
});

submitFormContainer.addEventListener("submit", (e) => {
  e.preventDefault();
  const toEmail = submitFormContainer.elements["to-email"].value;
  const fromEmail = submitFormContainer.elements["from-email"].value;
  const url = show_more_input.value;
  const data = {
    uuid: url.split("/").splice(-1, 1).shift(),
    emailTo: toEmail,
    emailFrom: fromEmail,
  };
  fetch("/api/files/send", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    // Converting to JSON
    .then((response) => response.json())

    // Displaying results to console
    .then((json) => {
      showToast("Email Sent");
    });
});

function openFileInput() {
  uploadFile.click();
}

const upload = async (file) => {
  resetProgressBar();
  var data = new FormData();
  data.append("myfile", file);

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      setTimeout(() => {
        progress.style.display = "none";
        showLink(JSON.parse(xhr.response));
      }, 500);
    }
  };
  progress.style.display = "block";
  xhr.upload.onprogress = onProgress;
  xhr.upload.error = () => {
    showToast(`Error in Upload:${xhr.status}`);
  };
  xhr.open("POST", "/api/files");
  xhr.send(data);
};

const onProgress = (e) => {
  const percent = Math.round((e.loaded / e.total) * 100);
  $(".upload-body").innerHTML = `${percent}%`;
  progress_bar.style.width = `${percent}%`;
};

function resetProgressBar() {
  progress_bar.style.width = "0px";
  show_more.style.display = "none";
  send_Form.style.display = "none";
}

function showLink({ file }) {
  submitFormContainer.reset();
  send_Form.style.display = "block";
  show_more.style.display = "block";
  show_more_input.value = file;
}

function copyLink() {
  show_more_input.select();
  document.execCommand("copy");
  showToast("Copied to Clipboard");
}

function showToast(msg) {
  toast.innerHTML = msg;
  toast.style.transform = "translate(-50%, 0)";
  setTimeout(() => {
    toast.style.transform = "translate(-50%, 100px)";
  }, 2000);
}

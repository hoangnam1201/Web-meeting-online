import Swal from "sweetalert2";
import importFileImage from "../assets/importFile.png";

export const countTime = (title, html, time, callback) => {
  let timerInterval;
  Swal.fire({
    title: title,
    html: html,
    allowOutsideClick: false,
    allowEscapeKey: false,
    timer: time * 1000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector("b");
      b.textContent = time - 1;
      timerInterval = setInterval(() => {
        b.textContent = Math.trunc(Swal.getTimerLeft() / 1000);
      }, 1000);
    },
    willClose: () => {
      clearInterval(timerInterval);
      callback && callback();
    },
  });
};

export const confirmPresent = (callback) => {
  Swal.fire({
    title: "Present",
    text: "Your presentation will start in 8s",
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: "yes, present",
  }).then((result) => {
    if (result.isConfirmed) {
      callback && callback();
    }
  });
};

export const textSwal = (text, callback) => {
  Swal.fire({
    title: text,
    allowOutsideClick: false,
    allowEscapeKey: false,
  }).then((result) => {
    callback && callback();
  });
};

export const confirmSwal = (title, text = "", callback) => {
  Swal.fire({
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonText: "yes",
  }).then((result) => {
    if (result.isConfirmed) callback && callback();
  });
};

export const kickComfirmSwal = (callback) => {
  Swal.fire({
    title: "Are you sure to kick this user out?",
    input: "checkbox",
    inputValue: 1,
    inputPlaceholder: "remove this user from member list",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  }).then(({ value, isConfirmed }) => {
    if (isConfirmed) callback(value);
  });
};

export const SendBuzzSwal = (callback) => {
  Swal.fire({
    title: "Enter buzz text to user",
    input: "text",
    inputLabel: "Buzz text",
    inputValue: "",
    inputPlaceholder: "Concentrate on presentation!!",
    showCancelButton: true,
    confirmButtonText: "Send",
    cancelButtonText: "Cancel",
  }).then(({ value, isConfirmed }) => {
    if (isConfirmed) callback(value);
  });
};

export const buzzSwal = (text) => {
  Swal.fire({
    title: "Owner room buzz to you",
    text: text,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
};

export const AboutFormatSwal = () => {
  Swal.fire({
    title: "Format files",
    text: "The file could have multiple sheets and require an 'Email' or 'email' column",
    imageUrl: importFileImage,
  });
};

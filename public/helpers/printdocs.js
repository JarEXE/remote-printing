const printForm = document.getElementById("printForm");
const printButton = document.getElementById("print-button");

const submitPrint = () => {
  let data = new FormData(printForm);

  axios
    .post("/print", data)
    .then((response) => {
      Swal.fire({
        title: "Success!",
        text: "Printing Successful!",
        icon: "success",
        showConfirmButton: true,
        confirmButtonText: "Great!",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        stopKeyDownPropagation: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
        showConfirmButton: true,
        confirmButtonText: "Close",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        stopKeyDownPropagation: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    });
};

printButton.addEventListener("click", () => {
  submitPrint();
});

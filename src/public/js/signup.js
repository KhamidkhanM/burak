// Client-side script for the admin signup page (signup.ejs): image preview + form validation.
console.log("Signup frontend javascript file"); // debug log, confirms the script loaded


$(function () { // runs once the page's DOM is ready
  const fileTarget = $(".file-box .upload-hidden"); // the hidden <input type="file"> for the restaurant image
  let filename; // will hold the picked file's name

  // when the user picks an image file, validate its type and show a live preview
  fileTarget.on("change", function () { // fires when the file input's value changes (user picked a file)
    if (window.FileReader) { // only run if the browser supports FileReader
      const uploadFile = $(this)[0].files[0]; // the actual File object picked by the user
      const fileType = uploadFile["type"]; // its MIME type, e.g. "image/png"
      const validImageType = ["image/jpg", "image/jpeg", "image/png"]; // allowed types
      if (!validImageType.includes(fileType)) { // reject anything not in the allowed list
        alert("Please insert only jpeg, jpg and png!"); // tell the user why it was rejected
      } else {
        if (uploadFile) { // double-check a file was actually selected
          console.log(URL.createObjectURL(uploadFile)); // debug log of the generated preview URL
          // createObjectURL makes a temporary local preview link, no upload happens yet
          $(".upload-img-frame")
            .attr("src", URL.createObjectURL(uploadFile)) // point the <img> at the local preview
            .addClass("success"); // add a CSS class to show success styling
        }
        filename = $(this)[0].files[0].name; // remember the chosen file's name
      }

      $(this).siblings(".upload-name") // selects the sibling element meant to show the filename (currently unused result)
    }
  });
});

// runs before the signup form submits; checks all required fields are filled correctly
function validateSignupForm() {
  const memberNick = $(".member-nick").val(); // nickname input value
  const memberPhone = $(".member-phone").val(); // phone input value
  const memberPassword = $(".member-password").val(); // password input value
  const confirmPassword = $(".confirm-password").val(); // confirm-password input value

  if (
    memberNick === "" || // nickname missing
    memberPhone === "" || // phone missing
    memberPassword === "" || // password missing
    confirmPassword === "" // confirm-password missing
  ) {
    alert("Please insert all required inputs!"); // tell the user to fill everything in
    return false; // block form submission
  }

  if (memberPassword !== confirmPassword) { // the two password fields must match
    alert("Password differs, please check!"); // tell the user they don't match
    return false; // block form submission
  }

  const memberImage = $(".member-image").get(0).files[0].name // grab the chosen image's filename
    ? $(".member-image").get(0).files[0].name // if it exists, use it
    : null; // otherwise null
  if (!memberImage) { // an image is required
    alert("Please insert restaurant image!"); // tell the user an image is required
    return false; // block form submission
  }
}

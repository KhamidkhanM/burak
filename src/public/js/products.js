// Client-side script for the admin products page (products.ejs): form UI + AJAX status updates.
console.log("Products frontend javascript file"); // debug log, confirms the script loaded

$(function () { // runs once the page's DOM is ready
  // shows the right volume/size field depending on whether the product is a DRINK or not
  $(".product-collection").on("change", () => { // fires when the category dropdown changes
    const selectedValue = $(".product-collection").val(); // currently selected category
    if (selectedValue === "DRINK") { // drinks use volume instead of size
      $("#product-collection").hide(); // hide the size field
      $("#product-volume").show(); // show the volume field
    } else {
      $("#product-volume").hide(); // hide the volume field
      $("#product-collection").show(); // show the size field
    }
  });

  // "New Product" button slides the create-product form open
  $("#process-btn").on("click", () => { // fires when the "New Product" button is clicked
    $(".dish-container").slideToggle(500); // animate the form open/closed over 500ms
    $("#process-btn").css("display", "none"); // hide the "New Product" button while form is open
  });

  // "Cancel" button slides the form closed again
  $("#cancel-btn").on("click", () => { // fires when the "Cancel" button is clicked
    $(".dish-container").slideToggle(100); // animate the form closed quickly
    $("#process-btn").css("display", "flex"); // show the "New Product" button again
  });

  // when a product's status dropdown changes, send the update straight to the server (no page reload)
  $(".new-product-status").on("change", async function (e) { // fires when a product's status dropdown changes
    const id = e.target.id; // the dropdown's id was set to the product's _id in the EJS loop
    const productStatus = $(`#${id}.new-product-status`).val(); // the newly selected status value
    console.log("id:", id); // debug log
    console.log("productStatus:", productStatus); // debug log

    try {
      const response = await axios.post(`/admin/product/${id}`, {productStatus: productStatus}); // send the update to the server
      console.log("response:", response) // debug log of the raw response
      const result = response.data; // the JSON body returned by the server
      if (result.data) { // server confirmed the update succeeded
        console.log("Product updated!") // debug log
        $(".new-product-status").blur(); // remove focus from the dropdown
      }
    } catch (err) { // request failed (network error or server threw)
      console.log(err); // log the error
      alert("Product update failed!"); // tell the user it failed
    }
  });
});

// runs before the create-product form submits; checks all required fields are filled
function validateForm() {
  const productName = $(".product-name").val(); // name input value
  const productPrice = $(".product-price").val(); // price input value
  const productLeftCount = $(".product-left-count").val(); // stock count input value
  const productCollection = $(".product-collection").val(); // category dropdown value
  const productDesc = $(".product-desc").val(); // description input value
  const productStatus = $(".product-status").val(); // status dropdown value

  if (
    productName === "" || // name missing
    productPrice === "" || // price missing
    productLeftCount === "" || // stock count missing
    productCollection === "" || // category missing
    productDesc === "" || // description missing
    productStatus === "" // status missing
  ) {
    alert("Please insert all details!"); // tell the user to fill everything in
    return false; // block form submission
  } else return true; // all good, allow submission
}

// shows a live preview of a chosen product image in the matching upload slot (1 to 5)
function previewFileHandler(input, order) { // input = the file <input> element, order = which slot (1-5)
  const imgClassName = input.className; // the CSS class identifying this specific file input
  console.log("input:", input); // debug log

  const file = $(`.${imgClassName}`).get(0).files[0]; // the actual File object picked by the user
  const fileType = file["type"]; // its MIME type
  const validImageType = ["image/jpg", "image/jpeg", "image/png"]; // allowed types

  if (!validImageType.includes(fileType)) { // reject anything not in the allowed list
    alert("Please insert only jpeg, jpg and png!"); // tell the user why it was rejected
  } else {
    if (file) { // double-check a file was actually selected
      const reader = new FileReader(); // used to read the file's contents as a data URL
      reader.onload = function () { // fires once the file has been fully read
        $(`#image-section-${order}`).attr("src", reader.result); // show the preview in the matching slot
      };
      reader.readAsDataURL(file); // start reading the file (triggers onload above)
    }
  }
}

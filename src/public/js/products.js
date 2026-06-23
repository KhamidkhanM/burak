// Client-side script for the admin products page (products.ejs): form UI + AJAX status updates.
console.log("Products frontend javascript file");

$(function () {
  // shows the right volume/size field depending on whether the product is a DRINK or not
  $(".product-collection").on("change", () => {
    const selectedValue = $(".product-collection").val();
    if (selectedValue === "DRINK") {
      $("#product-collection").hide();
      $("#product-volume").show();
    } else {
      $("#product-volume").hide();
      $("#product-collection").show();
    }
  });

  // "New Product" button slides the create-product form open
  $("#process-btn").on("click", () => {
    $(".dish-container").slideToggle(500);
    $("#process-btn").css("display", "none");
  });

  // "Cancel" button slides the form closed again
  $("#cancel-btn").on("click", () => {
    $(".dish-container").slideToggle(100);
    $("#process-btn").css("display", "flex");
  });

  // when a product's status dropdown changes, send the update straight to the server (no page reload)
  $(".new-product-status").on("change", async function (e) {
    const id = e.target.id; // the dropdown's id was set to the product's _id in the EJS loop
    const productStatus = $(`#${id}.new-product-status`).val();
    console.log("id:", id);
    console.log("productStatus:", productStatus);

    try {
      const response = await axios.post(`/admin/product/${id}`, {productStatus: productStatus});
      console.log("response:", response)
      const result = response.data;
      if (result.data) {
        console.log("Product updated!")
        $(".new-product-status").blur();
      }
    } catch (err) {
      console.log(err);
      alert("Product update failed!");
    }
  });
});

// runs before the create-product form submits; checks all required fields are filled
function validateForm() {
  const productName = $(".product-name").val();
  const productPrice = $(".product-price").val();
  const productLeftCount = $(".product-left-count").val();
  const productCollection = $(".product-collection").val();
  const productDesc = $(".product-desc").val();
  const productStatus = $(".product-status").val();

  if (
    productName === "" ||
    productPrice === "" ||
    productLeftCount === "" ||
    productCollection === "" ||
    productDesc === "" ||
    productStatus === ""
  ) {
    alert("Please insert all details!");
    return false;
  } else return true;
}

// shows a live preview of a chosen product image in the matching upload slot (1 to 5)
function previewFileHandler(input, order) {
  const imgClassName = input.className;
  console.log("input:", input);

  const file = $(`.${imgClassName}`).get(0).files[0];
  const fileType = file["type"];
  const validImageType = ["image/jpg", "image/jpeg", "image/png"];

  if (!validImageType.includes(fileType)) {
    alert("Please insert only jpeg, jpg and png!");
  } else {
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        $(`#image-section-${order}`).attr("src", reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
}
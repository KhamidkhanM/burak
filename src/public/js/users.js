// Client-side script for the admin users page (users.ejs).
// Currently a placeholder — no logic added yet (the status dropdown isn't wired up to call
// POST /admin/user/edit, unlike products.js's similar dropdown for products).
console.log("Users frontend javascript file");

$(function () {
  $(".member-status").on("change", function (e) {
    const id = e.target.id;
    console.log("id:", id);

    const memberStatus = $(`#${id}.member-status`).val();
    console.log("memberStatus:", memberStatus);

    axios
      .post("/admin/user/edit", {
        _id: id,
        memberStatus: memberStatus,
      })
      .then((response) => {
        console.log("response:", response);
        const result = response.data;
        console.log("result:", result);

        if (result.data) {
          console.log("User updated!");
          $(".member-status").blur();
        } else alert("User update failed!");
      })
      .catch((err) => {
        console.log(err);
        alert("User update failed!");
      });
  });
});
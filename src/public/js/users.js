// Client-side script for the admin users page (users.ejs): status dropdown sends updates via AJAX.
console.log("Users frontend javascript file"); // debug log, confirms the script loaded

$(function () { // runs once the page's DOM is ready
  $(".member-status").on("change", function (e) { // fires when a user's status dropdown changes
    const id = e.target.id; // the dropdown's id was set to the member's _id in the EJS loop
    console.log("id:", id); // debug log

    const memberStatus = $(`#${id}.member-status`).val(); // the newly selected status value
    console.log("memberStatus:", memberStatus); // debug log

    axios
      .post("/admin/user/edit", { // send the update to the server
        _id: id, // which member to update
        memberStatus: memberStatus, // new status value (e.g. BLOCK)
      })
      .then((response) => { // request succeeded
        console.log("response:", response); // debug log of the raw response
        const result = response.data; // the JSON body returned by the server
        console.log("result:", result); // debug log

        if (result.data) { // server confirmed the update succeeded
          console.log("User updated!"); // debug log
          $(".member-status").blur(); // remove focus from the dropdown
        } else alert("User update failed!"); // server returned no data, treat as failure
      })
      .catch((err) => { // request failed (network error or server threw)
        console.log(err); // log the error
        alert("User update failed!"); // tell the user it failed
      });
  });
});

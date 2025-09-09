$(document).ready(function () {
      const validationRules = {
        firstName: {
          required: [true, "First name is required"],
          pattern: [/^[A-Za-z]+$/, "First name should contain only alphabets"],
          minLength: [3, "First name should be at least 3 characters long"],
        },
        lastName: {
          required: [true, "Last name is required"],
          pattern: [/^[A-Za-z]+$/, "Last name should contain only alphabets"],
          minLength: [3, "Last name should be at least 3 characters long"],
        },
        mobile: {
          required: [true, "Mobile number is required"],
          pattern: [/^[6-9]\d{9}$/, "Mobile number is not valid"],
        },
        email: {
          required: [true, "Email is required"],
          pattern: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Email is not valid",
          ],
        },
        street: {
          required: [true, "Street is required"],
        },
        city: {
          required: [true, "City is required"],
        },
        state: {
          required: [true, "State is required"],
        },
        country: {
          required: [true, "Country is required"],
        },
        loginId: {
          required: [true, "Login ID is required"],
          pattern: [/^[a-zA-Z0-9]{8}$/, "Login ID is not valid"],
        },
        password: {
          required: [true, "Password is required"],
          pattern: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
            "Password is not valid",
          ],
          minLength: [6, "Password should be at least 6 characters long"],
        },
      };

      $("input").on("blur", function () {
        validateField($(this));
      });

      function validateField($input) {
        const fieldName = $input.attr("id");
        const value = $input.val().trim();
        const rules = validationRules[fieldName];
        const $errorElement = $("#" + fieldName + "Error");
        $errorElement.text("");
        if (!rules) return true; // No validation rules defined
        let isvalid = true;
        if (rules.required && rules.required[0] && value === "") {
          $errorElement.text(rules.required[1]);
          isvalid = false;
          return false;
        }
        if (value === "") return isvalid; // Skip further validation if value is empty
        if (rules.minLength && value.length < rules.minLength[0]) {
          $errorElement.text(rules.minLength[1]);
          isvalid = false;
        }
        if (rules.pattern && !rules.pattern[0].test(value)) {
          $errorElement.text(rules.pattern[1]);
          isvalid = false;
        }
        return isvalid;
      }
      $(".view-form").on("click",function (){
        $(".viewusers").hide();
        $(".view-form").hide()
        $(".div-container").show();
      })
      $("#userform").on("submit", function (e) {
        e.preventDefault();
        $("#responseMessage").html("");

        let isformValid = true;
        $("input").each(function () {
          const isFieldValid = validateField($(this));
          if (!isFieldValid) isformValid = false;
        });
        if (!isformValid) {
          $("#responseMessage").html(
            '<p style="color:red;">Please fix the errors in the form</p>'
          ).show();
          return;
        }

        const formData = {
          firstName: $("#firstName").val(),
          lastName: $("#lastName").val(),
          mobile: $("#mobile").val(),
          email: $("#email").val(),
          street: $("#street").val(),
          city: $("#city").val(),
          state: $("#state").val(),
          country: $("#country").val(),
          loginId: $("#loginId").val(),
          password: $("#password").val(),
        };
        $.ajax({
          type: "POST",
          url: "https://node-task-backend-req3.onrender.com/",
          data: JSON.stringify(formData),
          contentType: "application/json",
          success: function (data, textStatus, jqXHR) {
            let msg = "Your account has been created.";
            // if (data && data.message) {
            //   msg = data.message;
            // }
            $("#responseMessage").html(
              '<p style="color:green;">' + msg + "</p>"
            ).show();
            $("#userform")[0].reset();
          },
          error: function (jqXHR, status, error) {
            let msg = "Error creating user. Please try again";
            if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
              msg = jqXHR.responseJSON.message;
            }
            $("#responseMessage").html('<p style="color:red;">' + msg + "</p>");
          },
        });
      });
    });
    $("#viewusersbtn").on("click", function () {
      $.ajax({
        type: "GET",
        url: "https://node-task-backend-req3.onrender.com/viewusers",

        success: function (data) {
          if (data.message) {
            // $(".viewusers").html("<p>" + data.message + "</p>");
           $(".viewusers").html("<p>" + data.message + "</p>").show();
          }
          $("#responseMessage").html("").hide();
          let userhtml = `
    <h2>Registered Users</h2>
    <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse; text-align:left;">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Mobile</th>
          <th>State</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
  `;
          data.forEach((user) => {
            userhtml += `
      <tr>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.mobile}</td>
        <td>${user.state}</td>
        <td>${user.country}</td>
      </tr>
    `;
          });
          userhtml += `
      </tbody>
    </table>
  `;
          $(".div-container").hide();
          $(".view-form").show();
          $(".viewusers").html(userhtml).show();
        },
        error: function () {
          let msg = "Error fetching users. Please try again.";
          $(".viewusers")
            .html("<p style='color:red;'>" + msg + "</p>")
            .show();
        },
      });
    });

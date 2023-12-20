
    // Toggle Signup button
async function ToggleSigninButton () {
    var checkbox = document.getElementById("tosOptin");
    var button = document.getElementById("btnSignUp");

    if (checkbox.checked) {
        button.classList.remove("disabled");
      } else {
        button.classList.add("disabled");
      }
}

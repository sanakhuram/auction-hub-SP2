import { register } from "../../api/auth/register.js";
import { showAlert } from "../../utilities/alert.js";

export async function onRegister(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.querySelector("#name")?.value.trim();
  const email = form.querySelector("#email")?.value.trim();
  const password = form.querySelector("#password")?.value.trim();
  const errorMessage = document.getElementById("errorMessage");
  const registerButton = form.querySelector("#submit");

  if (!registerButton) {
    console.error("Submit button not found in the form.");
    return;
  }

  if (errorMessage) {
    errorMessage.style.display = "none";
    errorMessage.innerText = "";
  }

  registerButton.innerHTML = "Registering...";
  registerButton.disabled = true;

  const emailPattern = /^[\w\-.]+@(stud\.)?noroff\.no$/;
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!name) {
    showAlert("Name is required.", "error");
    resetButton(registerButton);
    return;
  }

  if (!emailPattern.test(email)) {
    showAlert(
      "Invalid email! Use a noroff.no or stud.noroff.no email.",
      "error",
    );
    resetButton(registerButton);
    return;
  }

  if (!passwordPattern.test(password)) {
    showAlert(
      "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.",
      "error",
    );
    resetButton(registerButton);
    return;
  }

  try {
    const data = await register({ name, email, password }); // eslint-disable-line no-unused-vars
    showAlert(
      "Registration successful! Redirecting to the login page...",
      "success",
    );
    setTimeout(() => {
      window.location.href = "/auth/login/";
    }, 2000);
  } catch (error) {
    console.error("Registration error:", error);
    if (errorMessage) {
      errorMessage.innerText = `Registration failed: ${error.message}`;
      errorMessage.style.display = "block";
    }
    showAlert(`Registration failed: ${error.message}`, "error");
  } finally {
    resetButton(registerButton);
  }
}

function resetButton(button) {
  button.innerHTML = "Register";
  button.disabled = false;
}

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector("form[name='register']");
  if (registerForm) {
    registerForm.addEventListener("submit", onRegister);
  }
});

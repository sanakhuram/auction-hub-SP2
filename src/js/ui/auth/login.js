// src/js/ui/auth/login.js

import { login } from "../../api/auth/login";
import { showAlert } from "../../utilities/alert";

/**
 * Handles the login form submission.
 * @param {Event} event - The form submission event.
 */
export async function onLogin(event) {
  event.preventDefault();
  const loginForm = event.target;
  const email = loginForm.querySelector("#email").value;
  const password = loginForm.querySelector("#password").value;

  const errorMessage = document.getElementById("errorMessage");
  if (errorMessage) errorMessage.style.display = "none";

  try {
    await login({ email, password });

    showAlert("Login successful! Redirecting to your profile...", "success");
    setTimeout(() => {
      window.location.href = "/profile/";
    }, 2000);
  } catch (error) {
    if (errorMessage) {
      errorMessage.innerText = `Login failed: ${error.message}`;
      errorMessage.style.display = "block";
    }

    showAlert(`Login failed: ${error.message}`, "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form[name='login']");
  if (loginForm) loginForm.addEventListener("submit", onLogin);
});

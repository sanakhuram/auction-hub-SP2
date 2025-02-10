import { register } from "../../api/auth/register";
import { showAlert } from "../../utilities/alert";

/**
 * Handles the registration form submission.
 *
 * @param {Event} event - The form submission event.
 */
export async function onRegister(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.querySelector("#name").value.trim();
  const email = form.querySelector("#email").value.trim();
  const password = form.querySelector("#password").value.trim();
  const errorMessage = document.getElementById("errorMessage");
  const registerButton = form.querySelector("button[type='submit']");

  if (errorMessage) errorMessage.style.display = "none";

  try {
    const data = await register({ name, email, password });

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
    registerButton.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector("form[name='register']");
  if (registerForm) {
    registerForm.addEventListener("submit", onRegister);
  }
});

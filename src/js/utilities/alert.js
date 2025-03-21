/**
 * Displays an alert message with customizable styles and an optional action button.
 *
 * @param {string} message - The message to display.
 * @param {string} type - The type of alert ('success', 'error', 'warning', 'info').
 * @param {number} duration - How long the alert should be visible (default: 3000ms).
 * @param {string} buttonText - The text for the optional button (optional).
 * @param {function} buttonAction - The function to execute when the button is clicked (optional).
 */
export function showAlert(
  message,
  type = "info",
  duration = 3000,
  buttonText = null,
  buttonAction = null,
) {
  let alertContainer = document.getElementById("alertContainer");

  if (!alertContainer) {
    alertContainer = document.createElement("div");
    alertContainer.id = "alertContainer";
    alertContainer.classList.add(
      "fixed",
      "bottom-2",
      "sm:bottom-4",
      "right-2",
      "sm:right-4",
      "z-50",
      "space-y-2",
      "w-[90%]",
      "sm:w-full",
      "max-w-sm",
    );
    document.body.appendChild(alertContainer);
  }

  const alertDiv = document.createElement("div");
  alertDiv.classList.add(
    "p-2",
    "sm:px-4",
    "sm:py-3",
    "rounded-lg",
    "shadow-md",
    "text-white",
    "flex",
    "items-center",
    "justify-between",
    "gap-2",
    "opacity-0",
    "transition-opacity",
    "duration-300",
    "w-full",
    "text-sm",
    "sm:text-base",
  );

  switch (type) {
    case "success":
      alertDiv.classList.add("bg-olive", "border", "border-olive");
      break;
    case "error":
      alertDiv.classList.add("bg-red-600", "border", "border-dark");
      break;
    case "warning":
      alertDiv.classList.add(
        "bg-sepia",
        "border",
        "border-yellow-700",
        "text-black",
      );
      break;
    default:
      alertDiv.classList.add("bg-accent", "border", "border-muted");
  }

  alertDiv.setAttribute("role", "alert");

  let alertContent = `<span class="font-semibold">${message}</span>`;

  if (buttonText && buttonAction) {
    alertContent += `
      <button id="alertActionButton" class="bg-btn-gradient text-white font-light px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg hover:brightness-110 transition text-sm sm:text-base">
        ${buttonText}
      </button>
    `;
  }

  alertContent += `
    <button class="text-lg sm:text-xl font-bold hover:opacity-75 focus:outline-none">&times;</button>
  `;

  alertDiv.innerHTML = alertContent;
  alertContainer.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.classList.add("opacity-100");
  }, 100);

  const closeButton = alertDiv.querySelector("button:last-child");
  closeButton.addEventListener("click", () => alertDiv.remove());

  if (buttonText && buttonAction) {
    document
      .getElementById("alertActionButton")
      .addEventListener("click", () => {
        alertDiv.remove();
        buttonAction();
      });
  }

  setTimeout(() => {
    alertDiv.classList.remove("opacity-100");
    setTimeout(() => alertDiv.remove(), 300);
  }, duration);
}

/**
 * Displays a confirmation alert with "Yes" and "Cancel" buttons.
 * Returns a Promise that resolves to `true` if confirmed, `false` if canceled.
 *
 * @param {string} message - The confirmation message.
 * @returns {Promise<boolean>} - Resolves `true` if confirmed, `false` if canceled.
 */
export function showConfirmAlert(message) {
  return new Promise((resolve) => {
    let alertContainer = document.getElementById("alertContainer");

    if (!alertContainer) {
      alertContainer = document.createElement("div");
      alertContainer.id = "alertContainer";
      alertContainer.classList.add(
        "fixed",
        "bottom-2",
        "sm:bottom-4",
        "right-2",
        "sm:right-4",
        "z-50",
        "space-y-2",
        "w-[90%]",
        "sm:w-full",
        "max-w-sm",
      );
      document.body.appendChild(alertContainer);
    }

    const confirmDiv = document.createElement("div");
    confirmDiv.classList.add(
      "p-2",
      "sm:px-6",
      "sm:py-4",
      "rounded-lg",
      "shadow-lg",
      "bg-background",
      "border",
      "border-sepia",
      "text-black",
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "gap-2",
      "opacity-0",
      "transition-opacity",
      "duration-300",
      "w-full",
      "text-sm",
      "sm:text-base",
    );

    confirmDiv.setAttribute("role", "dialog");
    confirmDiv.innerHTML = `
      <p class="font-semibold text-sm sm:text-lg">${message}</p>
      <div class="flex gap-2 sm:gap-4">
        <button id="confirmYes" class="bg-secondary text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-olive focus:outline-none text-sm sm:text-base">Yes</button>
        <button id="confirmCancel" class="bg-grayish text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-dark focus:outline-none text-sm sm:text-base">Cancel</button>
      </div>
    `;

    alertContainer.appendChild(confirmDiv);

    setTimeout(() => confirmDiv.classList.add("opacity-100"), 100);

    const confirmYes = confirmDiv.querySelector("#confirmYes");
    const confirmCancel = confirmDiv.querySelector("#confirmCancel");

    const closeModal = (result) => {
      confirmDiv.classList.remove("opacity-100");
      setTimeout(() => confirmDiv.remove(), 300);
      resolve(result);
    };

    confirmYes.addEventListener("click", () => closeModal(true));
    confirmCancel.addEventListener("click", () => closeModal(false));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeModal(false);
      }
    });
  });
}

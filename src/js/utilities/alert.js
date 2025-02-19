/**
 * Displays an alert message with customizable styles.
 *
 * @param {string} message - The message to display.
 * @param {string} type - The type of alert ('success', 'error', 'warning', 'info').
 * @param {number} duration - How long the alert should be visible (default: 3000ms).
 */
export function showAlert(message, type = "info", duration = 3000) {
  let alertContainer = document.getElementById("alertContainer");

  if (!alertContainer) {
    alertContainer = document.createElement("div");
    alertContainer.id = "alertContainer";
    alertContainer.classList.add(
      "fixed",
      "bottom-4",
      "left-1/2",
      "transform",
      "-translate-x-1/2",
      "z-50",
      "space-y-2",
      "w-full",
      "max-w-sm",
    );
    document.body.appendChild(alertContainer);
  }

  const alertDiv = document.createElement("div");
  alertDiv.classList.add(
    "px-4",
    "py-2",
    "rounded-lg",
    "shadow-md",
    "text-white",
    "flex",
    "items-center",
    "justify-between",
    "gap-4",
    "opacity-0",
    "transition-opacity",
    "duration-300",
    "w-full",
  );

  switch (type) {
    case "success":
      alertDiv.classList.add("bg-red-400", "border", "border-olive");
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
  alertDiv.innerHTML = `
    <span class="font-semibold">${message}</span>
    <button class="text-xl font-bold hover:opacity-75 focus:outline-none">&times;</button>
  `;

  const closeButton = alertDiv.querySelector("button");
  closeButton.addEventListener("click", () => alertDiv.remove());

  alertContainer.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.classList.add("opacity-100");
  }, 100);

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
        "bottom-4",
        "left-1/2",
        "transform",
        "-translate-x-1/2",
        "z-50",
        "space-y-2",
        "w-full",
        "max-w-sm",
      );
      document.body.appendChild(alertContainer);
    }

    const confirmDiv = document.createElement("div");
    confirmDiv.classList.add(
      "px-6",
      "py-4",
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
      "gap-4",
      "opacity-0",
      "transition-opacity",
      "duration-300",
      "w-full",
    );

    confirmDiv.setAttribute("role", "dialog");
    confirmDiv.innerHTML = `
      <p class="font-semibold text-lg">${message}</p>
      <div class="flex gap-4">
        <button id="confirmYes" class="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-olive focus:outline-none">Yes</button>
        <button id="confirmCancel" class="bg-grayish text-white px-4 py-2 rounded-lg hover:bg-dark focus:outline-none">Cancel</button>
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

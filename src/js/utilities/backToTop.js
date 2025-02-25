export function setupBackToTop() {
  let backToTopButton = document.getElementById("backToTop");
  if (!backToTopButton) {
    backToTopButton = document.createElement("button");
    backToTopButton.id = "backToTop";
    backToTopButton.className =
      "fixed bottom-5 right-5 p-2 bg-transparent hover:opacity-80 transition-opacity hidden";
    backToTopButton.innerHTML = `
      <img src="/images/back2top.png" 
          alt="Back to Top" 
          class="w-12 h-12 md:w-10 md:h-10 sm:w-8 sm:h-8 animate-spin-slow" />
    `;
    document.body.appendChild(backToTopButton);
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.remove("hidden");
    } else {
      backToTopButton.classList.add("hidden");
    }
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

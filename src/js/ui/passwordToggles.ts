export default function passwordToggles() {
  document.querySelectorAll<HTMLButtonElement>("[data-password-toggle]").forEach((btn) => {
    const input = btn.closest(".text-input__control")?.querySelector<HTMLInputElement>("input");
    if (!input) return;

    btn.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";

      const use = btn.querySelector<SVGUseElement>("use");
      if (use) {
        use.setAttribute("xlink:href", isPassword ? "#eye-open" : "#eye-close");
      }
    });
  });
}

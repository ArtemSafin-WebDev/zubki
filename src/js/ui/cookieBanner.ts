const STORAGE_KEY = "cookies_accepted";

export default function cookieBanner() {
  const banner = document.querySelector<HTMLElement>(".cookie-banner");
  if (!banner) return;

  if (!localStorage.getItem(STORAGE_KEY)) {
    banner.classList.add("is-shown");
  }

  const acceptBtn =
    banner.querySelector<HTMLButtonElement>(".js-cookie-accept");
  acceptBtn?.addEventListener("click", () => {
    banner.classList.remove("is-shown");
    localStorage.setItem(STORAGE_KEY, "1");
  });
}

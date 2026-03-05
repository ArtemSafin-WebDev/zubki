import HomeDashboard from "../classes/components/HomeDashboard";

export default function homeDashboard() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".home__dashboard")
  );

  elements.forEach((element) => {
    if (HomeDashboard.getInstanceFor(element)) return;
    new HomeDashboard(element);
  });
}

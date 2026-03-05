import Dashboard from "../classes/components/Dashboard";

export default function dashboard() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".home__dashboard")
  );

  elements.forEach((element) => {
    if (Dashboard.getInstanceFor(element)) return;
    new Dashboard(element);
  });
}

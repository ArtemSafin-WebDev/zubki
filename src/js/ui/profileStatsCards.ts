import ProfileStatsCard from "../classes/components/ProfileStatsCard";

export default function profileStatsCards() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-profile-stats-card"),
  );

  elements.forEach((element) => {
    if (ProfileStatsCard.getInstanceFor(element)) return;
    new ProfileStatsCard(element);
  });
}

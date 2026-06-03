import EducationAudioCard from "../classes/components/EducationAudioCard";

export default function educationAudioCards() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-education-audio-card")
  );

  elements.forEach((element) => {
    if (EducationAudioCard.getInstanceFor(element)) return;
    new EducationAudioCard(element);
  });
}

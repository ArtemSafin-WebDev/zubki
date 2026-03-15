import QuizOptionsSlider from "../classes/components/QuizOptionsSlider";

export default function quizOptionsSliders() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-quiz-options-slider"),
  );

  elements.forEach((element) => {
    if (QuizOptionsSlider.getInstanceFor(element)) return;
    new QuizOptionsSlider(element);
  });
}

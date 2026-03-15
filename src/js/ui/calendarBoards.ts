import CalendarBoard from "../classes/components/CalendarBoard";

export default function calendarBoards() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-calendar-board")
  );

  elements.forEach((element) => {
    if (CalendarBoard.getInstanceFor(element)) return;
    new CalendarBoard(element);
  });
}

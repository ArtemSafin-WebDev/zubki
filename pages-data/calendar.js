const defaultNote =
  "Пока что мне тяжело чистить зубы каждый день, я забываю это сделать.";

const createEmptyDay = (day) => ({
  day: String(day),
  state: "empty",
  ariaLabel: `Добавить отметку за ${day} число`,
  opensModal: true,
  showHoverIcon: true,
});

const createMarkedDay = (day, type, note = defaultNote) => ({
  day: String(day),
  state: type === "twice" ? "filled-twice" : "filled-once",
  ariaLabel:
    type === "twice"
      ? `За ${day} число зубы почищены 2 раза`
      : `За ${day} число зубы почищены 1 раз`,
  iconSrc:
    type === "twice"
      ? "/images/calendar/star-yellow.svg"
      : "/images/calendar/star-blue.svg",
  popoverTitle: "Об отметке",
  popoverAction:
    type === "twice" ? "Почистил зубки 2 раза" : "Почистил зубки 1 раз",
  popoverNote: note,
});

export default {
  "/calendar.html": {
    title: "Календарь событий",
    calendarPageTitle: "Календарь событий",
    calendarBackHref: "/index.html",
    calendarBackText: "Назад на главную",
    calendarDaysLeft: "3 дня",
    calendarDay: "28",
    calendarTitle: "Чистим зубки каждый день!",
    calendarToothguyText: "Ты молодец!<br>У тебя уже есть<br>прогресс",
    calendarLegend: [
      {
        iconSrc: "/images/calendar/star-yellow.svg",
        label: "Почистил зубки 2 раза",
      },
      {
        iconSrc: "/images/calendar/star-blue.svg",
        label: "Почистил зубки 1 раз",
      },
    ],
    calendarWeeks: [
      [
        createMarkedDay(1, "twice", "Ты отлично начал месяц и ни разу не забыл про вечернюю чистку."),
        createMarkedDay(2, "twice", "Супер результат: утром и вечером зубки были чистыми."),
        createMarkedDay(3, "once", "Сегодня получилось почистить зубы только один раз, но это тоже шаг вперед."),
        createEmptyDay(4),
        createEmptyDay(5),
        createEmptyDay(6),
        createEmptyDay(7),
      ],
      [
        createEmptyDay(8),
        createEmptyDay(9),
        createEmptyDay(10),
        createEmptyDay(11),
        createEmptyDay(12),
        createEmptyDay(13),
        createEmptyDay(14),
      ],
      [
        createEmptyDay(15),
        {
          day: "16",
          state: "missed",
          ariaLabel: "16 число было пропущено",
          disabled: true,
        },
        createEmptyDay(17),
        createEmptyDay(18),
        createEmptyDay(19),
        createEmptyDay(20),
        createEmptyDay(21),
      ],
      [
        createEmptyDay(22),
        createEmptyDay(23),
        createEmptyDay(24),
        createEmptyDay(25),
        createMarkedDay(26, "once", "Я стараюсь не забывать про зубки даже в выходные."),
        createEmptyDay(27),
        createEmptyDay(28),
      ],
    ],
    calendarModalSelect: {
      name: "calendar-cleaning-count",
      label: "Выбери что ты сделал",
      placeholder: "Выбери что ты сделал",
      selected: true,
      selectedText: "Почистил зубы 2 раза",
      options: [
        {
          value: "twice",
          label: "Почистил зубы 2 раза",
          checked: true,
        },
        {
          value: "once",
          label: "Почистил зубы 1 раз",
        },
      ],
    },
    calendarModalNote: {
      name: "calendar-progress-note",
      label: "Оставь заметку о прогрессе",
      value: defaultNote,
    },
  },
};

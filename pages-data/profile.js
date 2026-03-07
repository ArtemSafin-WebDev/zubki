export default {
  "/profile.html": {
    title: "Профиль",
    profileSectionTitle: "Профиль",
    profileCalendarTitle: "Календарь",
    profileCalendarLinkText: "Перейти",
    profileCalendarDaysLeft: "4 дня",
    profileCalendarDay: "28",
    profileStatsRows: [
      [
        { label: "Прогресс (8-11 лет)", value: "85%" },
        { label: "Изучено статей", value: "8" },
      ],
      [
        { label: "Просмотрено видео", value: "4" },
        { label: "Сыграно игр", value: "2" },
      ],
    ],
    profileParentRows: [
      [
        {
          type: "text",
          name: "parentFirstName",
          label: "Имя",
          value: "Михаил",
          autocomplete: "given-name",
        },
        {
          type: "text",
          name: "parentLastName",
          label: "Фамилия",
          value: "Иванов",
          autocomplete: "family-name",
        },
      ],
      [
        {
          type: "email",
          name: "parentEmail",
          label: "Электронная почта",
          value: "mi.ya@mail.ru",
          autocomplete: "email",
        },
        {
          type: "tel",
          name: "parentPhone",
          label: "Номер телефона",
          value: "+7 (900) 123-45-67",
          autocomplete: "tel",
        },
      ],
    ],
    profileChildRows: [
      [
        {
          type: "text",
          name: "childFirstName",
          label: "Имя",
          value: "Иван",
        },
        {
          type: "text",
          name: "childLastName",
          label: "Фамилия",
          value: "Яковлев",
        },
      ],
      [
        {
          type: "text",
          name: "childAge",
          label: "Возраст",
          value: "9 лет",
        },
        {
          type: "text",
          name: "childGender",
          label: "Пол",
          value: "Мальчик",
        },
      ],
      [
        {
          type: "text",
          name: "childTeethCondition",
          label: "Состояние зубок",
          value: "Нормальное",
        },
        {
          type: "text",
          name: "childClinic",
          label: "Клиника",
          value: "Native Clinic",
        },
      ],
    ],
    profilePassword: {
      type: "text",
      name: "password",
      label: "Пароль",
      value: "********",
    },
    profileSubscriptionDate: "Активирована 28 ноября, 2025",
  },
};

export default {
  "/profile.html": {
    title: "Профиль",
    profileSectionTitle: "Профиль",
    profileCalendarTitle: "Календарь",
    profileCalendarLinkText: "Перейти",
    profileCalendarDaysLeft: "4 дня",
    profileCalendarDay: "28",
    profileStatsSlides: [
      {
        rows: [
          [
            { label: "Прогресс (8-11 лет)", value: "85%" },
            { label: "Изучено статей", value: "8" },
          ],
          [
            { label: "Просмотрено видео", value: "4" },
            { label: "Сыграно игр", value: "2" },
          ],
        ],
      },
      {
        rows: [
          [
            { label: "Прогресс (8-11 лет)", value: "92%" },
            { label: "Изучено статей", value: "11" },
          ],
          [
            { label: "Просмотрено видео", value: "7" },
            { label: "Сыграно игр", value: "5" },
          ],
        ],
      },
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
    profileChildTopRows: [
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
    ],
    profileChildAge: {
      type: "text",
      name: "childAge",
      label: "Возраст",
      value: "9 лет",
    },
    profileChildGender: {
      name: "childGender",
      label: "Пол",
      placeholder: "Пол",
      selected: true,
      selectedText: "Мальчик",
      options: [
        { value: "male", label: "Мальчик", checked: true },
        { value: "female", label: "Девочка" },
      ],
    },
    profileChildTeethCondition: {
      name: "childTeethCondition",
      label: "Состояние зубок",
      placeholder: "Состояние зубок",
      selected: true,
      selectedText: "Нормальное",
      options: [
        { value: "good", label: "Хорошее" },
        { value: "normal", label: "Нормальное", checked: true },
        { value: "satisfactory", label: "Удовлетворительное" },
        { value: "needs-attention", label: "Требует внимания" },
        { value: "needs-treatment", label: "Требует лечения" },
      ],
    },
    profileChildClinic: {
      type: "text",
      name: "childClinic",
      label: "Клиника",
      value: "Native Clinic",
    },
    profilePassword: {
      type: "text",
      name: "password",
      label: "Пароль",
      value: "********",
    },
    profileSubscriptionDate: "Активирована 28 ноября, 2025",
  },
};

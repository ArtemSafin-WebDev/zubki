export default {
  "/register.html": {
    title: "Регистрация",
    registerGenderSelect: {
      name: "childGender",
      label: "Пол",
      placeholder: "Пол",
      options: [
        { value: "male", label: "Мальчик" },
        { value: "female", label: "Девочка" },
      ],
    },
    registerTeethConditionSelect: {
      name: "childTeethCondition",
      label: "Состояние зубок",
      placeholder: "Состояние зубок",
      options: [
        { value: "good", label: "Хорошее" },
        { value: "normal", label: "Нормальное" },
        { value: "satisfactory", label: "Удовлетворительное" },
        { value: "needs-attention", label: "Требует внимания" },
        { value: "needs-treatment", label: "Требует лечения" },
      ],
    },
  },
};

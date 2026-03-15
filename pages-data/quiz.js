export default {
  "/quiz-start.html": {
    title: "Квиз про зубки",
    quizPageTitle: "Квиз про зубки",
    quizBackHref: "/index.html",
    quizBackText: "Назад",
    quizStartTitle: "12 простых вопросов",
    quizStartDescription:
      "Ответьте на вопросы на темы изученных статей из прошлых уроков и закрепите свои знания",
    quizLeaderboardHref: "#",
    quizLeaderboardText: "Таблица лидеров",
    quizStartHref: "/quiz.html",
    quizStartButtonText: "Пройти квиз",
  },
  "/quiz.html": {
    title: "Квиз про зубки",
    quizPageTitle: "Квиз про зубки",
    quizBackHref: "/quiz-start.html",
    quizBackText: "Назад",
    quizCurrentQuestion: "1",
    quizTotalQuestions: "12",
    quizTimer: "1:44",
    quizQuestionText:
      "Какая концентрация фторидов (ppm) в зубной пасте считается оптимальной для подростков старше 12 лет?",
    quizPrevHref: "/quiz-start.html",
    quizNextHref: "#",
    quizOptions: [
      { value: "500", label: "500 ppm" },
      { value: "1000", label: "1000 ppm" },
      { value: "1450-1500", label: "1450–1500 ppm" },
      { value: "2500", label: "2500 ppm" },
    ],
  },
};

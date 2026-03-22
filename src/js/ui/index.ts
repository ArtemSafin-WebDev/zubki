import accordions from "./accordions";
import cookieBanner from "./cookieBanner";
import calendarBoards from "./calendarBoards";
import dashboard from "./dashboard";
import factCards from "./factCards";
import headerMenu from "./headerMenu";
import modals from "./modals";
import passwordToggles from "./passwordToggles";
import profileEditForms from "./profileEditForms";
import profileStatsCards from "./profileStatsCards";
import quizOptionsSliders from "./quizOptionsSliders";
import selects from "./selects";

export default function ui() {
  accordions();
  calendarBoards();
  cookieBanner();
  dashboard();
  factCards();
  headerMenu();
  modals();
  passwordToggles();
  profileEditForms();
  profileStatsCards();
  quizOptionsSliders();
  selects();
}

import accordions from "./accordions";
import cookieBanner from "./cookieBanner";
import calendarBoards from "./calendarBoards";
import dashboard from "./dashboard";
import factCards from "./factCards";
import headerMenu from "./headerMenu";
import modals from "./modals";
import passwordToggles from "./passwordToggles";
import profileStatsCards from "./profileStatsCards";
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
  profileStatsCards();
  selects();
}

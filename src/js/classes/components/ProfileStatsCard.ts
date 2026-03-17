import Component from "../Component";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

class ProfileStatsCard extends Component {
  private swiperInstance: Swiper | null = null;

  constructor(element: HTMLElement) {
    super(element);

    const container = this.element.querySelector<HTMLElement>(
      ".profile-dashboard__stats-body",
    );
    const prevButton = this.element.querySelector<HTMLButtonElement>(
      ".profile-dashboard__stats-arrow--prev",
    );
    const nextButton = this.element.querySelector<HTMLButtonElement>(
      ".profile-dashboard__stats-arrow--next",
    );
    const pagination = this.element.querySelector<HTMLElement>(
      ".profile-dashboard__stats-pagination",
    );

    if (!container || !prevButton || !nextButton || !pagination) {
      throw new Error("Profile stats slider elements not found");
    }

    this.swiperInstance = new Swiper(container, {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      slidesPerGroup: 1,
      speed: 260,
      centeredSlides: false,
      watchOverflow: true,
      allowTouchMove: true,
      pagination: {
        el: pagination,
        clickable: true,
        bulletClass: "profile-dashboard__stats-pagination-bullet",
        bulletActiveClass: "profile-dashboard__stats-pagination-bullet--active",
      },
      navigation: {
        prevEl: prevButton,
        nextEl: nextButton,
      },
    });
  }

  public destroy() {
    this.swiperInstance?.destroy(true, true);
    this.swiperInstance = null;
    this.unregister();
  }
}

export default ProfileStatsCard;

import Component from "../Component";
import Swiper from "swiper";
import { gsap } from "gsap";
import { MOBILE_BREAKPOINT } from "../../constants/breakpoints";

const MOBILE_BREAKPOINT_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`;

class HomeDashboard extends Component {
  private swiperContainer: HTMLElement;
  private swiperInstance: Swiper | null = null;
  private matchMedia: ReturnType<typeof gsap.matchMedia>;

  constructor(element: HTMLElement) {
    super(element);

    const container = this.element.querySelector<HTMLElement>(".swiper");
    if (!container) {
      throw new Error("Home dashboard swiper container not found");
    }

    this.swiperContainer = container;
    this.matchMedia = gsap.matchMedia();

    this.matchMedia.add(MOBILE_BREAKPOINT_QUERY, () => {
      this.swiperInstance = new Swiper(this.swiperContainer, {
        slidesPerView: 1,
        spaceBetween: 20,
        autoHeight: true,
      });

      return () => {
        this.destroySwiper();
      };
    });
  }

  public destroy() {
    this.matchMedia.kill();
    this.destroySwiper();
    this.unregister();
  }

  private destroySwiper() {
    if (!this.swiperInstance) return;

    if (!this.swiperInstance.destroyed) {
      this.swiperInstance.destroy(true, true);
    }

    this.swiperInstance = null;
  }
}

export default HomeDashboard;

import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { protectVideos } from "./protectedVideos";

export default function fancybox() {
  Fancybox.bind("[data-fancybox]", {
    on: {
      ready: (instance) => {
        protectVideos(instance.getContainer() ?? null);
      },
      "Carousel.contentReady": (_instance, _carousel, slide) => {
        protectVideos(slide.el ?? null);
      },
    },
    Carousel: {
      Video: {
        autoplay: true,
        html5videoTpl: `<video class="f-html5video" playsinline controls controlsList="nodownload" disablepictureinpicture disableremoteplayback poster="{{poster}}">
    <source src="{{src}}" type="{{format}}" />Sorry, your browser doesn't support embedded videos.</video>`,
      },
    },
  });
}

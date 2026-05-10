import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default function fancybox() {
  Fancybox.bind("[data-fancybox]", {
    Carousel: {
      Video: {
        autoplay: true,
      },
    },
  });
}

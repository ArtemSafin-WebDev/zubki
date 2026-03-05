import Component from "../Component";

const MOBILE_BREAKPOINT_QUERY = "(max-width: 576px)";

class HeaderMenu extends Component {
  private toggleButton: HTMLButtonElement | null;
  private menu: HTMLElement | null;
  private overlay: HTMLElement | null;
  private mediaQuery: MediaQueryList;
  private abortController: AbortController;

  constructor(element: HTMLElement) {
    super(element);

    this.toggleButton = this.element.querySelector<HTMLButtonElement>(
      ".page-header__menu-toggle"
    );
    this.menu = this.element.querySelector<HTMLElement>(".page-header__menu");
    this.overlay = this.element.querySelector<HTMLElement>(
      ".page-header__menu-overlay"
    );
    this.mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    this.abortController = new AbortController();

    const signal = this.abortController.signal;

    this.toggleButton?.addEventListener("click", this.handleToggleClick, {
      signal,
    });
    this.overlay?.addEventListener("click", this.handleOverlayClick, {
      signal,
    });
    this.menu?.addEventListener("click", this.handleMenuClick, { signal });
    document.addEventListener("keydown", this.handleDocumentKeydown, {
      signal,
    });
    this.mediaQuery.addEventListener("change", this.handleMediaQueryChange, {
      signal,
    });

    this.syncA11yState();
  }

  public open() {
    if (!this.mediaQuery.matches) return;

    this.element.classList.add("menu-open");
    document.body.classList.add("menu-open");
    this.syncA11yState();
  }

  public close() {
    this.element.classList.remove("menu-open");
    document.body.classList.remove("menu-open");
    this.syncA11yState();
  }

  public toggle() {
    if (this.element.classList.contains("menu-open")) {
      this.close();
      return;
    }
    this.open();
  }

  public destroy() {
    this.close();
    this.abortController.abort();
    this.unregister();
  }

  private syncA11yState() {
    const isMobile = this.mediaQuery.matches;
    const isExpanded = isMobile && this.element.classList.contains("menu-open");

    this.toggleButton?.setAttribute("aria-expanded", String(isExpanded));
    this.menu?.setAttribute(
      "aria-hidden",
      String(isMobile ? !isExpanded : false)
    );
  }

  private handleToggleClick = (event: MouseEvent) => {
    event.preventDefault();
    this.toggle();
  };

  private handleOverlayClick = () => {
    this.close();
  };

  private handleMenuClick = (event: MouseEvent) => {
    if (
      !this.mediaQuery.matches ||
      !this.element.classList.contains("menu-open")
    )
      return;

    const target = event.target as Element | null;
    if (!target) return;

    const link = target.closest<HTMLAnchorElement>("a");
    if (!link) return;

    this.close();
  };

  private handleDocumentKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    this.close();
  };

  private handleMediaQueryChange = (event: MediaQueryListEvent) => {
    if (!event.matches) {
      this.close();
      return;
    }

    this.syncA11yState();
  };
}

export default HeaderMenu;

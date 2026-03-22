import Component from "../Component";

class CalendarBoard extends Component {
  private static readonly activeDayClass = "calendar-day--popover-active";
  private static readonly bodyLockClass = "calendar-popover-open";
  private static readonly mobileQuery = "(width <= 576px)";
  private static readonly mobileOpenClass = "is-open";
  private static readonly mobileClosingClass = "is-closing";
  private static readonly mobileAnimationDurationMs = 300;
  private readonly popover: HTMLElement | null;
  private readonly closeButton: HTMLButtonElement | null;
  private readonly titleElement: HTMLElement | null;
  private readonly actionElement: HTMLElement | null;
  private readonly noteElement: HTMLElement | null;
  private readonly markedDays: HTMLElement[];
  private readonly abortController: AbortController;
  private readonly mediaQueryList: MediaQueryList;
  private activeDay: HTMLElement | null = null;
  private hideAnimationTimer: number | null = null;

  constructor(element: HTMLElement) {
    super(element);

    this.popover = this.element.querySelector<HTMLElement>(
      ".js-calendar-popover"
    );
    this.closeButton = this.element.querySelector<HTMLButtonElement>(
      ".js-calendar-popover-close"
    );
    this.titleElement = this.element.querySelector<HTMLElement>(
      ".js-calendar-popover-title"
    );
    this.actionElement = this.element.querySelector<HTMLElement>(
      ".js-calendar-popover-action"
    );
    this.noteElement = this.element.querySelector<HTMLElement>(
      ".js-calendar-popover-note"
    );
    this.markedDays = Array.from(
      this.element.querySelectorAll<HTMLElement>("[data-popover-title]")
    );
    this.abortController = new AbortController();
    this.mediaQueryList = window.matchMedia(CalendarBoard.mobileQuery);

    const signal = this.abortController.signal;

    this.markedDays.forEach((day) => {
      day.addEventListener("click", this.handleDayClick, { signal });
    });

    this.popover?.addEventListener("click", this.handlePopoverClick, { signal });
    this.closeButton?.addEventListener("click", this.handleCloseButtonClick, {
      signal,
    });
    document.addEventListener("keydown", this.handleDocumentKeyDown, { signal });

    window.addEventListener("scroll", this.handleWindowScroll, {
      signal,
      passive: true,
    });
    window.addEventListener("resize", this.handleWindowResize, { signal });
    this.mediaQueryList.addEventListener("change", this.handleMediaQueryChange);
  }

  public destroy() {
    this.abortController.abort();
    this.mediaQueryList.removeEventListener("change", this.handleMediaQueryChange);
    this.hidePopoverImmediately();
    this.unregister();
  }

  private get isMobileViewport() {
    return this.mediaQueryList.matches;
  }

  private handleDayClick = (event: MouseEvent) => {
    const day = event.currentTarget as HTMLElement;
    event.preventDefault();

    if (this.activeDay === day && this.popover && !this.popover.hidden) {
      this.hidePopover();
      return;
    }

    this.fillPopover(day);
    this.showPopover(day);

    if (!this.isMobileViewport) {
      const rect = day.getBoundingClientRect();
      this.positionPopover(rect.right, rect.top);
    }
  };

  private handlePopoverClick = (event: MouseEvent) => {
    if (!this.isMobileViewport || !this.popover || this.popover.hidden) return;

    if (event.target === this.popover) {
      this.hidePopover();
    }
  };

  private handleCloseButtonClick = (event: MouseEvent) => {
    event.preventDefault();
    this.hidePopover();
  };

  private handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;

    this.hidePopover();
  };

  private handleWindowScroll = () => {
    this.hidePopover();
  };

  private handleWindowResize = () => {
    this.hidePopover();
  };

  private handleMediaQueryChange = () => {
    this.hidePopover();
  };

  private fillPopover(day: HTMLElement) {
    if (!this.titleElement || !this.actionElement || !this.noteElement) return;

    this.titleElement.textContent = day.dataset.popoverTitle ?? "";
    this.actionElement.textContent = day.dataset.popoverAction ?? "";
    this.noteElement.textContent = day.dataset.popoverNote ?? "";
  }

  private showPopover = (day: HTMLElement) => {
    if (!this.popover) return;

    this.clearHideAnimationTimer();
    this.setActiveDay(day);
    this.activeDay = day;
    this.popover.hidden = false;

    if (this.isMobileViewport) {
      document.body.classList.add(CalendarBoard.bodyLockClass);
      this.popover.classList.remove(CalendarBoard.mobileClosingClass);
      requestAnimationFrame(() => {
        this.popover?.classList.add(CalendarBoard.mobileOpenClass);
      });
      return;
    }
  };

  private hidePopover = () => {
    if (!this.popover) return;

    this.popover.style.removeProperty("left");
    this.popover.style.removeProperty("top");
    this.clearActiveDay();
    this.activeDay = null;

    if (this.isMobileViewport && !this.popover.hidden) {
      this.startMobileHideAnimation();
      return;
    }

    this.hidePopoverImmediately();
  };

  private startMobileHideAnimation() {
    if (!this.popover) return;

    this.clearHideAnimationTimer();
    this.popover.classList.remove(CalendarBoard.mobileOpenClass);
    this.popover.classList.add(CalendarBoard.mobileClosingClass);

    this.hideAnimationTimer = window.setTimeout(
      this.hidePopoverImmediately,
      CalendarBoard.mobileAnimationDurationMs
    );
  }

  private hidePopoverImmediately = () => {
    if (!this.popover) return;

    this.clearHideAnimationTimer();
    this.popover.classList.remove(
      CalendarBoard.mobileOpenClass,
      CalendarBoard.mobileClosingClass
    );
    this.popover.hidden = true;
    document.body.classList.remove(CalendarBoard.bodyLockClass);
  };

  private clearHideAnimationTimer() {
    if (this.hideAnimationTimer === null) return;

    window.clearTimeout(this.hideAnimationTimer);
    this.hideAnimationTimer = null;
  }

  private setActiveDay(day: HTMLElement) {
    this.clearActiveDay();
    day.classList.add(CalendarBoard.activeDayClass);
  }

  private clearActiveDay() {
    this.markedDays.forEach((day) => {
      day.classList.remove(CalendarBoard.activeDayClass);
    });
  }

  private positionPopover(clientX: number, clientY: number) {
    if (!this.popover || this.popover.hidden || this.isMobileViewport) return;

    const offset = 20;
    const gutter = 12;
    const rect = this.popover.getBoundingClientRect();

    let left = clientX + offset;
    let top = clientY + offset;

    if (left + rect.width > window.innerWidth - gutter) {
      left = clientX - rect.width - offset;
    }

    if (top + rect.height > window.innerHeight - gutter) {
      top = clientY - rect.height - offset;
    }

    left = Math.max(
      gutter,
      Math.min(left, window.innerWidth - rect.width - gutter)
    );
    top = Math.max(
      gutter,
      Math.min(top, window.innerHeight - rect.height - gutter)
    );

    this.popover.style.left = `${left}px`;
    this.popover.style.top = `${top}px`;
  }
}

export default CalendarBoard;

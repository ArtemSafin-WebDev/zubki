import Component from "../Component";

class CalendarBoard extends Component {
  private readonly popover: HTMLElement | null;
  private readonly titleElement: HTMLElement | null;
  private readonly actionElement: HTMLElement | null;
  private readonly noteElement: HTMLElement | null;
  private readonly markedDays: HTMLElement[];
  private readonly abortController: AbortController;

  constructor(element: HTMLElement) {
    super(element);

    this.popover = this.element.querySelector<HTMLElement>(".js-calendar-popover");
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

    const signal = this.abortController.signal;

    this.markedDays.forEach((day) => {
      day.addEventListener("pointerenter", this.handlePointerEnter, { signal });
      day.addEventListener("pointermove", this.handlePointerMove, { signal });
      day.addEventListener("pointerleave", this.handlePointerLeave, { signal });
      day.addEventListener("focus", this.handleFocus, { signal });
      day.addEventListener("blur", this.handleBlur, { signal });
    });

    window.addEventListener("scroll", this.hidePopover, {
      signal,
      passive: true,
    });
    window.addEventListener("resize", this.hidePopover, { signal });
  }

  public destroy() {
    this.abortController.abort();
    this.hidePopover();
    this.unregister();
  }

  private handlePointerEnter = (event: PointerEvent) => {
    const day = event.currentTarget as HTMLElement;
    this.fillPopover(day);
    this.showPopover();
    this.positionPopover(event.clientX, event.clientY);
  };

  private handlePointerMove = (event: PointerEvent) => {
    this.positionPopover(event.clientX, event.clientY);
  };

  private handlePointerLeave = () => {
    this.hidePopover();
  };

  private handleFocus = (event: FocusEvent) => {
    const day = event.currentTarget as HTMLElement;
    const rect = day.getBoundingClientRect();

    this.fillPopover(day);
    this.showPopover();
    this.positionPopover(rect.right, rect.top);
  };

  private handleBlur = () => {
    this.hidePopover();
  };

  private fillPopover(day: HTMLElement) {
    if (!this.titleElement || !this.actionElement || !this.noteElement) return;

    this.titleElement.textContent = day.dataset.popoverTitle ?? "";
    this.actionElement.textContent = day.dataset.popoverAction ?? "";
    this.noteElement.textContent = day.dataset.popoverNote ?? "";
  }

  private showPopover = () => {
    if (!this.popover) return;

    this.popover.hidden = false;
  };

  private hidePopover = () => {
    if (!this.popover) return;

    this.popover.hidden = true;
  };

  private positionPopover(clientX: number, clientY: number) {
    if (!this.popover || this.popover.hidden) return;

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

    left = Math.max(gutter, Math.min(left, window.innerWidth - rect.width - gutter));
    top = Math.max(gutter, Math.min(top, window.innerHeight - rect.height - gutter));

    this.popover.style.left = `${left}px`;
    this.popover.style.top = `${top}px`;
  }
}

export default CalendarBoard;

import Component from "../Component";

interface TabsSelectors {
  root: string;
  btn: string;
  item: string;
}

interface TabsOptions {
  selectors: TabsSelectors;
  onTabChange?: (
    oldItem: HTMLElement | null,
    newItem: HTMLElement,
    index: number
  ) => void;
}

class Tabs extends Component {
  private btns: HTMLButtonElement[];
  private items: HTMLElement[];
  private activeIndex = -1;
  private rootSelector: string;
  private onTabChange?: TabsOptions["onTabChange"];

  constructor(element: HTMLElement, options: TabsOptions) {
    super(element);
    this.onTabChange = options?.onTabChange;
    this.rootSelector = options.selectors.root;
    const btnSelector = options.selectors.btn;
    const itemSelector = options.selectors.item;
    this.btns = this.queryOwn<HTMLButtonElement>(btnSelector);
    this.items = this.queryOwn<HTMLElement>(itemSelector);

    this.setActive(0);

    this.btns.forEach((btn, btnIndex) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        this.setActive(btnIndex);
      });
    });
  }

  private queryOwn<T extends HTMLElement>(selector: string): T[] {
    return Array.from(this.element.querySelectorAll<T>(selector)).filter(
      (el) => el.closest(this.rootSelector) === this.element
    );
  }

  public setActive(index: number) {
    if (index < 0 || index >= this.btns.length) {
      return;
    }

    const oldItem = this.activeIndex >= 0 ? this.items[this.activeIndex] : null;
    const newItem = this.items[index];
    this.btns.forEach((btn) => btn.classList.remove("active"));
    this.items.forEach((item) => item.classList.remove("active"));
    this.btns[index]?.classList.add("active");
    newItem?.classList.add("active");

    this.activeIndex = index;

    if (newItem) {
      this.onTabChange?.(oldItem ?? null, newItem, index);
    }
  }
}

export default Tabs;

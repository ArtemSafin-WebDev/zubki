type AccordionOptions = {
  /** Селектор кнопки, по клику на которую переключается аккордеон */
  btnSelector: string;
  /** Селектор выпадающего контента, на котором слушается transitionend */
  dropdownSelector: string;
  onHeightChange?: () => void;
};

/**
 * Класс для управления аккордеонами.
 *
 * Поддерживает работу в группе: при открытии одного аккордеона
 * остальные в группе автоматически закрываются.
 *
 * Коллбек onHeightChange вызывается после завершения CSS-перехода
 * на элементе .accordion__dropdown (transitionend). Это позволяет,
 * например, вызвать ScrollTrigger.refresh() в нужный момент —
 * когда высота контента уже изменилась.
 *
 * Проблема N+1: при клике закрываются N аккордеонов и открывается 1,
 * каждый из них стреляет transitionend, но коллбек нужен только один раз.
 * Решение — статический Map<callback, rafId>. Все аккордеоны группы
 * делят один onHeightChange по ссылке. Каждый transitionend отменяет
 * предыдущий requestAnimationFrame и планирует новый. В итоге коллбек
 * вызывается единственный раз — после последнего завершённого перехода.
 */
import Component from "../Component";

class Accordion extends Component {
  /**
   * Статический Map для дедупликации коллбеков.
   * Ключ — ссылка на функцию onHeightChange, значение — id requestAnimationFrame.
   * Общий для всех экземпляров класса: если несколько аккордеонов шарят
   * один коллбек, при каждом transitionend предыдущий RAF отменяется,
   * и в итоге коллбек вызывается только один раз за «пачку» переходов.
   */
  private static pendingCallbacks = new Map<() => void, number>();

  private button: HTMLButtonElement | null;
  private dropdown: HTMLElement | null;

  /** Массив аккордеонов в группе — используется для взаимного закрытия */
  private group: Accordion[];

  /** Коллбек, вызываемый после завершения CSS-перехода dropdown */
  private onHeightChange?: () => void;

  constructor(
    element: HTMLElement,
    group: Accordion[] = [],
    options: AccordionOptions
  ) {
    super(element);
    this.group = group;
    this.onHeightChange = options.onHeightChange;

    this.button =
      this.element.querySelector<HTMLButtonElement>(options.btnSelector);
    this.dropdown =
      this.element.querySelector<HTMLElement>(options.dropdownSelector);

    // Клик по кнопке — открытие/закрытие аккордеона
    this.button?.addEventListener("click", this.handleClick);

    // Слушаем завершение CSS-перехода на dropdown,
    // чтобы вызвать onHeightChange после анимации, а не до неё
    this.dropdown?.addEventListener("transitionend", this.handleTransitionEnd);
  }

  public open() {
    this.element.classList.add("active");
  }

  public close() {
    this.element.classList.remove("active");
  }

  public toggle() {
    this.element.classList.toggle("active");
  }

  /** Снимает все обработчики — вызывать при удалении аккордеона из DOM */
  public destroy() {
    this.button?.removeEventListener("click", this.handleClick);
    this.dropdown?.removeEventListener("transitionend", this.handleTransitionEnd);
    this.unregister();
  }

  /**
   * Планирует вызов onHeightChange через requestAnimationFrame.
   *
   * Если для этого же коллбека уже запланирован RAF (от другого аккордеона
   * в группе) — отменяем его и планируем заново. Таким образом,
   * серия transitionend (N закрытий + 1 открытие) схлопывается
   * в единственный вызов коллбека — после последнего перехода.
   */
  private scheduleHeightChange() {
    if (!this.onHeightChange) return;

    // Отменяем предыдущий запланированный вызов для этого коллбека
    const existing = Accordion.pendingCallbacks.get(this.onHeightChange);
    if (existing) cancelAnimationFrame(existing);

    const cb = this.onHeightChange;
    const id = requestAnimationFrame(() => {
      // Очищаем запись из Map и вызываем коллбек
      Accordion.pendingCallbacks.delete(cb);
      cb();
    });

    // Сохраняем id RAF, чтобы следующий transitionend мог его отменить
    Accordion.pendingCallbacks.set(this.onHeightChange, id);
  }

  /** Обработчик transitionend на .accordion__dropdown */
  private handleTransitionEnd = () => {
    this.scheduleHeightChange();
  };

  /**
   * Обработчик клика по кнопке аккордеона.
   * Закрывает все остальные аккордеоны в группе, затем переключает текущий.
   */
  private handleClick = (event: MouseEvent) => {
    event.preventDefault();

    // Закрываем все аккордеоны в группе, кроме текущего
    this.group.forEach((accordion) => {
      if (accordion === this) return;
      accordion.close();
    });

    // Переключаем текущий аккордеон
    this.toggle();
  };
}

export default Accordion;

/**
 * Базовый класс для UI-компонентов с реестром экземпляров.
 *
 * Каждый класс-наследник автоматически получает собственный статический
 * Map<HTMLElement, Instance>, в котором хранятся все созданные экземпляры.
 * Получить экземпляр по элементу: Select.getInstanceFor(el).
 */
abstract class Component {
  /**
   * declare говорит TypeScript: «свойство существует, но не инициализируй его».
   * Без declare TS скомпилирует static instances = undefined, и все наследники
   * будут делить одно значение от родителя. С declare — свойство появится
   * только в рантайме, когда мы сами создадим его через Object.hasOwn-проверку.
   *
   * WeakMap держит слабые ссылки на ключи (HTMLElement). Если элемент удалён
   * из DOM и на него больше никто не ссылается, сборщик мусора сам очистит
   * запись — даже без вызова destroy(). Страховка от утечек памяти.
   */
  declare static instances: WeakMap<HTMLElement, Component>;

  constructor(protected element: HTMLElement) {
    /**
     * this.constructor — конкретный класс, через который вызван new.
     * Например, при new Select(el) — this.constructor === Select.
     *
     * Object.hasOwn проверяет, есть ли instances непосредственно на этом классе,
     * а не унаследованный от родителя. Без этой проверки Select и Tabs
     * ссылались бы на один и тот же Map. А так при первом new Select(...)
     * создаётся Select.instances = new Map(), при первом new Tabs(...) —
     * отдельный Tabs.instances = new Map().
     */
    const ctor = this.constructor as typeof Component;
    if (!Object.hasOwn(ctor, "instances")) {
      ctor.instances = new WeakMap();
    }
    ctor.instances.set(element, this);
  }

  /**
   * Параметр this — не настоящий аргумент, а подсказка TypeScript о том,
   * на чём вызван метод. Когда пишем Select.getInstanceFor(el), TS понимает,
   * что this = typeof Select, и выводит T = Select.
   * Возвращаемый тип — Select | undefined.
   */
  static getInstanceFor<T>(
    this: typeof Component & (new (...args: any[]) => T),
    element: HTMLElement
  ): T | undefined {
    if (!Object.hasOwn(this, "instances")) return undefined;
    return this.instances.get(element) as T | undefined;
  }

  /**
   * Убирает пару element → instance из Map.
   * Вызывается в destroy() наследников, чтобы не держать ссылку
   * на уничтоженный экземпляр.
   */
  protected unregister() {
    const ctor = this.constructor as typeof Component;
    ctor.instances?.delete(this.element);
  }
}

export default Component;

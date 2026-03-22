import Component from "../Component";

interface SelectControl {
  root: HTMLElement;
  button: HTMLButtonElement;
  options: HTMLInputElement[];
}

class ProfileEditForm extends Component {
  private readonly form: HTMLFormElement;
  private readonly editButton: HTMLButtonElement | null;
  private readonly cancelButton: HTMLButtonElement | null;
  private readonly actionsContainer: HTMLElement | null;
  private readonly textFields: Array<HTMLInputElement | HTMLTextAreaElement>;
  private readonly selectControls: SelectControl[];

  constructor(form: HTMLFormElement) {
    super(form);
    this.form = form;
    this.editButton = form.querySelector<HTMLButtonElement>(".js-profile-edit-btn");
    this.cancelButton =
      form.querySelector<HTMLButtonElement>(".js-profile-cancel-btn");
    this.actionsContainer = form.querySelector<HTMLElement>(
      ".js-profile-edit-actions"
    );
    this.textFields = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        ".text-input__field"
      )
    );
    this.selectControls = this.collectSelectControls();

    this.editButton?.addEventListener("click", this.handleEditClick);
    this.cancelButton?.addEventListener("click", this.handleCancelClick);

    this.setEditing(false);
  }

  public destroy() {
    this.editButton?.removeEventListener("click", this.handleEditClick);
    this.cancelButton?.removeEventListener("click", this.handleCancelClick);
    this.unregister();
  }

  private collectSelectControls(): SelectControl[] {
    const selectElements = Array.from(
      this.form.querySelectorAll<HTMLElement>(".js-select")
    );

    return selectElements
      .map((root) => {
        const button = root.querySelector<HTMLButtonElement>(".select__button");
        const options = Array.from(
          root.querySelectorAll<HTMLInputElement>(".select__input")
        );

        if (!button) return null;

        return { root, button, options };
      })
      .filter((control): control is SelectControl => control !== null);
  }

  private handleEditClick = () => {
    this.setEditing(true);
  };

  private handleCancelClick = (event: MouseEvent) => {
    event.preventDefault();
    this.form.reset();
    this.setEditing(false);
  };

  private setEditing(isEditing: boolean) {
    this.editButton?.toggleAttribute("hidden", isEditing);
    this.actionsContainer?.toggleAttribute("hidden", !isEditing);

    this.textFields.forEach((field) => {
      field.readOnly = !isEditing;
    });

    this.selectControls.forEach(({ root, button, options }) => {
      button.disabled = !isEditing;
      options.forEach((option) => {
        option.disabled = !isEditing;
      });

      if (!isEditing) {
        root.classList.remove("active");
      }
    });
  }
}

export default ProfileEditForm;

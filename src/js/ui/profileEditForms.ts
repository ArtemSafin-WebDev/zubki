import ProfileEditForm from "../classes/components/ProfileEditForm";

export default function profileEditForms() {
  const forms = Array.from(
    document.querySelectorAll<HTMLFormElement>(".js-profile-edit-form")
  );

  forms.forEach((form) => {
    if (ProfileEditForm.getInstanceFor(form)) return;
    new ProfileEditForm(form);
  });
}

// a11y means accessibility
// This Component is supposed to be used as a helper for Aria Attributes & Other Accessibility Features

export class A11y {
  constructor() {
    this.addRequired();
    this.addLabel();
    this.addGroupRole();
    this.updateFrequencyLabel();
    const ecardImages: NodeListOf<HTMLImageElement> = document.querySelectorAll('.en__ecarditems__list img');
    this.setAutoGeneratedAltTags(ecardImages);
  }

  private addGroupRole() {
    // Add role="group" to all EN Radio fields
    const radioFields = document.querySelectorAll(".en__field--radio");
    radioFields.forEach((field) => {
      field.setAttribute("role", "group");
      // Add random ID to the label
      const label = field.querySelector("label") as HTMLLabelElement;
      if (label) {
        label.setAttribute(
          "id",
          `en__field__label--${Math.random().toString(36).slice(2, 7)}`
        );
        field.setAttribute("aria-labelledby", label.id);
      }
    });
  }

  private addRequired() {
    const mandatoryFields = document.querySelectorAll(
      ".en__mandatory .en__field__input"
    );
    mandatoryFields.forEach((field) => {
      field.setAttribute("aria-required", "true");
    });
  }

  private addLabel() {
    const otherAmount = document.querySelector(
      ".en__field__input--otheramount"
    ) as HTMLInputElement;
    if (otherAmount) {
      otherAmount.setAttribute(
        "aria-label",
        "Enter your custom donation amount"
      );
    }
    // Split selects usually don't have a label, so let's make the first option the label
    const splitSelects = document.querySelectorAll(
      ".en__field__input--splitselect"
    );
    splitSelects.forEach((select) => {
      const firstOption = select.querySelector("option") as HTMLOptionElement;
      if (
        firstOption &&
        firstOption.value === "" &&
        !firstOption.textContent?.toLowerCase()?.includes("select") &&
        !firstOption.textContent?.toLowerCase()?.includes("choose")
      ) {
        select.setAttribute("aria-label", firstOption.textContent || "");
      }
    });
  }

  // Update the label for the frequency field based on the selected radio button
  private updateFrequencyLabel() {
    const frequencyLabels = document.querySelectorAll('div.en__field__item input[id^="en__field_transaction_recurrfreq"]')
    const frequencyMainLabel = document.querySelector('label[for="en__field_transaction_recurrfreq"]');

    frequencyLabels.forEach((item) => {
      if (item) {

        // Set the label for the checked item on load
        if ((item as HTMLInputElement).checked) {
          frequencyMainLabel?.setAttribute('for', item.id);
        }

        // Then, detect if it changes with the click event
        item.addEventListener('click', () => {
          let frequencyId = item.id;
          frequencyMainLabel?.setAttribute('for', frequencyId);
        });
      }
    })
  }

  private setAutoGeneratedAltTags(images: NodeListOf<HTMLImageElement>): void {
    images.forEach((img: HTMLImageElement) => {
      // Skip if the alt tag is already set
      if (img.alt) return;
  
      try {
        // Extract the filename from the `src` attribute
        const src: string | null = img.src;
        if (!src) throw new Error("Image src is null or undefined");
  
        const url = new URL(src);
        const fileNameWithExtension: string | undefined = url.pathname.split('/').pop();
        if (!fileNameWithExtension) throw new Error("No filename found in src");
  
        // Remove the file extension and replace `-` and `_` with spaces
        let altText: string = fileNameWithExtension.split('.').shift()?.replace(/[-_]/g, ' ') || '';
  
        // Remove dimensions (#x#) and anything that follows
        altText = altText.replace(/\d+x\d+.*$/, '').trim();
  
        // Wrap in the disclaimer
        altText = `This is an auto-generated alt tag from the filename: ${altText}`;
  
        // Set the generated alt text on the image
        img.alt = altText;
      } catch (error) {
        console.error(`Error processing image: ${img.src}`, error);
      }
    });
  }
}

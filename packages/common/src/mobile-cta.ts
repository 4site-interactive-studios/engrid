// This component adds a floating CTA button to the page, which can be used to scroll to the top of the form
import { ENGrid, Options } from "./";

export class MobileCTA {
  private options: Options["MobileCTA"] =
    ENGrid.getOption("MobileCTA") || false;

  private buttonLabel: string = "";

  constructor() {
    if (
      this.options === false ||
      !this.options?.pages?.includes(ENGrid.getPageType())
    )
      return;
    this.buttonLabel = this.options?.label || "Take Action";
    this.renderButton();
    this.addEventListeners();
  }

  private renderButton() {
    const engridDiv = document.querySelector("#engrid") as HTMLElement;
    const buttonContainer = document.createElement("div");
    const button = document.createElement("button");
    const formBlock = document.querySelector(
      ".body-main, .en__component--formblock"
    ) as HTMLElement;
    buttonContainer.classList.add("engrid-mobile-cta-container");
    button.classList.add("primary");

    button.innerHTML = this.buttonLabel;
    button.addEventListener("click", () => {
      formBlock.scrollIntoView({
        behavior: "smooth",
      });
    });
    buttonContainer.appendChild(button);
    if (engridDiv) engridDiv.appendChild(buttonContainer);
  }
  private addEventListeners() {
    const formBlock = document.querySelector(
      ".en__component--formblock"
    ) as HTMLElement;
    // When the form block is scrolled into view, hide the button
    window.addEventListener("scroll", () => {
      if (formBlock.getBoundingClientRect().top <= window.innerHeight - 100) {
        this.hideButton();
      } else {
        this.showButton();
      }
    });
  }
  private hideButton() {
    const buttonContainer = document.querySelector(
      ".engrid-mobile-cta-container"
    ) as HTMLElement;
    if (buttonContainer) buttonContainer.style.display = "none";
  }
  private showButton() {
    const buttonContainer = document.querySelector(
      ".engrid-mobile-cta-container"
    ) as HTMLElement;
    if (buttonContainer) buttonContainer.style.display = "block";
  }
}

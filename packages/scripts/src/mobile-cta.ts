// This component adds a floating CTA button to the page, which can be used to scroll to the top of the form
import { ENGrid, Options } from ".";

export class MobileCTA {
  // Initialize options with the MobileCTA value or false
  private options: Options["MobileCTA"] =
    ENGrid.getOption("MobileCTA") ?? false;
  private buttonLabel: string = "";

  constructor() {
    // Return early if the options object is falsy or the current page type is not in the options.pages array
    if (
      !this.options ||
      ENGrid.getPageNumber() !== 1
    ) {
      return;
    }

    const labelForPageType = this.options.find(option => option.pageType === ENGrid.getPageType());

    if (!labelForPageType) return;

    // Set the button label using the options.label or the default value "Take Action"
    this.buttonLabel = window.mobileCTAButtonLabel || labelForPageType.label || "Take Action";
    this.renderButton();
    this.addEventListeners();
  }

  private renderButton() {
    const engridDiv = document.querySelector("#engrid") as HTMLElement;
    const formBlock = document.querySelector(
      ".body-main .en__component--widgetblock:first-child, .en__component--formblock"
    ) as HTMLElement;

    // Return early if engridDiv or formBlock are not found
    if (!engridDiv || !formBlock) return;

    const buttonContainer = document.createElement("div");
    const button = document.createElement("button");

    // Add necessary classes and set the initial display style for the button container
    buttonContainer.classList.add("engrid-mobile-cta-container", "hide-cta");
    button.classList.add("primary");

    // Set the button's innerHTML and add a click event listener
    button.innerHTML = this.buttonLabel + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
    button.addEventListener("click", () => {
      formBlock.scrollIntoView({ behavior: "smooth" });
    });

    // Append the button to the button container and the container to engridDiv
    buttonContainer.appendChild(button);
    engridDiv.appendChild(buttonContainer);
  }

  private addEventListeners() {
    const bodyMain = document.querySelector(".body-main") as HTMLElement;

    // Return early if formBlock is not found
    if (!bodyMain) return;

    // Define a function to toggle the button visibility based on the bodyMain position
    const toggleButton = () => {
      if (bodyMain.getBoundingClientRect().top <= window.innerHeight - 100) {
        this.hideButton();
      } else {
        this.showButton();
      }
    };

    toggleButton();

    // Add event listeners for load, resize, and scroll events to toggle the button visibility
    window.addEventListener("load", toggleButton);
    window.addEventListener("resize", toggleButton);
    window.addEventListener("scroll", toggleButton);
  }

  // Hide the button by setting the container's display style to "none"
  private hideButton() {
    const buttonContainer = document.querySelector(
      ".engrid-mobile-cta-container"
    ) as HTMLElement;
    if (buttonContainer) buttonContainer.classList.add("hide-cta");
  }

  // Show the button by setting the container's display style to "block"
  private showButton() {
    const buttonContainer = document.querySelector(
      ".engrid-mobile-cta-container"
    ) as HTMLElement;
    if (buttonContainer) buttonContainer.classList.remove("hide-cta");
  }
}

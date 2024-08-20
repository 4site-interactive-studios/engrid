// This component adds a floating CTA button to the page, which can be used to scroll to the top of the form
import { ENGrid } from "./";
export class MobileCTA {
    constructor() {
        var _a, _b, _c;
        // Initialize options with the MobileCTA value or false
        this.options = (_a = ENGrid.getOption("MobileCTA")) !== null && _a !== void 0 ? _a : false;
        this.buttonLabel = "";
        // Return early if the options object is falsy or the current page type is not in the options.pages array
        if (!this.options ||
            !((_b = this.options.pages) === null || _b === void 0 ? void 0 : _b.includes(ENGrid.getPageType())) ||
            ENGrid.getPageNumber() !== 1)
            return;
        // Set the button label using the options.label or the default value "Take Action"
        this.buttonLabel = (_c = this.options.label) !== null && _c !== void 0 ? _c : "Take Action";
        this.renderButton();
        this.addEventListeners();
    }
    renderButton() {
        const engridDiv = document.querySelector("#engrid");
        const formBlock = document.querySelector(".body-main .en__component--widgetblock:first-child, .en__component--formblock");
        // Return early if engridDiv or formBlock are not found
        if (!engridDiv || !formBlock)
            return;
        const buttonContainer = document.createElement("div");
        const button = document.createElement("button");
        // Add necessary classes and set the initial display style for the button container
        buttonContainer.classList.add("engrid-mobile-cta-container");
        buttonContainer.style.display = "none";
        button.classList.add("primary");
        // Set the button's innerHTML and add a click event listener
        button.innerHTML = this.buttonLabel;
        button.addEventListener("click", () => {
            formBlock.scrollIntoView({ behavior: "smooth" });
        });
        // Append the button to the button container and the container to engridDiv
        buttonContainer.appendChild(button);
        engridDiv.appendChild(buttonContainer);
    }
    addEventListeners() {
        const bodyMain = document.querySelector(".body-main");
        // Return early if formBlock is not found
        if (!bodyMain)
            return;
        // Define a function to toggle the button visibility based on the bodyMain position
        const toggleButton = () => {
            if (bodyMain.getBoundingClientRect().top <= window.innerHeight - 100) {
                this.hideButton();
            }
            else {
                this.showButton();
            }
        };
        // Add event listeners for load, resize, and scroll events to toggle the button visibility
        window.addEventListener("load", toggleButton);
        window.addEventListener("resize", toggleButton);
        window.addEventListener("scroll", toggleButton);
    }
    // Hide the button by setting the container's display style to "none"
    hideButton() {
        const buttonContainer = document.querySelector(".engrid-mobile-cta-container");
        if (buttonContainer)
            buttonContainer.style.display = "none";
    }
    // Show the button by setting the container's display style to "block"
    showButton() {
        const buttonContainer = document.querySelector(".engrid-mobile-cta-container");
        if (buttonContainer)
            buttonContainer.style.display = "block";
    }
}

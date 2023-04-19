// This component adds a floating CTA button to the page, which can be used to scroll to the top of the form
import { ENGrid } from "./";
export class MobileCTA {
    constructor() {
        var _a, _b, _c;
        this.options = ENGrid.getOption("MobileCTA") || false;
        this.buttonLabel = "";
        if (this.options === false ||
            !((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.pages) === null || _b === void 0 ? void 0 : _b.includes(ENGrid.getPageType())))
            return;
        this.buttonLabel = ((_c = this.options) === null || _c === void 0 ? void 0 : _c.label) || "Take Action";
        this.renderButton();
        this.addEventListeners();
    }
    renderButton() {
        const engridDiv = document.querySelector("#engrid");
        const buttonContainer = document.createElement("div");
        const button = document.createElement("button");
        const formBlock = document.querySelector(".en__component--formblock");
        buttonContainer.classList.add("engrid-mobile-cta-container");
        buttonContainer.style.display = "none";
        button.classList.add("primary");
        button.innerHTML = this.buttonLabel;
        button.addEventListener("click", () => {
            formBlock.scrollIntoView({
                behavior: "smooth",
            });
        });
        buttonContainer.appendChild(button);
        if (engridDiv)
            engridDiv.appendChild(buttonContainer);
    }
    addEventListeners() {
        const formBlock = document.querySelector(".body-main");
        const toggleButton = () => {
            if (formBlock.getBoundingClientRect().top <= window.innerHeight - 100) {
                this.hideButton();
            }
            else {
                this.showButton();
            }
        };
        // When the page loads, resizes or scrolls, toggle the button visibility
        window.addEventListener("load", toggleButton);
        window.addEventListener("resize", toggleButton);
        window.addEventListener("scroll", toggleButton);
    }
    hideButton() {
        const buttonContainer = document.querySelector(".engrid-mobile-cta-container");
        if (buttonContainer)
            buttonContainer.style.display = "none";
    }
    showButton() {
        const buttonContainer = document.querySelector(".engrid-mobile-cta-container");
        if (buttonContainer)
            buttonContainer.style.display = "block";
    }
}

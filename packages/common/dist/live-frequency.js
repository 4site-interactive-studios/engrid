// This script creates merge tags: [[frequency]], [[Frequency]], or [[FREQUENCY]]
// that gets replaced with the donation frequency
// and can be used on any Code Block, Text Block, or Form Block
import { DonationAmount, DonationFrequency, EngridLogger } from ".";
export class LiveFrequency {
    constructor() {
        this.logger = new EngridLogger("LiveFrequency", "#00ff00", "#000000", "🧾");
        this.elementsFound = false;
        this._amount = DonationAmount.getInstance();
        this._frequency = DonationFrequency.getInstance();
        this.searchElements();
        if (!this.shouldRun())
            return;
        this.updateFrequency();
        this.addEventListeners();
    }
    searchElements() {
        const enElements = document.querySelectorAll(`
      .en__component--copyblock,
      .en__component--codeblock,
      .en__field label,
      .en__submit
      `);
        if (enElements.length > 0) {
            const pattern = /\[\[(frequency)\]\]/gi;
            let totalFound = 0;
            enElements.forEach((item) => {
                const match = item.innerHTML.match(pattern);
                if (item instanceof HTMLElement && match) {
                    this.elementsFound = true;
                    match.forEach((matchedSubstring) => {
                        totalFound++;
                        this.replaceMergeTags(matchedSubstring, item);
                    });
                }
            });
            if (totalFound > 0) {
                this.logger.log(`Found ${totalFound} merge tag${totalFound > 1 ? "s" : ""} in the page.`);
            }
        }
    }
    shouldRun() {
        if (!this.elementsFound) {
            this.logger.log("No merge tags found. Skipping.");
            return false;
        }
        return true;
    }
    addEventListeners() {
        this._amount.onAmountChange.subscribe(() => {
            setTimeout(() => {
                this.updateFrequency();
            }, 10);
        });
        this._frequency.onFrequencyChange.subscribe(() => {
            setTimeout(() => {
                this.searchElements();
                this.updateFrequency();
            }, 10);
        });
    }
    updateFrequency() {
        const frequency = this._frequency.frequency === "onetime"
            ? "one-time"
            : this._frequency.frequency;
        const elemenst = document.querySelectorAll(".engrid-frequency");
        elemenst.forEach((item) => {
            if (item.classList.contains("engrid-frequency--lowercase")) {
                item.innerHTML = frequency.toLowerCase();
            }
            else if (item.classList.contains("engrid-frequency--capitalized")) {
                item.innerHTML = frequency.charAt(0).toUpperCase() + frequency.slice(1);
            }
            else if (item.classList.contains("engrid-frequency--uppercase")) {
                item.innerHTML = frequency.toUpperCase();
            }
            else {
                item.innerHTML = frequency;
            }
        });
    }
    replaceMergeTags(tag, element) {
        const frequency = this._frequency.frequency === "onetime"
            ? "one-time"
            : this._frequency.frequency;
        const frequencyElement = document.createElement("span");
        frequencyElement.classList.add("engrid-frequency");
        frequencyElement.innerHTML = frequency;
        switch (tag) {
            case "[[frequency]]":
                frequencyElement.classList.add("engrid-frequency--lowercase");
                frequencyElement.innerHTML = frequencyElement.innerHTML.toLowerCase();
                element.innerHTML = element.innerHTML.replace(tag, frequencyElement.outerHTML);
                break;
            case "[[Frequency]]":
                frequencyElement.classList.add("engrid-frequency--capitalized");
                frequencyElement.innerHTML =
                    frequencyElement.innerHTML.charAt(0).toUpperCase() +
                        frequencyElement.innerHTML.slice(1);
                element.innerHTML = element.innerHTML.replace(tag, frequencyElement.outerHTML);
                break;
            case "[[FREQUENCY]]":
                frequencyElement.classList.add("engrid-frequency--uppercase");
                frequencyElement.innerHTML = frequencyElement.innerHTML.toUpperCase();
                element.innerHTML = element.innerHTML.replace(tag, frequencyElement.outerHTML);
                break;
        }
    }
}

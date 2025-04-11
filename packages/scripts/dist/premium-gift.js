// Component to handle premium gift features
// 1 - Add a class to body to indicate which premium gift is selected (data-engrid-premium-gift-name="item-name-slugged")
// 2 - Add a class to body to indicate if the "maximize my impact" is selected (data-engrid-premium-gift-maximize="true|false")
// 3 - Check the premium gift when click on the title or description
// 4 - Create new {$PREMIUMTITLE} merge tag that's replaced with the premium gift name
// 5 - Add aria-label to the radio inputs and alt tags to the images
// 6 - Update frequency label when clicking on the frequency radio inputs (this should probably be moved to another file)
import { ENGrid, EngridLogger } from ".";
export class PremiumGift {
    constructor() {
        this.logger = new EngridLogger("PremiumGift", "#232323", "#f7b500", "🎁");
        this.enElements = new Array();
        if (!this.shoudRun())
            return;
        this.searchElements();
        this.addEventListeners();
        this.checkPremiumGift();
        setTimeout(() => {
            this.altsAndArias();
            this.maxDonationAria();
        }, 1000);
        this.updateFrequencyLabel();
    }
    shoudRun() {
        return ("pageJson" in window &&
            "pageType" in window.pageJson &&
            window.pageJson.pageType === "premiumgift");
    }
    addEventListeners() {
        ["click", "change"].forEach((event) => {
            document.addEventListener(event, (e) => {
                const element = e.target;
                const premiumGift = element.closest(".en__pg__body");
                if (premiumGift) {
                    const premiumGiftInput = premiumGift.querySelector('[name="en__pg"]');
                    if ("type" in element === false) {
                        const premiumGiftValue = premiumGiftInput.value;
                        window.setTimeout(() => {
                            const newPremiumGift = document.querySelector('[name="en__pg"][value="' + premiumGiftValue + '"]');
                            if (newPremiumGift) {
                                newPremiumGift.checked = true;
                                newPremiumGift.dispatchEvent(new Event("change"));
                            }
                        }, 100);
                    }
                    window.setTimeout(() => {
                        this.checkPremiumGift();
                    }, 110);
                }
            });
        });
        // Check when visibility of the Premium Gift Block changes.
        // EN will add "display: none" to this element when the supporter does not qualify for a premium
        const premiumGiftsBlock = document.querySelector(".en__component--premiumgiftblock");
        if (premiumGiftsBlock) {
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === "attributes" &&
                        mutation.attributeName === "style") {
                        if (premiumGiftsBlock.style.display === "none") {
                            this.logger.log("Premium Gift Section hidden - removing premium gift body data attributes and premium title.");
                            ENGrid.setBodyData("premium-gift-maximize", false);
                            ENGrid.setBodyData("premium-gift-name", false);
                            this.setPremiumTitle("");
                        }
                    }
                }
            });
            observer.observe(premiumGiftsBlock, { attributes: true });
        }
    }
    checkPremiumGift() {
        const premiumGift = document.querySelector('[name="en__pg"]:checked');
        if (premiumGift) {
            const premiumGiftValue = premiumGift.value;
            this.logger.log("Premium Gift Value: " + premiumGiftValue);
            const premiumGiftContainer = premiumGift.closest(".en__pg");
            if (premiumGiftValue !== "0") {
                const premiumGiftName = premiumGiftContainer.querySelector(".en__pg__name");
                ENGrid.setBodyData("premium-gift-maximize", "false");
                ENGrid.setBodyData("premium-gift-name", ENGrid.slugify(premiumGiftName.innerText));
                this.setPremiumTitle(premiumGiftName.innerText);
            }
            else {
                ENGrid.setBodyData("premium-gift-maximize", "true");
                ENGrid.setBodyData("premium-gift-name", false);
                this.setPremiumTitle("");
            }
            if (!premiumGiftContainer.classList.contains("en__pg--selected")) {
                const checkedPremiumGift = document.querySelector(".en__pg--selected");
                if (checkedPremiumGift) {
                    checkedPremiumGift.classList.remove("en__pg--selected");
                }
                premiumGiftContainer.classList.add("en__pg--selected");
            }
        }
    }
    searchElements() {
        const enElements = document.querySelectorAll(`
      .en__component--copyblock,
      .en__component--codeblock,
      .en__field
      `);
        if (enElements.length > 0) {
            enElements.forEach((item) => {
                if (item instanceof HTMLElement &&
                    item.innerHTML.includes("{$PREMIUMTITLE}")) {
                    item.innerHTML = item.innerHTML.replace("{$PREMIUMTITLE}", `<span class="engrid_premium_title"></span>`);
                    this.enElements.push(item);
                }
            });
        }
    }
    setPremiumTitle(title) {
        this.enElements.forEach((item) => {
            const premiumTitle = item.querySelector(".engrid_premium_title");
            if (premiumTitle) {
                premiumTitle.innerHTML = title;
            }
        });
    }
    // Sets alt tags for premium gift images and aria tags for premium gift radio inputs
    altsAndArias() {
        const premiumTitle = document.querySelectorAll(".en__pg__detail h2.en__pg__name");
        const multistepBackButton = document.querySelectorAll('.multistep-button-container button.btn-back');
        premiumTitle.forEach((item) => {
            if (item) {
                const titleText = item.innerHTML;
                const parent = item.parentElement;
                const prevSibling = parent === null || parent === void 0 ? void 0 : parent.previousElementSibling;
                const radioInputSibling = prevSibling === null || prevSibling === void 0 ? void 0 : prevSibling.previousElementSibling;
                if (prevSibling) {
                    const imageDiv = prevSibling.querySelector('.en__pg__images');
                    if (imageDiv) {
                        const img = imageDiv.querySelector('img');
                        if (img) {
                            console.log('setting image alt, width, height');
                            img.setAttribute('alt', titleText);
                            img.style.width = '125px';
                            img.style.height = '100px';
                        }
                    }
                }
                if (radioInputSibling) {
                    const radioInput = radioInputSibling.querySelector('input[type="radio"]');
                    if (radioInput) {
                        radioInput.setAttribute('aria-label', titleText);
                    }
                }
            }
            multistepBackButton.forEach((item) => {
                item.setAttribute('aria-label', 'Back');
            });
        });
    }
    // This is for the Maximize My Donation aria-label - the tree structure for it is slightly different.
    maxDonationAria() {
        const maxDonationTitle = Array.from(document.querySelectorAll(".en__pg__detail"))
            .filter(el => !el.querySelector("h2"));
        maxDonationTitle.forEach((item) => {
            var _a;
            if (item) {
                const titleText = ((_a = item.querySelector('.en__pg__description')) === null || _a === void 0 ? void 0 : _a.innerHTML) || '';
                const prevSibling = item.previousElementSibling;
                const radioInputSibling = prevSibling === null || prevSibling === void 0 ? void 0 : prevSibling.previousElementSibling;
                if (radioInputSibling) {
                    const radioInput = radioInputSibling.querySelector('input[type="radio"]');
                    if (radioInput) {
                        radioInput.setAttribute('aria-label', titleText);
                    }
                }
            }
        });
    }
    updateFrequencyLabel() {
        const frequencyLabels = document.querySelectorAll('div.en__field__item input[id^="en__field_transaction_recurrfreq"]');
        const frequencyMainLabel = document.querySelector('label[for="en__field_transaction_recurrfreq"]');
        frequencyLabels.forEach((item) => {
            if (item) {
                item.addEventListener('click', () => {
                    let frequencyId = item.id;
                    frequencyMainLabel === null || frequencyMainLabel === void 0 ? void 0 : frequencyMainLabel.setAttribute('for', frequencyId);
                });
            }
        });
    }
}

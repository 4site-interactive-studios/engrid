// Component to handle premium gift features
// 1 - Add a class to body to indicate which premium gift is selected (data-engrid-premium-gift-name="item-name-slugged")
// 2 - Add a class to body to indicate if the "maximize my impact" is selected (data-engrid-premium-gift-maximize="true|false")
// 3 - Check the premium gift when click on the title or description
// 4 - Create new {$PREMIUMTITLE} merge tag that's replaced with the premium gift name
// 5 - Add aria-label to the radio inputs and alt tags to the images

import { ENGrid, DonationFrequency, DonationAmount, EngridLogger } from ".";

export class PremiumGift {
  private logger: EngridLogger = new EngridLogger(
    "PremiumGift",
    "#232323",
    "#f7b500",
    "🎁"
  );
  private enElements: Array<HTMLElement> = new Array<HTMLElement>();
  private _frequency: DonationFrequency = DonationFrequency.getInstance();
  private _amount: DonationAmount = DonationAmount.getInstance();
  constructor() {
    if (!this.shoudRun()) return;
    this.searchElements();
    this.addEventListeners();
    this.checkPremiumGift();
    window.setTimeout(() => {
      this.altsAndArias();
      this.maxDonationAria();
    }, 1000);
  }
  shoudRun() {
    return (
      "pageJson" in window &&
      "pageType" in window.pageJson &&
      window.pageJson.pageType === "premiumgift"
    );
  }
  addEventListeners() {
    ["click", "change"].forEach((event) => {
      document.addEventListener(event, (e) => {
        const element = e.target as HTMLElement | HTMLInputElement;
        const premiumGift = element.closest(".en__pg__body");
        if (premiumGift) {
          const premiumGiftInput = premiumGift.querySelector(
            '[name="en__pg"]'
          ) as HTMLInputElement;
          if ("type" in element === false) {
            const premiumGiftValue = premiumGiftInput.value;
            window.setTimeout(() => {
              const newPremiumGift = document.querySelector(
                '[name="en__pg"][value="' + premiumGiftValue + '"]'
              ) as HTMLInputElement;
              if (newPremiumGift) {
                newPremiumGift.checked = true;
                newPremiumGift.dispatchEvent(new Event("change"));
                this.altsAndArias();
              }
            }, 100);
          }
          window.setTimeout(() => {
            this.checkPremiumGift();
            this.altsAndArias();
            this.maxDonationAria();
          }, 110);
        }
      });
    });

    // Check when visibility of the Premium Gift Block changes.
    // EN will add "display: none" to this element when the supporter does not qualify for a premium
    const premiumGiftsBlock: HTMLElement | null = document.querySelector(
      ".en__component--premiumgiftblock"
    );
    if (premiumGiftsBlock) {
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            if (premiumGiftsBlock.style.display === "none") {
              this.logger.log(
                "Premium Gift Section hidden - removing premium gift body data attributes and premium title."
              );
              ENGrid.setBodyData("premium-gift-maximize", false);
              ENGrid.setBodyData("premium-gift-name", false);
              this.setPremiumTitle("");
            }
          }
        }
      });
      observer.observe(premiumGiftsBlock, { attributes: true });
    }
    this._frequency.onFrequencyChange.subscribe(() => {
      window.setTimeout(() => {
        this.altsAndArias();
      }, 1000);
    });

    this._amount.onAmountChange.subscribe(() => {
      window.setTimeout(() => {
        this.altsAndArias();
      }, 1000);
    });
  }

  checkPremiumGift() {
    const premiumGift = document.querySelector(
      '[name="en__pg"]:checked'
    ) as HTMLInputElement;
    if (premiumGift) {
      const premiumGiftValue = premiumGift.value;
      this.logger.log("Premium Gift Value: " + premiumGiftValue);
      const premiumGiftContainer = premiumGift.closest(
        ".en__pg"
      ) as HTMLElement;
      if (premiumGiftValue !== "0") {
        const premiumGiftName = premiumGiftContainer.querySelector(
          ".en__pg__name"
        ) as HTMLHeadingElement;
        ENGrid.setBodyData("premium-gift-maximize", "false");
        ENGrid.setBodyData(
          "premium-gift-name",
          ENGrid.slugify(premiumGiftName.innerText)
        );
        this.setPremiumTitle(premiumGiftName.innerText);
      } else {
        ENGrid.setBodyData("premium-gift-maximize", "true");
        ENGrid.setBodyData("premium-gift-name", false);
        this.setPremiumTitle("");
      }
      if (!premiumGiftContainer.classList.contains("en__pg--selected")) {
        const checkedPremiumGift = document.querySelector(
          ".en__pg--selected"
        ) as HTMLElement;
        if (checkedPremiumGift) {
          checkedPremiumGift.classList.remove("en__pg--selected");
        }
        premiumGiftContainer.classList.add("en__pg--selected");
      }
    }
  }
  searchElements() {
    const enElements = document.querySelectorAll(
      `
      .en__component--copyblock,
      .en__component--codeblock,
      .en__field
      `
    );
    if (enElements.length > 0) {
      enElements.forEach((item) => {
        if (
          item instanceof HTMLElement &&
          item.innerHTML.includes("{$PREMIUMTITLE}")
        ) {
          item.innerHTML = item.innerHTML.replace(
            "{$PREMIUMTITLE}",
            `<span class="engrid_premium_title"></span>`
          );
          this.enElements.push(item);
        }
      });
    }
  }

  setPremiumTitle(title: string) {
    this.enElements.forEach((item) => {
      const premiumTitle = item.querySelector(".engrid_premium_title");
      if (premiumTitle) {
        premiumTitle.innerHTML = title;
      }
    });
  }

  // Sets alt tags for premium gift images and aria tags for premium gift radio inputs
  altsAndArias() {
    const premiumHeader = document.querySelector(".en__pgHeader");
    const radioGroup = document.querySelector(".en__pgList");
    if (premiumHeader && radioGroup) {
      const premiumHeaderId = premiumHeader.id || "premium-gift-header";
      premiumHeader.setAttribute("id", premiumHeaderId);
      radioGroup.setAttribute("aria-labelledby", premiumHeaderId);
      radioGroup.setAttribute("role", "radiogroup");
    }

    const multistepBackButton = document.querySelectorAll(
      ".multistep-button-container button.btn-back"
    );
    multistepBackButton.forEach((item) => {
      item.setAttribute("aria-label", "Back");
    });
    const premiumRow = document.querySelectorAll<HTMLElement>(".en__pg");
    premiumRow.forEach((item) => {
      const premiumTitle = item.querySelector(
        ".en__pg__detail h2.en__pg__name"
      );
      const titleText = premiumTitle?.innerHTML || "";
      const premiumGiftInput = item.querySelector(
        'input[name="en__pg"]'
      ) as HTMLInputElement | null;
      const premiumGiftId = premiumGiftInput?.value || ENGrid.slugify(titleText);
      premiumTitle?.setAttribute("id", `premium-gift-option-${premiumGiftId}`);
      const details = item.querySelector(".en__pg__detail");
      const display = item.querySelector(".en__pg__display");
      const select = item.querySelector(".en__pg__select");

      if (select) {
        const radioInput = select.querySelector('input[type="radio"]') as HTMLInputElement;
        if (radioInput) {
          radioInput.setAttribute("aria-labelledby", premiumTitle?.id || "");
        }
      }

      if (details) {
        const optionTypesParent = details.querySelector(".en__pg__optionTypes");
        if (optionTypesParent) {
          this.altsAndAriasForSelects(optionTypesParent, titleText, premiumGiftId);
        }
      }

      if (display) {
        const imageDiv = display.querySelector(".en__pg__images");
        if (imageDiv) {
          const img = imageDiv.querySelector("img");
          if (img) {
            img.setAttribute("alt", titleText);
            img.style.width = "125px";
            img.style.height = "100px";
          }
        }

      }
    });
    this.syncOptionSelectStates();
  }

  syncOptionSelectStates() {
    const premiumRows = document.querySelectorAll<HTMLElement>(".en__pg");
    premiumRows.forEach((row) => {
      const radioInput = row.querySelector(
        'input[name="en__pg"]'
      ) as HTMLInputElement | null;
      const optionSelects = row.querySelectorAll<HTMLSelectElement>(
        ".en__pg__optionType select"
      );
      optionSelects.forEach((select) => {
        select.disabled = !radioInput?.checked;
      });
    });
  }

  altsAndAriasForSelects(optionTypesParent: Element, titleText: string, premiumGiftId: string) {
    optionTypesParent.setAttribute("aria-label", `Options for ${titleText}`);
    const optionTypes = optionTypesParent.querySelectorAll(".en__pg__optionType");
    optionTypes.forEach((option, index) => {
      const label = option.querySelector("label");
      const select = option.querySelector('select');
      if (label && select) {
        const labelId = ENGrid.slugify(label.innerText) || index.toString();
        select.setAttribute("id", `premium-gift-option-type-${premiumGiftId}-${labelId}`);
        label.setAttribute("for", select.id);
        label.setAttribute("aria-label", `${label.innerText} for ${titleText}`);
      }
    });
  }


  // This is for the Maximize My Donation aria-label - the tree structure for it is slightly different.
  maxDonationAria() {
    const maxDonationTitle = Array.from(
      document.querySelectorAll(".en__pg__detail")
    ).filter((el) => !el.querySelector("h2"));
    maxDonationTitle.forEach((item) => {
      if (item) {
        const titleText =
          item.querySelector(".en__pg__description")?.innerHTML || "";
        const prevSibling = item.previousElementSibling;
        const radioInputSibling = prevSibling?.previousElementSibling;

        if (radioInputSibling) {
          const radioInput = radioInputSibling.querySelector(
            'input[type="radio"]'
          );
          if (radioInput) {
            radioInput.setAttribute("aria-label", titleText);
          }
        }
      }
    });
  }
}

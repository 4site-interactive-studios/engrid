// Component to handle premium gift features
// 1 - Add a class to body to indicate which premium gift is selected (data-engrid-premium-gift-name="item-name-slugged")
// 2 - Add a class to body to indicate if the "maximize my impact" is selected (data-engrid-premium-gift-maximize="true|false")
// 3 - Check the premium gift when click on the title or description
// 4 - Create new {$PREMIUMTITLE} merge tag that's replaced with the premium gift name

import { ENGrid, EngridLogger } from ".";

export class PremiumGift {
  private logger: EngridLogger = new EngridLogger(
    "PremiumGift",
    "#232323",
    "#f7b500",
    "🎁"
  );
  private enElements: Array<HTMLElement> = new Array<HTMLElement>();
  constructor() {
    if (!this.shoudRun()) return;
    this.searchElements();
    this.addEventListeners();
    this.checkPremiumGift();
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
}

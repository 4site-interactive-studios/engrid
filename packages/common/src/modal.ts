import * as cookie from "./cookie";
import { DonationAmount, DonationFrequency, EnForm } from "./events";

export class Modal {
  public debug: boolean | undefined = false;
  private overlay: HTMLDivElement;
  private upsellModal: HTMLElement | null;
  private exitModal: HTMLElement | null;
  private _amount: DonationAmount = DonationAmount.getInstance();
  private _frequency: DonationFrequency = DonationFrequency.getInstance();
  private _form: EnForm = EnForm.getInstance();

  constructor() {
    this.upsellModal = document.getElementById("upsellModal");
    this.exitModal = document.getElementById("exitModal");
    const markup = `
    <div class="enModal-container">
        <a href="#" class="button-close"></a>
        <div id="enModalContent">
        </div>
    </div>`;
    let overlay = document.createElement("div");
    overlay.id = "enModal";
    overlay.classList.add("is-hidden");
    overlay.innerHTML = markup;
    const closeButton = overlay.querySelector(
      ".button-close"
    ) as HTMLLinkElement;
    closeButton.addEventListener("click", this.close.bind(this));
    document.addEventListener("keyup", e => {
      if (e.key === "Escape") {
        closeButton.click();
      }
    });
    this.overlay = overlay;
    document.body.appendChild(overlay);

    if (this.upsellModal) {
      this._form.onSubmit.subscribe(() => this.openUpsell());
    }
    if (this.exitModal) {
      document.addEventListener("mouseout", (evt: any) => {
        // Only open the exit modal if you're currently seeing the upSell Modal
        if (
          evt.toElement === null &&
          evt.relatedTarget === null &&
          !this.overlay.classList.contains("is-hidden") &&
          !this.overlay.classList.contains("is-submitting") &&
          this.overlay.classList.contains("upsellModal")
        ) {
          // An intent to exit has happend
          this.open(this.exitModal);
        }
      });
    }
  }
  private openUpsell() {
    if (this.debug) console.log("Upsell Triggered");
    const freq = this._frequency.frequency;
    // Only open Upsell Modal if Frequency == once & if the Modal is closed
    if (freq == "once" && this.overlay.classList.contains("is-hidden")) {
      this.open(this.upsellModal);
      window.scrollTo(0, 0);
      // Avoid form submission so you can see the modal
      this._form.submit = false;
      return false;
    } else {
      // @TODO Only submits the form IF monthly (Delete this)
      this._form.submit = true;
      // @TODO Maybe we need to force a resubmit
      return true;
    }
  }
  private open(modal: HTMLElement | null) {
    // If we can't find modal, get out
    if (!modal) return;
    const hideModal = cookie.get("hide_upsellModal"); // Get cookie
    // If we have a cookie AND no Debug, get out
    if (hideModal && !this.debug) return;
    const overlayContent = this.overlay.querySelector(
      "#enModalContent"
    ) as HTMLDivElement;
    // Remove all classes from Overlay
    this.overlay.classList.remove("exitModal", "upsellModal");
    // Add current Modal Id to Overlay as Class
    this.overlay.classList.add(modal.id);
    // Add modal content to overlay
    overlayContent.innerHTML = modal.innerHTML;
    // Load Values
    this._amount.load();
    this._frequency.load();
    // @TODO After the Modal is open we need to find a way to register that there are new buttons with the "monthly-upsell" class that should be watched for clicks
    // Show Modal
    this.overlay.classList.remove("is-hidden");
  }
  private close(e: Event) {
    e.preventDefault();
    if (this.overlay.classList.contains("exitModal")) {
      this.open(this.upsellModal);
    } else {
      cookie.set("hide_upsellModal", "1", { expires: 1 }); // Create one day cookie
      this.overlay.classList.add("is-hidden");
    }
  }
}

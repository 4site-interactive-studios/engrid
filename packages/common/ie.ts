import * as cookie from "./cookie";

export default class IE {
    public debug: boolean = false;
    private overlay: HTMLDivElement = document.createElement("div");

    constructor() {
        const isIE = () => {
            return (navigator.userAgent.indexOf('MSIE') !== -1
                || navigator.appVersion.indexOf('Trident/') > -1);
        };
        // If it's not IE, get out!
        if (!isIE()) return;
        const markup = `
    <div class="ieModal-container">
        <a href="#" class="button-close"></a>
        <div id="ieModalContent">
        <strong>Attention: </strong>
        Your browser is no longer supported and will not receive any further security updates. Websites may no longer display or behave correctly as they have in the past. 
        Please transition to using <a href="https://www.microsoft.com/edge">Microsoft Edge</a>, Microsoft's latest browser, to continue enjoying the modern web.
        </div>
    </div>`;
        let overlay = document.createElement("div");
        overlay.id = "ieModal";
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
        this.open();
    }
    private open() {
        const hideModal = cookie.get("hide_ieModal"); // Get cookie
        // If we have a cookie AND no Debug, get out
        if (hideModal && !this.debug) return;
        // Show Modal
        this.overlay.classList.remove("is-hidden");
    }
    private close(e: Event) {
        e.preventDefault();
        cookie.set("hide_ieModal", "1", { expires: 1 }); // Create one day cookie
        this.overlay.classList.add("is-hidden");
    }
}

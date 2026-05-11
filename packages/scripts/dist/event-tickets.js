export class EventTickets {
    constructor() {
        this.formatTicketAmountsAsCurrency();
        this.showWaitlistLinkIfApplicable();
    }
    showWaitlistLinkIfApplicable() {
        const waitlistLink = document.querySelector(".waitlist-link a");
        if (!waitlistLink) {
            return;
        }
        document.querySelectorAll('.en__ticket').forEach((ticket) => {
            const soldOutMessage = ticket.querySelector(".en__ticket__soldout");
            if (soldOutMessage) {
                const waitlistClone = waitlistLink.cloneNode(true);
                waitlistClone.className = "waitlist-link";
                soldOutMessage.insertAdjacentElement("afterend", waitlistClone);
            }
        });
    }
    formatTicketAmountsAsCurrency() {
        const ticketCostElements = document.getElementsByClassName("en__ticket__field--cost");
        const ticketCurrencyElements = document.getElementsByClassName("en__ticket__currency");
        for (const ticketCurrencyElement of ticketCurrencyElements) {
            ticketCurrencyElement.classList.add("en__ticket__currency__hidden");
        }
        for (const ticketCostElement of ticketCostElements) {
            const ticketAmountElement = ticketCostElement.getElementsByClassName("en__ticket__price")[0];
            const ticketCurrencyElement = ticketCostElement.getElementsByClassName("en__ticket__currency")[0];
            const formatterOptions = {
                style: "currency",
                currency: ticketCurrencyElement.innerText,
            };
            let ticketAmountAsCurrency = Intl.NumberFormat(undefined, formatterOptions).format(Number(ticketAmountElement.innerText));
            if (ticketAmountAsCurrency.slice(-3) === ".00") {
                ticketAmountAsCurrency = ticketAmountAsCurrency.slice(0, -3);
            }
            ticketAmountElement.innerText = ticketAmountAsCurrency;
        }
    }
}

import { ENGrid, EngridLogger } from ".";
import { DonationAmount } from "./events";
export class ShowIfAmount {
    constructor() {
        this._amount = DonationAmount.getInstance();
        this.logger = new EngridLogger("ShowIfAmount", "yellow", "black", "👀");
        this._elements = document.querySelectorAll('[class*="showifamount"]');
        if (this._elements.length > 0) {
            this._amount.onAmountChange.subscribe(() => this.init());
            this.init();
            return;
        }
        this.logger.log("Show If Amount: NO ELEMENTS FOUND");
    }
    init() {
        //If we are on a thank you page, use the window.pageJson.amount
        const amount = ENGrid.getGiftProcess()
            ? window.pageJson.amount
            : this._amount.amount;
        this._elements.forEach((element) => {
            this.lessthan(amount, element);
            this.lessthanorequalto(amount, element);
            this.equalto(amount, element);
            this.greaterthanorequalto(amount, element);
            this.greaterthan(amount, element);
            this.between(amount, element);
        });
    }
    getClassNameByOperand(classList, operand) {
        let myClass = null;
        classList.forEach((className) => {
            if (className.includes(`showifamount-${operand}-`)) {
                myClass = className;
            }
        });
        return myClass;
    }
    lessthan(amount, element) {
        const showifamountClass = this.getClassNameByOperand(element.classList, "lessthan");
        if (showifamountClass) {
            let amountCheck = showifamountClass.split("-").slice(-1)[0];
            if (amount < Number(amountCheck)) {
                this.logger.log("(lessthan):", element);
                element.classList.add("engrid-open");
            }
            else {
                element.classList.remove("engrid-open");
            }
        }
    }
    lessthanorequalto(amount, element) {
        const showifamountClass = this.getClassNameByOperand(element.classList, "lessthanorequalto");
        if (showifamountClass) {
            let amountCheck = showifamountClass.split("-").slice(-1)[0];
            if (amount <= Number(amountCheck)) {
                this.logger.log("(lessthanorequalto):", element);
                element.classList.add("engrid-open");
            }
            else {
                element.classList.remove("engrid-open");
            }
        }
    }
    equalto(amount, element) {
        const showifamountClass = this.getClassNameByOperand(element.classList, "equalto");
        if (showifamountClass) {
            let amountCheck = showifamountClass.split("-").slice(-1)[0];
            if (amount == Number(amountCheck)) {
                this.logger.log("(equalto):", element);
                element.classList.add("engrid-open");
            }
            else {
                element.classList.remove("engrid-open");
            }
        }
    }
    greaterthanorequalto(amount, element) {
        const showifamountClass = this.getClassNameByOperand(element.classList, "greaterthanorequalto");
        if (showifamountClass) {
            let amountCheck = showifamountClass.split("-").slice(-1)[0];
            if (amount >= Number(amountCheck)) {
                this.logger.log("(greaterthanorequalto):", element);
                element.classList.add("engrid-open");
            }
            else {
                element.classList.remove("engrid-open");
            }
        }
    }
    greaterthan(amount, element) {
        const showifamountClass = this.getClassNameByOperand(element.classList, "greaterthan");
        if (showifamountClass) {
            let amountCheck = showifamountClass.split("-").slice(-1)[0];
            if (amount > Number(amountCheck)) {
                this.logger.log("(greaterthan):", element);
                element.classList.add("engrid-open");
            }
            else {
                element.classList.remove("engrid-open");
            }
        }
    }
    between(amount, element) {
        const showifamountClass = this.getClassNameByOperand(element.classList, "between");
        if (showifamountClass) {
            let amountCheckMin = showifamountClass.split("-").slice(-2, -1)[0];
            let amountCheckMax = showifamountClass.split("-").slice(-1)[0];
            if (amount > Number(amountCheckMin) && amount < Number(amountCheckMax)) {
                this.logger.log("(between):", element);
                element.classList.add("engrid-open");
            }
            else {
                element.classList.remove("engrid-open");
            }
        }
    }
}

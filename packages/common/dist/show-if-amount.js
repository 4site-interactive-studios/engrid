import { ENGrid } from ".";
import { DonationAmount } from "./events";
export class ShowIfAmount {
    constructor() {
        this._amount = DonationAmount.getInstance();
        this._elements = document.querySelectorAll('[class*="showifamount"]');
        if (this._elements.length > 0) {
            this._amount.onAmountChange.subscribe(() => this.init());
            this.init();
            return;
        }
        if (ENGrid.debug)
            console.log("Show If Amount: NO ELEMENTS FOUND");
    }
    init() {
        const amount = this._amount.amount;
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
                if (ENGrid.debug)
                    console.log("Show If Amount (lessthan):", element);
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
                if (ENGrid.debug)
                    console.log("Show If Amount (lessthanorequalto):", element);
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
                if (ENGrid.debug)
                    console.log("Show If Amount (equalto):", element);
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
                if (ENGrid.debug)
                    console.log("Show If Amount (greaterthanorequalto):", element);
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
                if (ENGrid.debug)
                    console.log("Show If Amount (greaterthan):", element);
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
            if (amount >= Number(amountCheckMin) &&
                amount <= Number(amountCheckMax)) {
                if (ENGrid.debug)
                    console.log("Show If Amount (between):", element);
                element.classList.add("engrid-open");
            }
            else {
                element.classList.remove("engrid-open");
            }
        }
    }
}

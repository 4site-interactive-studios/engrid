import { ENGrid, EngridLogger } from ".";
import { DonationAmount } from "./events";

export class ShowIfAmount {
  public _amount: DonationAmount = DonationAmount.getInstance();
  private _elements: NodeListOf<HTMLElement>;
  private logger: EngridLogger = new EngridLogger(
    "ShowIfAmount",
    "yellow",
    "black",
    "👀"
  );

  constructor() {
    this._elements = document.querySelectorAll('[class*="showifamount"]');
    if (this._elements.length > 0) {
      this._amount.onAmountChange.subscribe(() => this.init());
      this.init();
      return;
    }
    this.logger.log("Show If Amount: NO ELEMENTS FOUND");
  }
  private init() {
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
  private getClassNameByOperand(
    classList: DOMTokenList,
    operand: string
  ): string | null {
    let myClass = null;
    classList.forEach((className: string) => {
      if (className.includes(`showifamount-${operand}-`)) {
        myClass = className;
      }
    });
    return myClass;
  }
  private lessthan(amount: number, element: HTMLElement) {
    const showifamountClass = this.getClassNameByOperand(
      element.classList,
      "lessthan"
    );
    if (showifamountClass) {
      let amountCheck = showifamountClass.split("-").slice(-1)[0];
      if (amount < Number(amountCheck)) {
        this.logger.log("(lessthan):", element);
        element.classList.add("engrid-open");
      } else {
        element.classList.remove("engrid-open");
      }
    }
  }
  private lessthanorequalto(amount: number, element: HTMLElement) {
    const showifamountClass = this.getClassNameByOperand(
      element.classList,
      "lessthanorequalto"
    );
    if (showifamountClass) {
      let amountCheck = showifamountClass.split("-").slice(-1)[0];
      if (amount <= Number(amountCheck)) {
        this.logger.log("(lessthanorequalto):", element);
        element.classList.add("engrid-open");
      } else {
        element.classList.remove("engrid-open");
      }
    }
  }
  private equalto(amount: number, element: HTMLElement) {
    const showifamountClass = this.getClassNameByOperand(
      element.classList,
      "equalto"
    );
    if (showifamountClass) {
      let amountCheck = showifamountClass.split("-").slice(-1)[0];
      if (amount == Number(amountCheck)) {
        this.logger.log("(equalto):", element);
        element.classList.add("engrid-open");
      } else {
        element.classList.remove("engrid-open");
      }
    }
  }
  private greaterthanorequalto(amount: number, element: HTMLElement) {
    const showifamountClass = this.getClassNameByOperand(
      element.classList,
      "greaterthanorequalto"
    );
    if (showifamountClass) {
      let amountCheck = showifamountClass.split("-").slice(-1)[0];
      if (amount >= Number(amountCheck)) {
        this.logger.log("(greaterthanorequalto):", element);
        element.classList.add("engrid-open");
      } else {
        element.classList.remove("engrid-open");
      }
    }
  }
  private greaterthan(amount: number, element: HTMLElement) {
    const showifamountClass = this.getClassNameByOperand(
      element.classList,
      "greaterthan"
    );
    if (showifamountClass) {
      let amountCheck = showifamountClass.split("-").slice(-1)[0];
      if (amount > Number(amountCheck)) {
        this.logger.log("(greaterthan):", element);
        element.classList.add("engrid-open");
      } else {
        element.classList.remove("engrid-open");
      }
    }
  }
  private between(amount: number, element: HTMLElement) {
    const showifamountClass = this.getClassNameByOperand(
      element.classList,
      "between"
    );
    if (showifamountClass) {
      let amountCheckMin = showifamountClass.split("-").slice(-2, -1)[0];
      let amountCheckMax = showifamountClass.split("-").slice(-1)[0];
      if (amount > Number(amountCheckMin) && amount < Number(amountCheckMax)) {
        this.logger.log("(between):", element);
        element.classList.add("engrid-open");
      } else {
        element.classList.remove("engrid-open");
      }
    }
  }
}

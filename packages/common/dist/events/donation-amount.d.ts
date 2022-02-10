export declare class DonationAmount {
    private _onAmountChange;
    private _amount;
    private _radios;
    private _other;
    private _dispatch;
    private static instance;
    private constructor();
    static getInstance(radios?: string, other?: string): DonationAmount;
    get amount(): number;
    set amount(value: number);
    get onAmountChange(): import("strongly-typed-events").ISimpleEvent<number>;
    load(): void;
    setAmount(amount: number, dispatch?: boolean): void;
    clearOther(): void;
}

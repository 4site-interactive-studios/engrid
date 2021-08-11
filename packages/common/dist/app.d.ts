import { ENGrid, Options } from "./";
export declare class App extends ENGrid {
    private _form;
    private _fees;
    private _amount;
    private _frequency;
    private options;
    constructor(options: Options);
    private run;
    private onLoad;
    private onResize;
    private onValidate;
    private onSubmit;
    private onError;
    private inIframe;
    private shouldScroll;
    private loadIFrame;
    setDataAttributes(): void;
}

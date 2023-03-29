export declare class DebugPanel {
    private logger;
    private element;
    private currentTimestamp;
    static debugSessionStorageKey: string;
    private pageLayouts;
    private quickFills;
    constructor(pageLayouts: string[] | undefined);
    private loadDebugPanel;
    private switchENGridLayout;
    private setupLayoutSwitcher;
    private setupThemeSwitcher;
    private switchENGridTheme;
    private setupSubThemeSwitcher;
    private switchENGridSubtheme;
    private setupFormQuickfill;
    private setFieldValue;
    private getCurrentTimestamp;
    private createDebugSessionEndHandler;
    private setupEmbeddedLayoutSwitcher;
    private setupDebugLayoutSwitcher;
    private setupBrandingHtmlHandler;
}

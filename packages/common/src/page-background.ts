import { ENGrid } from "./engrid";

export class PageBackground extends ENGrid {
    // @TODO: Change page-backgroundImage to page-backgroundMedia
    private bgClass: string = 'page-backgroundImage';
    private pageBackground: HTMLElement = document.querySelector("." + this.bgClass) as HTMLElement;

    constructor() {
        super();
        // Finds any <img> added to the "backgroundImage" ENGRid section and sets it as the "--theme-page-backgroundImage-url" CSS Custom Property
        const pageBackgroundImg = this.pageBackground.querySelector("img") as HTMLImageElement;
        let pageBackgroundImgDataSrc = pageBackgroundImg?.getAttribute("data-src") as string;
        let pageBackgroundImgSrc = pageBackgroundImg?.src as string;

        if (this.pageBackground && pageBackgroundImgDataSrc) {
            console.log("A background image set in the page was found with a data-src value, setting it as --theme-page-backgroundImage-url", pageBackgroundImgDataSrc);
            pageBackgroundImgDataSrc = "url('" + pageBackgroundImgDataSrc + "')";
            this.pageBackground.style.setProperty('--theme-' + this.bgClass + '-url', pageBackgroundImgDataSrc);
        } else if (this.pageBackground && pageBackgroundImgSrc) {
            console.log("A background image set in the page was found with a src value, setting it as --theme-page-backgroundImage-url", pageBackgroundImgSrc);
            pageBackgroundImgSrc = "url('" + pageBackgroundImgSrc + "')";
            this.pageBackground.style.setProperty('--theme-' + this.bgClass + '-url', pageBackgroundImgSrc);
        } else if (pageBackgroundImg) {
            console.log("A background image set in the page was found but without a data-src or src value, no action taken", pageBackgroundImg);
        } else {
            console.log("A background image set in the page was not found, any default image set in the theme on --theme-page-backgroundImage-url will be used");
        }
        this.setDataAttributes();
    }
    private setDataAttributes() {
        if (this.hasVideoBackground()) return PageBackground.setBodyData('page-background', 'video');
        if (this.hasImageBackground()) return PageBackground.setBodyData('page-background', 'image');
        return PageBackground.setBodyData('page-background', 'empty');
    }
    private hasVideoBackground() {
        return !!this.pageBackground.querySelector('video');
    }
    private hasImageBackground() {
        return !this.hasVideoBackground() && !!this.pageBackground.querySelector('img');
    }
}

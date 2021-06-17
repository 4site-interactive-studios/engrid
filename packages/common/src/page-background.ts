import { ENGrid } from "./engrid";

export class PageBackground {
    // @TODO: Change page-backgroundImage to page-backgroundMedia
    private bgClass: string = 'page-backgroundImage';
    private pageBackground: HTMLElement = document.querySelector("." + this.bgClass) as HTMLElement;

    constructor() {
        // Finds any <img> added to the "backgroundImage" ENGRid section and sets it as the "--engrid-page_backgroundImage-url" CSS Custom Property
        if(this.pageBackground){
            const pageBackgroundImg = this.pageBackground.querySelector("img") as HTMLImageElement;
            let pageBackgroundImgDataSrc = pageBackgroundImg?.getAttribute("data-src") as string;
            let pageBackgroundImgSrc = pageBackgroundImg?.src as string;

            if (this.pageBackground && pageBackgroundImgDataSrc) {
                if (ENGrid.debug) console.log("A background image set in the page was found with a data-src value, setting it as --engrid-page_backgroundImage-url", pageBackgroundImgDataSrc);
                pageBackgroundImgDataSrc = "url('" + pageBackgroundImgDataSrc + "')";
                this.pageBackground.style.setProperty('--' + this.bgClass + '-url', pageBackgroundImgDataSrc);
            } else if (this.pageBackground && pageBackgroundImgSrc) {
                if (ENGrid.debug) console.log("A background image set in the page was found with a src value, setting it as --engrid-page_backgroundImage-url", pageBackgroundImgSrc);
                pageBackgroundImgSrc = "url('" + pageBackgroundImgSrc + "')";
                this.pageBackground.style.setProperty('--' + this.bgClass + '-url', pageBackgroundImgSrc);
            } else if (pageBackgroundImg) {
                if (ENGrid.debug) console.log("A background image set in the page was found but without a data-src or src value, no action taken", pageBackgroundImg);
            } else {
                if (ENGrid.debug) console.log("A background image set in the page was not found, any default image set in the theme on --engrid-page_backgroundImage-url will be used");
            }
        } else {
            if (ENGrid.debug) console.log("A background image set in the page was not found, any default image set in the theme on --engrid-page_backgroundImage-url will be used");
        }

        this.setDataAttributes();
    }
    private setDataAttributes() {
        if (this.hasVideoBackground()) return ENGrid.setBodyData('page-background', 'video');
        if (this.hasImageBackground()) return ENGrid.setBodyData('page-background', 'image');
        return ENGrid.setBodyData('page-background', 'empty');
    }
    private hasVideoBackground() {
        return !!this.pageBackground.querySelector('video');
    }
    private hasImageBackground() {
        return !this.hasVideoBackground() && !!this.pageBackground.querySelector('img');
    }
}

import { ENGrid } from "./";
export const sendIframeHeight = () => {
    let height = document.body.offsetHeight;
    console.log("Sending iFrame height of: ", height, "px"); // check the message is being sent correctly
    window.parent.postMessage({
        frameHeight: height,
        pageNumber: ENGrid.getPageNumber(),
        pageCount: ENGrid.getPageCount(),
        giftProcess: ENGrid.getGiftProcess(),
    }, "*");
};
export const sendIframeFormStatus = (status) => {
    window.parent.postMessage({
        status: status,
        pageNumber: ENGrid.getPageNumber(),
        pageCount: ENGrid.getPageCount(),
        giftProcess: ENGrid.getGiftProcess(),
    }, "*");
};

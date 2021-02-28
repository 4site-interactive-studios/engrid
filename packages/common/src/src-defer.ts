// 4Site's simplified lazy loader for images and videos
// After DOMContentLoaded find all deferred image and video assets and process them.
// NOTE: Usually this is added right before </body> but in the event it's not we should still process all the assets.

export class SrcDefer{

    constructor() {

      let srcDefer = document.querySelectorAll("img[data-src], video[data-src]");
      window.addEventListener('DOMContentLoaded', (event) => {
        for (let i = 0; i < srcDefer.length; i++) {
          if (srcDefer[i].getAttribute("data-src")) {
            let dataSrc = srcDefer[i].getAttribute("data-src") as string;
            srcDefer[i].setAttribute("defer", "async"); // Gets image processing off the main working thread, does nothing for other video tags but doesn't hurt
            srcDefer[i].setAttribute("loading", "lazy"); // Lets the browser determine when the asset should be downloaded
            srcDefer[i].setAttribute("src", dataSrc); // Sets the src which will cause the browser to retrieve the asset
            srcDefer[i].setAttribute("data-engrid-src-processed", "true"); // Sets an attribute to mark that it has been processed by ENGrid
            srcDefer[i].removeAttribute("data-src"); // Removes the data-source
          }
        }
      });
    }

}


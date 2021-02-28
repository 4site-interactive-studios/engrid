// Build Notes: Inline vanilla Javascript version in the page template right before </body>
// In the event it's not inlined we should still process any assets with a data-src still defined on it

// // 4Site's simplified image and video lazy loader
// var srcDefer = document.querySelectorAll("img[data-src], video[data-src]");
// window.addEventListener('DOMContentLoaded', (event) => {
//   for (var i = 0; i < srcDefer.length; i++) {
//     let dataSrc = srcDefer[i].getAttribute("data-src");
//     if (dataSrc) {
//       srcDefer[i].setAttribute("defer", "async"); // Gets image processing off the main working thread, does nothing for video tags but doesn't hurt
//       srcDefer[i].setAttribute("loading", "lazy"); // Lets the browser determine when the asset should be downloaded
//       srcDefer[i].setAttribute("src", dataSrc); // Sets the src which will cause the browser to retrieve the asset
//       srcDefer[i].setAttribute("data-engrid-data-src-processed", "true"); // Sets an attribute to mark that it has been processed by ENGrid
//       srcDefer[i].removeAttribute("data-src"); // Removes the data-source
//     }
//   }
// });
export class SrcDefer{

  // Find all images and videos with a data-src defined
  public srcDefer = document.querySelectorAll("img[data-src], video[data-src]") as NodeListOf<Element>;
  
  constructor() {
    for (let i = 0; i < this.srcDefer.length; i++) {
      let dataSrc = this.srcDefer[i].getAttribute("data-src");
      if(dataSrc){
        this.srcDefer[i].setAttribute("defer", "async"); // Gets image processing off the main working thread, does nothing for video tags but doesn't hurt
        this.srcDefer[i].setAttribute("loading", "lazy"); // Lets the browser determine when the asset should be downloaded
        this.srcDefer[i].setAttribute("src", dataSrc); // Sets the src which will cause the browser to retrieve the asset
        this.srcDefer[i].setAttribute("data-engrid-data-src-processed", "true"); // Sets an attribute to mark that it has been processed by ENGrid
        this.srcDefer[i].removeAttribute("data-src"); // Removes the data-source
      }
    }
  }
}
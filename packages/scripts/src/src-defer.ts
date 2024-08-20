// Build Notes: Add the vanilla Javascript version inline inside the page template right before </body>
// In the event the vanilla javascript is not inlined we should still process any assets with a data-src still defined on it. Plus we only process background video via this JS file as to not block the page with a large video file downloading.

// // 4Site's simplified image lazy loader
// var srcDefer = document.querySelectorAll("img[data-src]");
// window.addEventListener('DOMContentLoaded', (event) => {
//   for (var i = 0; i < srcDefer.length; i++) {
//     let dataSrc = srcDefer[i].getAttribute("data-src");
//     if (dataSrc) {
//       srcDefer[i].setAttribute("decoding", "async"); // Gets image processing off the main working thread
//       srcDefer[i].setAttribute("loading", "lazy"); // Lets the browser determine when the asset should be downloaded
//       srcDefer[i].setAttribute("src", dataSrc); // Sets the src which will cause the browser to retrieve the asset
//       srcDefer[i].setAttribute("data-engrid-data-src-processed", "true"); // Sets an attribute to mark that it has been processed by ENGrid
//       srcDefer[i].removeAttribute("data-src"); // Removes the data-source
//     }
//   }
// });
export class SrcDefer {
  // Find all images and videos with a data-src defined
  public imgSrcDefer = document.querySelectorAll(
    "img[data-src]"
  ) as NodeListOf<Element>;
  public videoBackground = document.querySelectorAll(
    "video"
  ) as NodeListOf<Element>;
  public videoBackgroundSource = document.querySelectorAll(
    "video source"
  ) as NodeListOf<Element>;

  constructor() {
    // Process images
    for (let i = 0; i < this.imgSrcDefer.length; i++) {
      let img = this.imgSrcDefer[i] as HTMLImageElement;
      if (img) {
        img.setAttribute("decoding", "async"); // Gets image processing off the main working thread, and decodes the image asynchronously to reduce delay in presenting other content
        img.setAttribute("loading", "lazy"); // Lets the browser determine when the asset should be downloaded using it's native lazy loading
        let imgDataSrc = img.getAttribute("data-src");
        if (imgDataSrc) {
          img.setAttribute("src", imgDataSrc); // Sets the src which will cause the browser to retrieve the asset
        }
        img.setAttribute("data-engrid-data-src-processed", "true"); // Sets an attribute to mark that it has been processed by ENGrid
        img.removeAttribute("data-src"); // Removes the data-source
      }
    }

    // Process video
    for (let i = 0; i < this.videoBackground.length; i++) {
      let video = this.videoBackground[i] as HTMLVideoElement;

      // Process one or more defined sources in the <video> tag
      this.videoBackgroundSource = video.querySelectorAll("source");
      if (this.videoBackgroundSource) {
        // loop through all the sources
        for (let j = 0; j < this.videoBackgroundSource.length; j++) {
          let videoSource = this.videoBackgroundSource[j] as HTMLSourceElement;
          if (videoSource) {
            let videoBackgroundSourcedDataSrc = videoSource.getAttribute(
              "data-src"
            ) as string;
            if (videoBackgroundSourcedDataSrc) {
              videoSource.setAttribute("src", videoBackgroundSourcedDataSrc);
              videoSource.setAttribute(
                "data-engrid-data-src-processed",
                "true"
              ); // Sets an attribute to mark that it has been processed by ENGrid
              videoSource.removeAttribute("data-src"); // Removes the data-source
            }
          }
        }

        // To get the browser to request the video asset defined we need to remove the <video> tag and re-add it
        let videoBackgroundParent = video.parentNode; // Determine the parent of the <video> tag
        let copyOfVideoBackground = video; // Copy the <video> tag
        if (videoBackgroundParent && copyOfVideoBackground) {
          videoBackgroundParent.replaceChild(copyOfVideoBackground, video); // Replace the <video> with the copy of itself

          // Update the video to auto play, mute, loop
          video.muted = true; // Mute the video by default
          video.controls = false; // Hide the browser controls
          video.loop = true; // Loop the video
          video.playsInline = true; // Encourage the user agent to display video content within the element's playback area
          video.play(); // Plays the video
        }
      }
    }
  }
}

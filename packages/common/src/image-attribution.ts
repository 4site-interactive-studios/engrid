/*
  Looks for specially crafted <img> links and will transform its markup to display an attribution overlay on top of the image
  Depends on "_engrid-image-attribution.scss" for styling
  
  Example Input
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAADUlEQVR42mO8/5+BAQAGgwHgbKwW2QAAAABJRU5ErkJggg==" data-src="https://via.placeholder.com/300x300" data-attribution-source="Jane Doe 1">
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAADUlEQVR42mO8/5+BAQAGgwHgbKwW2QAAAABJRU5ErkJggg==" data-src="https://via.placeholder.com/300x300" data-attribution-source="John Doe 2" data-attribution-source-link="https%3A%2F%2Fwww.google.com%2F">
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAADUlEQVR42mO8/5+BAQAGgwHgbKwW2QAAAABJRU5ErkJggg==" data-src="https://via.placeholder.com/300x300" data-attribution-source="Max Doe 3" data-attribution-source-link="https%3A%2F%2Fwww.google.com%2F" data-attribution-hide-overlay>

  Example Output
  <figure class="image-with-attribution"><img src="https://via.placeholder.com/300x300" data-src="https://via.placeholder.com/300x300" data-attribution-source="Jane Doe 1"><figattribution class="attribution-bottomright">Jane Doe 1</figattribution></figure>
*/

export class ImageAttribution{

    // Find all images with attribution but not with the "data-attribution-hide-overlay" attribute
    imagesWithAttribution = document.querySelectorAll("div:not(.page-backgroundImage) [data-attribution-source]:not([data-attribution-hide-overlay])");
    constructor() {
        this.imagesWithAttribution.forEach((element) => {
            console.log("The following image was found with data attribution fields on it. It's markup will be changed to add caption support.", element);
            
            // Creates the wapping <figure> element
            let figure = document.createElement('figure');
            figure.classList.add("image-with-attribution");

            // Moves the <img> inside its <figure> element
            let imagesWithAttributionParent = element.parentNode;
            if(imagesWithAttributionParent){
                imagesWithAttributionParent.insertBefore(figure, element);
                figure.appendChild(element);

                let imagesWithAttributionElement = element as HTMLElement;
                // Append the <figcaption> element after the <img> and conditionally add the Source's Link to it
                let attributionSource = imagesWithAttributionElement.dataset.attributionSource;
                if (attributionSource){
                let attributionSourceLink = imagesWithAttributionElement.dataset.attributionSourceLink;
                    if (attributionSourceLink){
                        imagesWithAttributionElement.insertAdjacentHTML('afterend', '<figattribution class="attribution-bottomright"><a href="' + decodeURIComponent(attributionSourceLink) + '" target="_blank">' + attributionSource + '</a></figure>');
                    }else{
                        imagesWithAttributionElement.insertAdjacentHTML('afterend', '<figattribution class="attribution-bottomright">' + attributionSource + '</figure>');
                    }
                }
            }
        });
    }     
}
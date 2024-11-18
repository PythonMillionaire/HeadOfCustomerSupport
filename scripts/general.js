export function addOrReplaceEventListener(element, eventType, newListenerCallbackFunction) {
    if (!element) {
        console.error('@#$ Element not found for adding event listener.', eventType, newListenerCallbackFunction);
        return;
    }

    let lastListener = element['lastListener_' + eventType];

    // If there was a last listener, remove it
    if (lastListener) {
        //console.log(`@#$ Removing last listener for ${eventType} on element`, element);
        element.removeEventListener(eventType, lastListener);
    } else {
        //console.log(`@#$ No last listener found for ${eventType} on element`, element);
    }

    // Add the new event listener
    try {
        element.addEventListener(eventType, newListenerCallbackFunction);
    } catch(e) {
        console.log(`@#$ Adding new listener for ${eventType} on element`, element);
    }


    // Store the new listener as the last listener for this event type
    element['lastListener_' + eventType] = newListenerCallbackFunction;
}


export function createImageZoomOverlay(imageSrc, isNavigable = false) {
    // Remove existing overlay if present
    const existingOverlay = document.getElementById('image-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    // Create new overlay elements
    const overlay = document.createElement('div');
    overlay.id = 'image-overlay'; // Assign an ID to the overlay

    const enlargedImg = document.createElement('img');
    enlargedImg.src = imageSrc.replace('-thumbnail', '');
    enlargedImg.addEventListener('click', function() {
        window.open(enlargedImg.src, '_blank'); // Opens the image in a new tab
    })
    overlay.appendChild(enlargedImg);

    const closeButton = document.createElement('button');
    closeButton.id = 'close-overlay';
    closeButton.textContent = 'X';

    addOrReplaceEventListener(closeButton, 'click', function() {
        overlay.remove();
    });

    overlay.appendChild(closeButton);

    const nextButton = document.createElement('button');
    nextButton.classList.add('image-navigation-button');
    nextButton.id = 'overlay-next';
    nextButton.textContent = '>';

    const previousButton = nextButton.cloneNode(true);
    previousButton.classList.add('image-navigation-button');
    previousButton.id = 'overlay-previous';
    previousButton.textContent = '<';

    let currentImageIndex = parseInt(enlargedImg.src.split('-').pop().split('.')[0]) - 1;

    const images = document.querySelectorAll('#portfolio-item-image-gallery-thumbnails img');

    function updateButtons() {
        previousButton.classList.toggle('disabled-darker', currentImageIndex === 0);
        nextButton.classList.toggle('disabled-darker', currentImageIndex === images.length - 1);
    }

    function previousImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            enlargedImg.src = enlargedImg.src.replace(/-\d+\./, `-${currentImageIndex + 1}.`);
            updateButtons();
        }
    }

    function nextImage() {
        if (currentImageIndex < images.length - 1) {
            currentImageIndex++;
            enlargedImg.src = enlargedImg.src.replace(/-\d+\./, `-${currentImageIndex + 1}.`);
            updateButtons();
        }
    }

    addOrReplaceEventListener(previousButton, 'click', previousImage);

    addOrReplaceEventListener(nextButton, 'click', nextImage);

    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft')
            previousImage();
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight')
            nextImage();
    });

    if (isNavigable) {
        overlay.appendChild(previousButton);
        overlay.appendChild(nextButton);

        // Handle scroll event for navigation
        overlay.addEventListener('wheel', event => {
            event.preventDefault(); // Prevent the default scroll behavior

            if (event.deltaY < 0) {
                // Scrolling up
                nextImage();
            } else if (event.deltaY > 0) {
                // Scrolling down
                previousImage();
            }
        });
    }


    // Add overlay to the body
    document.body.appendChild(overlay);

    // Close overlay when clicking anywhere on the overlay
    addOrReplaceEventListener(overlay, 'click', function(event) {
        if (event.target.id === 'image-overlay')
            overlay.remove();
    });

    // Close overlay on pressing 'Esc' key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            overlay.remove();
        }
    }, { once: true });


    updateButtons();
}

export function handleZoomOverlayCreation(image, isNavigable = false) {
    return function() {
        createImageZoomOverlay(image.src, isNavigable);
    }
}

function setUpProjectImages() {
    const projectImages = document.querySelectorAll('.project-image img');

    projectImages.forEach(image => {
        addOrReplaceEventListener(image, 'click', handleZoomOverlayCreation(image));
    });
}

document.addEventListener('mainPageLoaded', () => {
    setUpProjectImages();
});

window.addEventListener('load', () => {
    setUpProjectImages();
});
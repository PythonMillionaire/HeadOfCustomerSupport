import {addOrReplaceEventListener} from "./general.js";
import {scrollToTop} from "./navigation.js";
import {stickyPoint} from "./visual-effects.js";

function equalizeHeights() {
    const elements = document.querySelectorAll('.project-description');
    let maxHeight = 0;

    // First pass: find the maximum height
    elements.forEach(element => {
        const elementHeight = element.offsetHeight;
        maxHeight = Math.max(maxHeight, elementHeight);
    });

    // Second pass: apply the maximum height to all elements
    elements.forEach(element => {
        element.style.height = maxHeight + 'px';
    });
}



window.addEventListener('load', equalizeHeights);

document.addEventListener('mainPageLoaded', equalizeHeights);


document.addEventListener('DOMContentLoaded', setUpScrollToTopButton);

function setUpScrollToTopButton() {
    let scrollToTopButton = document.getElementById("fixed-buttons");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () {
        scrollFunction();
    };

    function scrollFunction() {
        if (document.body.scrollTop > stickyPoint || document.documentElement.scrollTop > stickyPoint) {
            scrollToTopButton.style.display = "block";
        } else {
            scrollToTopButton.style.display = "none";
        }
    }

    function handleScrollToTop() {
        return scrollToTop(true);
    }

    addOrReplaceEventListener(scrollToTopButton, 'click', handleScrollToTop);
}
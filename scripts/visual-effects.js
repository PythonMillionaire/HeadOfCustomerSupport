import {addOrReplaceEventListener} from "./general.js";

window.addEventListener("load", initializeTypingEffect);
document.addEventListener("mainPageLoaded", initializeTypingEffect);

function initializeTypingEffect(){
    const textSection = document.querySelector("#h1-content");
    const cursorSpan = document.querySelector(".cursor-typing-effect");

    if (!textSection || !cursorSpan) return;

    const textArray = [
        "Customer Support Specialist.",
        "User Experience Engineer.",
        "Web Developer.",
        "Communications Expert."
    ];

    const erasingMethods = [
        eraseByHighlightingCharacters,
        eraseByErasingWords,
        eraseByHighlightingWords,
        eraseByErasingCharacters
    ];

    const typingDelay = 32;
    const erasingDelay = 20;
    const newTextDelay = 2500; // Delay between current and next text
    const noTextDelay = 200;   // Time without any text
    let textArrayIndex = 0;
    let charIndex = textArray[0].length - 1;

    function type() {
        cursorSpan.style.visibility = 'visible';

        if (charIndex < textArray[textArrayIndex].length) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");

            textSection.innerHTML = `<span>${textArray[textArrayIndex].substring(0, charIndex + 1)}</span>`;
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        erasingMethods[textArrayIndex]();
    }

    function moveToNextText() {
        cursorSpan.classList.remove("typing");
        textArrayIndex = (textArrayIndex + 1) % textArray.length;
        charIndex = 0; // Reset charIndex for the new phrase
        setTimeout(type, noTextDelay + 1100);
    }

    // Erasing Methods
    function eraseByHighlightingCharacters() {
        if (charIndex > 0) {
            if (charIndex === textArray[textArrayIndex].length) {
                const wrappedHtml = textArray[textArrayIndex].split('').map(char => `<span>${char}</span>`).join('');
                textSection.innerHTML = wrappedHtml;
            }

            cursorSpan.style.visibility = 'hidden';

            textSection.querySelector(`span:nth-child(${charIndex})`).classList.add('highlighted-text');

            charIndex--;
            setTimeout(erase, erasingDelay + (charIndex === 0 ? 500 : 0));
        } else {
            cursorSpan.style.visibility = 'visible';
            textSection.innerHTML = '';
            moveToNextText();
        }
    }

    function eraseByErasingWords() {
        if (charIndex > 0) {
            if (charIndex === textArray[textArrayIndex].length) {
                cursorSpan.style.visibility = 'visible';
            }

            let lastSpaceIndex = textArray[textArrayIndex].lastIndexOf(' ', charIndex - 1);
            if (lastSpaceIndex === -1) lastSpaceIndex = 0;

            textSection.innerHTML = textArray[textArrayIndex].substring(0, lastSpaceIndex);

            charIndex = lastSpaceIndex;

            setTimeout(erase, erasingDelay + 250);
        } else {
            moveToNextText();
        }
    }

    function eraseByHighlightingWords() {
        let spans = textSection.querySelectorAll('span');

        // Highlight and delete one word at a time from right to left, then erase all
        if (1 === textSection.querySelectorAll('span').length) {
            // Initially wrap words in spans for highlighting
            textSection.innerHTML = textArray[textArrayIndex].split(' ').map(word => `<span>${word} </span>`).join('');
        }

        let highlightedSpans = textSection.querySelectorAll('span.highlighted-text');
        if (highlightedSpans.length < spans.length) {
            // Highlight the next word from the right
            let nextWordToHighlight = spans[spans.length - 1 - highlightedSpans.length];
            nextWordToHighlight.classList.add('highlighted-text');
            setTimeout(erase, erasingDelay + 250); // Delay for highlighting the next word
        }
        else
        {
            textSection.innerHTML = '';
            charIndex = 0;
            moveToNextText();
        }
    }

    function eraseByErasingCharacters() {
        if (charIndex > 0) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            textSection.innerHTML = textArray[textArrayIndex].substring(0, charIndex - 1);

            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            moveToNextText();
        }
    }

    // Start the typing effect
    type();
}
function scrollToTop() {
    window.scrollTo(0, 0);
}

function makeSticky(header) {
    if (!header)
        header = document.querySelector('header');

    header.classList.add('sticky');
}

export const stickyPoint = 1; // The scroll point you want the element to become sticky

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');

    if (window.scrollY >= stickyPoint) {
        makeSticky(header);

    } else {
        header.classList.remove('sticky');

        header.removeEventListener('click', scrollToTop);
    }
});


window.addEventListener('load', () => {
    if (window.scrollY >= stickyPoint)
        makeSticky();
});

const animationSelectors = [
    '#about-section-main-header-container',
    '#work-section-main-header-container',
    '#portfolio-section-main-header-container',
    '#projects-section-main-header-container',
    '.header-column',
    '.content-column',
    '#weak-areas',
    '#strong-areas',
    '#what-to-expect-sign',
    '.portfolio-navigation-left',
    '.portfolio-navigation-right',
    '#portfolio-item-image-gallery-thumbnails',
    '#portfolio-item-image-gallery',
    '#portfolio-item-page-content',
    '#portfolio-item-description',
    '#portfolio-item-project-technologies > div',
    '.work-history-entry-right-side',
    '.work-history-entry-left-side',
    '#open-to-offers',
    '#portfolio-item-project-technologies',
    '#portfolio-item-header-basic-info',
    '#tour-button-borders',
    '#get-in-touch-button-container',
    '#weak-strong-points-section-background',
    '#work-history-container',
    '.project-card-border',
    '#projects-section-container',
    '#portfolio-item-project-name',
    '#portfolio-item-github',
    '#portfolio-item-official-website',
    '#portfolio-item-top-image img',
    '#portfolio-gallery-container',
    '.portfolio-item-project-page-list',
    '#toggle-portfolio-item-details-button'
];

function createObserver() {
    return new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.01
    });
}
export function initializeAnimations() {
    const observer = createObserver();

    const elements = animationSelectors.flatMap(selector => Array.from(document.querySelectorAll(selector)));

    elements.forEach(el => {
        observer.observe(el)
    });
}

function handleDraggableSetUp(draggableElement)
{
    return function() {
        draggableElement.forEach(el => {
            el.classList.remove('element-drag-active');// remove 'grabbing' cursor
        });

        document.querySelector('body').classList.remove('element-drag-active');// remove 'grabbing' cursor
    }
}

function setUpDraggable(){
    const draggableElement = document.querySelectorAll('.draggable');

    draggableElement.forEach(el => {
        addOrReplaceEventListener(el, 'mousedown', function() {
            el.classList.add('element-drag-active'); // switch to 'grabbing' cursor
            document.querySelector('body').classList.add('element-drag-active'); // switch to 'grabbing' cursor
        });
    });

    addOrReplaceEventListener(document, 'mouseup', handleDraggableSetUp(draggableElement));

}

document.addEventListener("pageLoaded", setUpDraggable);
window.addEventListener("load", setUpDraggable);

function cursorMouseEntered(image) {
    return function(){
        gsap.to(image, 1, {
            scale: 1,
            opacity: 1,
            top: '0',
            left: '0',
            rotate: 0,
            ease: Elastic.easeOut.config(1, 0.3)
        });
    }
}

function cursorMouseLeave(image) {
    return function() {
        gsap.killTweensOf(image);
        gsap.to(image, 0.2, {
            scale: 0,
            opacity: 0,
            top: '0',
            left: '0',
            rotate: 90
        });
    }
}

function setUpCursorEffect(parentElementId, elementId) {
    let image = document.getElementById(elementId);
    let parentElement = document.getElementById(parentElementId);

    // Initialize mouseX and mouseY locally within each cursor effect setup
    let mouseX = null;
    let mouseY = null;

    gsap.set(image, { scale: 0.001, opacity: 0.001, rotate: 90 });

    // Local function to handle window mouse movement, updating local mouseX and mouseY
    function handleCursorWindowMovement(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    // Attach the mousemove listener to the window
    window.addEventListener('mousemove', handleCursorWindowMovement);

    addOrReplaceEventListener(parentElement, 'mouseenter', cursorMouseEntered(image));

    // Define a local function to handle cursor movement within the parent element
    function cursorMouseMoved() {
        return function() {
            if(mouseX !== null && mouseY !== null) {
                let rect = parentElement.getBoundingClientRect();
                let offsetX = mouseX - rect.left - 30; // Adjust the offset as needed
                let offsetY = mouseY - rect.top - 30; // Adjust the offset as needed

                gsap.to(image, 0.1, {
                    x: offsetX,
                    y: offsetY
                });
            }
        }
    }

    addOrReplaceEventListener(parentElement, 'mousemove', cursorMouseMoved());

    addOrReplaceEventListener(parentElement, 'mouseleave', cursorMouseLeave(image));
}


function setUpElementCursors() {
    // Set up the effect for the Get In Touch button
    setUpCursorEffect('get-in-touch-button-container', 'pointing-hand');

    // Set up the same effect for the Tour Icon inside the Tour Button Container
    setUpCursorEffect('tour-button-container', 'tour-cursor');
}


document.addEventListener('mainPageLoaded', setUpElementCursors);
window.addEventListener('load', setUpElementCursors);


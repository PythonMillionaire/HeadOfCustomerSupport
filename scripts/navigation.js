import {initializeAnimations} from "./visual-effects.js";
import {addOrReplaceEventListener} from "./general.js";

const pageCache = {};

let preloaded = false;

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}



function setupNavigation() {
    const header = document.querySelector('header');
    // Select only links with data-page-name attribute
    const menuLinks = header.querySelectorAll('a[data-page-name]');

    menuLinks.forEach((link) => {
        addOrReplaceEventListener(link, 'click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            navigateTo(link.dataset.pageName).then();
        });
    });




    //mobile
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const closeOverlay = document.querySelector('.close-overlay');

    // Open the overlay when the hamburger menu is clicked
    hamburgerMenu.addEventListener('click', function() {
        const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        mobileNavOverlay.style.display = 'flex';
        console.log(mobileNavOverlay);
    });

    // Close the overlay when the close button is clicked
    closeOverlay.addEventListener('click', function() {
        const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        mobileNavOverlay.style.display = 'none';
    });

    const mobileNav = document.querySelector('#mobile-nav-container');

    const mobileNavLinks = mobileNav.querySelectorAll('a[data-page-name]');

    mobileNavLinks.forEach((link) => {
        addOrReplaceEventListener(link, 'click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            navigateTo(link.dataset.pageName).then();

            const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
            mobileNavOverlay.style.display = 'none';
        });
    });

    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

    // Optional: Close the overlay when clicking outside of it
    mobileNavOverlay.addEventListener('click', function(e) {
        if (e.target === mobileNavOverlay) {
            mobileNavOverlay.style.display = 'none';
        }
    });

}


function fetchAndDisplayPage(pageName) {
    return new Promise((resolve, reject) => {
        if (pageCache[pageName]) {
            updatePageContent(pageName, pageCache[pageName]);
            resolve(); // Resolve the promise here if the page is already cached
            return;
        }

        fetch(`${pageName}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                updatePageContent(pageName, html); // Call updatePageContent without resolve parameter
                resolve(); // Resolve the promise after the content has been updated
            })
            .catch(error => {
                console.error('Error fetching the page:', error);
                document.querySelector('main').innerHTML = `<p>Failed to load page: ${pageName}</p>`;
                reject(error); // Pass the error to the reject function
            });
    });
}

function updatePageContent(pageName, html) {
    pageCache[pageName] = html;

    document.querySelector('main').innerHTML = html;

    initializeAnimations();

    dispatchPageEvents(pageName);

    if ('main' === pageName)
        setUpMainPage();
}

function dispatchPageEvents(pageName) {
    document.dispatchEvent(new Event('pageLoaded'));
    document.dispatchEvent(new Event(`${pageName}PageLoaded`));
}



function preloadPagesAndImages() {
    const pages = ['about', 'work', 'portfolio'];

    return Promise.all(pages.map(page => fetch(`${page}.html`)))
        .then(responses => Promise.all(responses.map(res => res.text())))
        .then(htmls => {
            htmls.forEach((html, index) => {
                pageCache[pages[index]] = html;
                preloadImagesFromHtml(html);
            });
        })
        .catch(error => console.error('Error preloading pages:', error));
}

function preloadImagesFromHtml(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const image = new Image();
            image.src = src;
        }
    });
}

export function scrollToTop(smooth = false) {
    if (!smooth) {
        document.documentElement.style.scrollBehavior = 'auto';
    }
    else {
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    window.scrollTo(0, 0);

    document.documentElement.style.scrollBehavior = 'smooth';
}

function navigateTo(pageName) {
    return new Promise((resolve) => {
        scrollToTop();

        // Remove 'selected' class from previously selected link
        const previouslySelected = document.querySelector('a .selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }

        // Add 'selected' class to the current link
        const currentlySelected = document.querySelector(`[data-page-name="${pageName}"]:not(#logo) > span`);
        if (currentlySelected) {
            currentlySelected.classList.add('selected');
        }

        function afterContentLoaded() {
            // Do not update the URL
            resolve();
        }

        if (pageCache[pageName]) {
            updatePageContent(pageName, pageCache[pageName]);
            afterContentLoaded();
        } else {
            fetchAndDisplayPage(pageName).then(afterContentLoaded);
        }

        // Remove redundant call to setupNavigation()
        // setupNavigation();
    });
}




function setUpMainPage() {
    function handleNavigateToPortfolio(){
        return function() {
            navigateTo('portfolio').then();
        }
    }

    addOrReplaceEventListener(document.getElementById('tour-button-container'), 'click', handleNavigateToPortfolio());

}

/*window.addEventListener('popstate', (event) => {
    let pageName;
    if (event.state && event.state.page) {
        pageName = event.state.page;
    } else {
        const path = window.location.pathname;
        pageName = path === '/' ? 'main' : path.replace('/', '');
    }
    navigateTo(pageName).then();
});*/

window.addEventListener('load', () => {
    scrollToTop();

    // Initialize animations and navigation only once
    initializeAnimations();
    setupNavigation();

    const mainContent = document.getElementById('main').innerHTML;
    pageCache['main'] = mainContent;

    setUpMainPage();

    // Preload pages and images
    preloadPagesAndImages().then(() => {
        preloaded = true;

        // No need to navigate to 'main' since it's already loaded
        // navigateTo('main').then();
    });
});








const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

document.querySelectorAll("nav > a > span").forEach((span) => {
    // Store original text in a custom property
    span.originalText = span.innerText;

    span.addEventListener('mouseover', event => {
        if (event.target.classList.contains('selected')) return;

        // Clear previous interval if any, using a property unique to each span
        if (span.intervalId) clearInterval(span.intervalId);

        let iteration = 0;
        let totalIterations = event.target.originalText.length * 3; // Complete iterations for the entire text

        span.intervalId = setInterval(() => {
            if (iteration < totalIterations) {
                // Initial effect
                event.target.innerText = event.target.originalText
                    .split("")
                    .map((letter, index) => {
                        if (index < Math.floor(iteration / 3)) {
                            return event.target.originalText[index];
                        }
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");
            } else {
                // Start "after effect" only after initial effect is complete
                clearInterval(span.intervalId); // Clear interval to stop initial effect

                let afterEffectDuration = 600; // 2-3 seconds for "after effect"
                let endTime = Date.now() + afterEffectDuration;
                let afterEffectInterval = setInterval(() => {
                    if (Date.now() > endTime) {
                        clearInterval(afterEffectInterval); // Stop "after effect" after duration
                        event.target.innerText = event.target.originalText; // Restore original text
                        return;
                    }

                    // "After effect": Randomize 30-40% of the letters
                    event.target.innerText = event.target.originalText
                        .split("")
                        .map((letter, index, array) => {
                            if (Math.random() < 0.2) { // Randomize with 40% probability
                                return letters[Math.floor(Math.random() * letters.length)];
                            }
                            return letter;
                        })
                        .join("");
                }, 50);
            }

            iteration++;
        }, 40);
    });
});

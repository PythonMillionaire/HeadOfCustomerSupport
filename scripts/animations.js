import {addOrReplaceEventListener} from "./general.js";

function wrapChars(textNode) {
    let content = '';

    // Use a regex to match text outside of HTML tags
    const regex = /(<\/?[^>]+>)|([^<]+)/g;
    let match;

    // Loop over the regex matches
    while ((match = regex.exec(textNode.innerHTML)) !== null) {
        // match[1] will hold the HTML tags if any, match[2] will hold text
        if (match[1]) {
            // It's an HTML tag, so add it directly to the content
            content += match[1];
        } else if (match[2]) {
            // It's text, so wrap each character in a span
            content += match[2].replace(/&amp;/g, '&').split("").map(char => {
                return char.trim() !== '' ? `<span class='char'>${char}</span>` : char;
            }).join("");
        }
    }

    //console.log("old content", textNode.innerHTML)
    // Replace the paragraph's content with the new HTML
    textNode.innerHTML = content;
    //console.log("new content", textNode.innerHTML)
}

document.addEventListener('pageLoaded', () => {
    // Register the GSAP TextPlugin
    gsap.registerPlugin(TextPlugin);

    const textElements = document.querySelectorAll('.content-column, .work-history-entry-position, .work-history-entry-company, ' +
        '.work-history-entry-date, .work-history-entry-description p, .work-history-entry-description li,' +
        '#portfolio-item-description, #portfolio-item-description li');

    textElements.forEach((textContainer) => {
        // Select all paragraph elements
        let paragraphs = textContainer.querySelectorAll("p, span");

        const isSkillsColumn = textContainer.id === 'skills-column';



        if (!paragraphs.length) {
            paragraphs = [textContainer];
        }

        // wrap each letter in span tags
        paragraphs.forEach(paragraph => {
            wrapChars(paragraph);
            gsap.set(paragraph.querySelectorAll(".char"), { opacity: 0 });
        });

        const animationDuration = 1.4; // Duration of each character animation in seconds
        let animationStarted = false; // Flag to indicate if the animation process has started

        function animateChars(chars, image) {
            const randomStartTime = () => Math.random() * 0.2;

            // Create a GSAP timeline for sequencing the animations
            const tl = gsap.timeline({
                repeat: 0,

                onStart: () => {
                    // Start image animation when the text animation starts
                    if (image) {
                        gsap.fromTo(image, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1.4, ease: "power4.out" });

                        // Animate the parent of the image to scale up and then back down
                        const parentTimeline = gsap.timeline();
                        parentTimeline.fromTo(image.parentElement, { scale: 0.7 }, { scale: 1.22, duration: 0.2, ease: "power2.inOut" })
                            .to(image.parentElement, { scale: 1, duration: 0.1, ease: "power2.out" }); // Chain the scale back down
                    }
                },

                onComplete: () => {
                    //console.log("Completed", tl.time());
                }
            });

            // Convert NodeList to array for reverse manipulation if needed
            const charsArray = Array.from(chars);
            // Animate each character
            charsArray.forEach(char => {
                // Initial random position for each character
                const initX = Math.random() * 60 - 30;
                const initY = Math.random() * 60 - 30;

                // Set the initial position
                char.style.position = "relative";
                char.style.transform = `translate(${initX}px, ${initY}px)`;

                tl.to(char, {
                    opacity: 1, // Animate opacity to 1 (visible)
                    x: 0, // Reset X position
                    y: 0, // Reset Y position
                    duration: animationDuration, // Longer duration for smoother transition
                    ease: "power4.out", // Smoother easing function
                    onStart: () => {
                        // No additional settings needed on start
                    },
                    onComplete: () => {
                        // Reset transform to none after animation
                        char.style.transform = "none";
                    }
                }, randomStartTime()); // Random start time for each character
            });
        }

        const observer = new IntersectionObserver((entries, observer) => {
            if (!animationStarted) {
                let firstVisibleParagraph = null;
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.01) {
                        firstVisibleParagraph = firstVisibleParagraph || entry.target;
                    }
                });

                if (firstVisibleParagraph) {
                    animationStarted = true;
                    animateParagraphsInOrder(firstVisibleParagraph);
                    observer.disconnect(); // Stop observing all elements
                }
            }
        }, { threshold: 0.01 });

        paragraphs.forEach(paragraph => {
            observer.observe(paragraph);
        });

        function animateParagraphsInOrder(startParagraph) {
            const timeToWaitBetweenAnimations = isSkillsColumn ? 100 : 400;
            const paragraphArray = Array.from(paragraphs);
            const startIndex = paragraphArray.indexOf(startParagraph);

            for (let i = 0; i < paragraphArray.length; i++) {
                const currentParagraph = paragraphArray[(startIndex + i) % paragraphArray.length];
                const correspondingImage = isSkillsColumn ? currentParagraph.parentElement.querySelector('img') : null;

                setTimeout(() => {
                    animateChars(currentParagraph.querySelectorAll('.char'), correspondingImage);

                }, i * timeToWaitBetweenAnimations);
            }
        }
    });
});
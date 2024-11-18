import {addOrReplaceEventListener} from "../general.js";

let activeElement;

let boxes;

let loop;


document.addEventListener('mainPageLoaded', initializeLoop);

window.addEventListener('load', initializeLoop);

let initialPositions = []; // Array to store the initial positions

function initializeLoop(){
    boxes = gsap.utils.toArray("#skills-section-inner > div");

    gsap.fromTo("#skills-section-inner",
        { opacity: 0, scale: 0 }, // Starting values
        { opacity: 1, scale: 1, duration: 2, ease: "power4.out" } // Ending values and animation settings
    );

    loop = horizontalLoop(boxes, {
        //paused: true,
        draggable: true, // make it draggable
        repeat: -1,
        center: true, // active element is the one in the center of the container rather than th left edge
        onChange: (element, index) => { // when the active element changes, this function gets called.
            activeElement && activeElement.classList.remove("active");
            element.classList.add("active");
            activeElement = element;
        },
        paddingRight: 26,
        snap: true
    });

    document.getElementById('skills-section').style.visibility = 'visible';
}

function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};

    // Insert the new variables for initial positions and first loop completed flag
    let firstLoopCompleted = false; // Flag to indicate if the first loop is completed

    let onChange = config.onChange,
        lastIndex = 0,
        tl = gsap.timeline({
            repeat: config.repeat,
            onUpdate: onChange && function () {
                let i = tl.closestIndex();
                if (lastIndex !== i) {
                    lastIndex = i;
                    onChange(items[i], i);
                }
            },
            paused: config.paused,
            defaults: {ease: "none"},
            onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
        }),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        spaceBefore = [],
        xPercents = [],
        curIndex = 0,
        indexIsDirty = false,
        center = config.center,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
        timeOffset = 0,
        container = center === true ? items[0].parentNode : gsap.utils.toArray(center)[0] || items[0].parentNode,
        totalWidth,
        getTotalWidth = () => items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + spaceBefore[0] + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") + (parseFloat(config.paddingRight) || 0),
        populateWidths = () => {
            let b1 = container.getBoundingClientRect(), b2;
            items.forEach((el, i) => {
                widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
                xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / widths[i] * 100 + gsap.getProperty(el, "xPercent"));
                b2 = el.getBoundingClientRect();
                spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
                b1 = b2;
            });
            gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
                xPercent: i => xPercents[i]
            });
            totalWidth = getTotalWidth();
        },
        timeWrap,
        populateOffsets = () => {
            timeOffset = center ? tl.duration() * (container.offsetWidth / 2) / totalWidth : 0;
            center && times.forEach((t, i) => {
                times[i] = timeWrap(tl.labels["label" + i] + tl.duration() * widths[i] / 2 / totalWidth - timeOffset);
            });
        },
        getClosest = (values, value, wrap) => {
            let i = values.length,
                closest = 1e10,
                index = 0, d;
            while (i--) {
                d = Math.abs(values[i] - value);
                if (d > wrap / 2) {
                    d = wrap - d;
                }
                if (d < closest) {
                    closest = d;
                    index = i;
                }
            }
            return index;
        },
        originalPopulateTimeline = () => {
            let i, item, curX, distanceToStart, distanceToLoop;
            tl.clear();
            for (i = 0; i < length; i++) {
                item = items[i];
                curX = xPercents[i] / 100 * widths[i];
                distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
                distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
                tl.to(item, {
                    xPercent: snap((curX - distanceToLoop) / widths[i] * 100),
                    duration: distanceToLoop / pixelsPerSecond
                }, 0)
                    .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {
                        xPercent: xPercents[i],
                        duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
                        immediateRender: false
                    }, distanceToLoop / pixelsPerSecond)
                    .add("label" + i, distanceToStart / pixelsPerSecond);
                times[i] = distanceToStart / pixelsPerSecond;
            }
            timeWrap = gsap.utils.wrap(0, tl.duration());
        },
        populateTimeline = () => {
            originalPopulateTimeline();
            if (!firstLoopCompleted) {
                // Record the initial positions before any animation
                items.forEach((item, i) => {
                    if (!initialPositions.length)
                        initialPositions.push({ xPercent: gsap.getProperty(item, "xPercent") });
                });
            }
        },
        refresh = (deep) => {
            let progress = tl.progress();
            tl.progress(0, true);
            populateWidths();
            deep && populateTimeline();
            populateOffsets();
            deep && tl.draggable ? tl.time(times[curIndex], true) : tl.progress(progress, true);
        },
        proxy;



    gsap.set(items, {x: 0});
    populateWidths();
    populateTimeline();

    // Add the onComplete event to the timeline after populateTimeline call
    tl.eventCallback("onComplete", () => {
        if (!firstLoopCompleted) {
            // After the first loop completes, reset positions to the initial values
            items.forEach((item, i) => {
                gsap.set(item, initialPositions[i]);
            });
            firstLoopCompleted = true; // Set the flag so this block will only run once
            tl.invalidate().restart(); // Invalidate the timeline and restart it to apply the new positions
        }
    });

    populateOffsets();

    const refreshAfterResize = () => refresh(true);
    
    window.addEventListener("resize", refreshAfterResize);

    function toIndex(index, vars) {
        vars = vars || {};
        (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = gsap.utils.wrap(0, length, index),
            time = times[newIndex];
        if (time > tl.time() !== index > curIndex && index !== curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
            time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        if (time < 0 || time > tl.duration()) {
            vars.modifiers = {time: timeWrap};
        }
        curIndex = newIndex;
        vars.overwrite = true;
        gsap.killTweensOf(proxy);
        return vars.duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars);
    }
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.closestIndex = setCurrent => {
        let index = getClosest(times, tl.time(), tl.duration());
        if (setCurrent) {
            curIndex = index;
            indexIsDirty = false;
        }
        return index;
    };
    tl.current = () => indexIsDirty ? tl.closestIndex(true) : curIndex;
    tl.next = vars => toIndex(tl.current()+1, vars);
    tl.previous = vars => toIndex(tl.current()-1, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true); // pre-render for performance
    if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
    }

    if (config.draggable && typeof (Draggable) === "function") {
        proxy = document.createElement("div");
        let wrap = gsap.utils.wrap(0, 1),
            ratio, startProgress, draggable, dragSnap, lastSnap, initChangeX, wasPlaying,
            align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio)),
            syncIndex = () => tl.closestIndex(true);

        draggable = Draggable.create(proxy, {
            trigger: items[0].parentNode,
            type: "x",
            onPressInit() {
                let x = this.x;
                gsap.killTweensOf(tl);
                wasPlaying = !tl.paused();
                tl.pause();
                startProgress = tl.progress();
                refresh();
                ratio = 1 / totalWidth;
                initChangeX = (startProgress / -ratio) - x;
                gsap.set(proxy, {x: startProgress / -ratio});
            },
            onDrag: align,
            onThrowUpdate: align,
            overshootTolerance: 0,
            snap(value) {
                // Your existing snap logic here
            },
            onRelease() {
                syncIndex();
                draggable.isThrowing && (indexIsDirty = true);
                tl.play();
            },
            onThrowComplete: () => {
                syncIndex();
                tl.play();
            }
        })[0];
        tl.draggable = draggable;
    }


    tl.closestIndex(true);
    lastIndex = curIndex;
    onChange && onChange(items[curIndex], curIndex);
    return tl;
}
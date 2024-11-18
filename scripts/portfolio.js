import {addOrReplaceEventListener, createImageZoomOverlay, handleZoomOverlayCreation} from "./general.js";
let toggleButton;

function togglePortfolioItemDetails() {
    document.getElementById('portfolio-item-details').classList.toggle('animate');
    document.getElementById('toggle-portfolio-item-details-button').classList.toggle('expanded');
}

function handleTogglePortfolioPageContent () {
    return function() {
        togglePortfolioItemDetails();

        if (!toggleButton)
            document.getElementById('toggle-portfolio-item-details-button');

        // Check the current text and swap it
        if (toggleButton.classList.contains("expanded")) {
            toggleButton.innerHTML = '<span class="text">Hide project details</span> <span class="solid-arrow">▲</span>';
            makeImagesStaticWhenScrolling();

        } else {
            toggleButton.innerHTML = '<span class="text">Show project details</span> <span class="solid-arrow">▼</span>';
        }
    }
}

document.addEventListener('portfolioPageLoaded', () => {
    toggleButton = document.getElementById('toggle-portfolio-item-details-button');

    addOrReplaceEventListener(toggleButton, 'click', handleTogglePortfolioPageContent());
});


class PortfolioItem {
    constructor(mainInfo, detailedInfo) {
        this.mainInfo = mainInfo;
        this.detailedInfo = detailedInfo;
    }
}

class MainInfo {
    constructor(projectName, projectClient, projectType, projectImages, projectDescription, projectGitHub, projectWebsite, projectTechnologies) {
        this.projectName = projectName;
        this.projectClient = projectClient;
        this.projectType = projectType;
        this.projectDescription = projectDescription;

        this.projectImages = projectImages;

        this.projectTopImage = projectImages[0];

        this.projectGitHub = projectGitHub;

        this.projectWebsite = projectWebsite;

        this.projectTechnologies = projectTechnologies;
    }
}

class DetailedInfo {
    constructor() {
        this.pages = [];
    }

    AddPage(pageTitle, pageImages, pageContent) {
        const newPage = {
            pageTitle: pageTitle,
            pageImages: pageImages,
            pageContent: pageContent
        }

        this.pages.push(newPage);
    }
}

const portfolioContent = [];

let currentPageIndex = 0;

export let currentProjectIndex = 0;

export const editorProjectIndex = 0;
export const hhProjectIndex = 1;
export const gameProjectIndex = 2;

export function setCurrentProjectIndexThenReload(index) {
    currentProjectIndex = index;

    loadCurrentProjectContent();
    selectSpecificProjectNumber(index);
}



/* HAPPINESS HUB */
const hhMainInfo = new MainInfo("Happiness Hub", "Strikingly", "Google Chrome Extension",
    ['images/portfolio/hh/happiness-hub-thumbnail-1.jpg', 'images/portfolio/hh/happiness-hub-thumbnail-2.jpg', 'images/portfolio/hh/happiness-hub-thumbnail-3.jpg'],
    `<p><b>Happiness Hub </b>is a Google<b> Chrome extension</b> that <i>heavily modifies</i> <b>LiveChat's</b> and <b>Zendesk's UI</b> 
                    to add invaluable new features that empower <b>Strikingly's</b> <i>customer support agents</i> to provide <b>vastly superior support</b> at the cost of
                    <b>drastically reduced effort</b>.</p>

                    <p>The extension achieved <b>outstanding success</b>, reducing support agents' <i>actual workload</i> by <b>as much as 90%</b> in some cases.</p>
                    `, 'Closed source', { url: 'https://www.happinesshub.fun/', text: 'Official Website' }, ['HTML', 'CSS', 'JS', 'Sass', 'Webpack']);


const hhDetailedInfo = new DetailedInfo();

// Page one - Left Side Panel
hhDetailedInfo.AddPage(
    "Left Side Panel",
    ["images/portfolio/hh/left-panel.webp"],
    `<p>The <b>left side panel</b> was added to the large empty section over which the currently open chats are displayed.</p>

                <p>Its two functions are <b>quickly fetching</b> and <b>displaying</b> all of the <b>most important user data</b> and <b>enabling direct
                    communication</b> with <i>Kodi</i> (Strikingly's AI system), which was also given powerful new features such as automatic output cleaning and translation
                    as well as the ability to save outputs for later use.</p>

                <p>The <b>Refresh</b> button allows for one-click updates and effortless monitoring of changes in the account
                    such as <i>plan upgrades</i> or <i>cancellations</i>, <i>creation of new sites</i>, <i>acquisition of domains</i>, etc.</p>`
);

// Page two - Canned Replies
hhDetailedInfo.AddPage(
    "Canned Replies",
    ["images/portfolio/hh/canned-replies.webp"],
    `<p><b>Personalized canned replies</b> unique to <i>each support agent</i>. Easy switching between reply variations based on <b>language</b>, 
                <b>formality level</b> and <b>gender</b>. Detection of the client's <b>Strikingly</b> account language so the selected 
                <i>Language</i> dropdown option is automatically set to match.</p>
                
                <p><b>Slow send</b> button that automatically breaks large messages up into chunks and sends them one by one. This makes it possible,
                 for instance, to simply paste any number of <i>AI-recommended templates</i> at once, press <b>Slow send</b> and watch while 
                 they are automatically sent <i>one by one</i>, allowing support agents to <i>talk to other users</i> 
                 or <i>take care of other tasks</i> in the meantime. The sending speed always respects the maximum WPM (<i>words per minute</i>) limit defined 
                 in <i>Settings</i> so as not to drown the client in too much text sent too quickly.</p>
                
                <p>Integration with <i>Google Translate</i> that allows the contents of the input field to be <b>instantly translated</b> to any of the <b>100+ supported languages</b>.</p>
                
                <p>One-click <b>tag chat button</b> as well as <i>auto-tag mode</i>.</p>`
);

// Page three - Right Side Panel
hhDetailedInfo.AddPage(
    "Right Side Panel",
    ["images/portfolio/hh/right-panel.webp"],
    `<p>Apart from the completely new tabs, two additional sections were added at the very top of the <i>right side panel</i>. Here are the functionalities they provide:</p>

                <p><b>Break counter:</b> displays which users in your language group are currently on break, making it possible to coordinate 
                break times and not leave LiveChat unattended.</p>
                
                <p><b>Break/back button:</b> switches to <i>Do Not Accept Chats</i> mode and sends two messages on <i>Slack,</i> one letting everyone 
                know the user's break is starting or ending in the relevant channel, the other in the <i>Timetrack channel</i> so the appropriate entry is added to the timesheet.</p>
                
                <p><b>Slack:</b> integration with <i>Slack</i> that allows the sending of messages to <i>Slack</i> channels as well as direct 
                messages to individual users or groups of users. Send escalations requests, such as for <i>account cancelation</i> and <i>site deletion</i> 
                with all necessary user information already included in one click.</p>
                
                <p>Apart from a couple of new features that were added to <i>LiveChat</i>'s original first tab and two new sections that 
                now sit at the top of the right side panel, three completely new tabs have been added:</p>
                
                <p><b>Templates:</b> this tab provides access to all of our website templates. It is possible to <i>search</i> by text and <i>filter</i> by 
                template <i>category</i> and <i>subcategory</i>. You can insert shortened template links as well as generate <i>AI-powered</i> recommendations.</p>
                
                <p><b>Knowledge Base</b>: here you can search the <i>KB</i>, view complete articles and effortlessly insert images, sentences and paragraphs 
                from the article into the input field to send to the user in one click.</p>
                
                <p><b>Screenshots:</b> this tab works in conjunction with the new feature that allows screenshots to be saved for later reuse.</p>`
);

// Page four - AI Tools
hhDetailedInfo.AddPage(
    "AI Tools",
    ["images/portfolio/hh/ai-tools.webp"],

    `<p>Talk to <i>ChatGPT</i> without ever leaving <i>LiveChat</i>!</p>
                
                <p>The extension uses your browser's cookies to access your pre-existing, logged-in <i>ChatGPT </i>account<i></i>
                and make requests. In addition to a few commands that come out-of-the-box, it is also possible to create new buttons 
                and define your own custom prompts. The output can either be displayed on screen for you to read or inserted directly 
                into the input field to send to the client.</p>
                
                <p>Here are the default buttons, which can be customized as well:</p>
                
                <p><b>Detect language:</b> quickly detect unfamiliar languages spoken in the chat and automatically set the selected 
                <i>Translation</i> dropdown option accordingly.</p>
                
                <p><b>Categorize chat:</b> don't waste time trying to find the best category for the chat. This button sends the 
                list of categories and the chat along with the prompt so <i>ChatGPT</i> can decide for you!</p>
                
                <p><b>Subcategorize chat:</b> This button sends the list of subcategories so <i>ChatGPT</i> can 
                decide after the chat has been categorized.</p>
                
                <p><b>Reword:</b> rewords the contents of the input field to improve grammar or make the response sound fresh.</p>
                
                <p><b>Flesh out:</b> fleshes out and finishes writing the text currently in the input field. Short, abbreviated sentences
                 can be written and <i>ChatGPT</i> will turn them into full, well-written responses. <i>Especially useful</i> for subjects 
                 you might not know much about, e.g: <i>Here are general instructions for Email Domain Authentication (DKIM) with Bluehost:</i>, which 
                 <i>ChatGPT</i> will then complete and turn into a real answer.</p>
                
                <p><b>Alter gender:</b> alters the gender of the text in the input field. Useful when using translated text.</p>
                
                <p><b>Change tone:</b> alters the tone of the text in the input field. Useful to change cheerful text into apologetic, 
                empathetic text when sending pre-saved instructions to frustrated users.</p>
                
                <p><b>Grammar check:</b> a quick way to make sure your writing is always correct, especially when using unfamiliar expressions.</p>`
)

hhDetailedInfo.AddPage(
    "Varied Functionality",
    [],
    `<p><b>Translation:</b> an integration with <i>Google Translate</i> allows for the speedy translation of the contents of both the chat's 
                input field and Kodi's output field into any language supported by <i>Google Translate</i> with a single click.</p>

                <p><b>Zendesk open tickets counter:</b> shows the number of both currently open and monitored tickets under your name on <i>Zendesk</i> so you don't need 
                to waste time checking when there aren't any.</p>
                
                <p><b>Tag button:</b> tags chat in one click. <i>Auto-tag</i> mode is also available.</p>
                
                <p><b>Save draft:</b> saves your message as a draft and removes it from the input field. This is useful if you are typing something and 
                see that the user is also typing something that is important and takes precedence over what you were going to say. You can then simply 
                <i>Save draft</i>, write another message addressing the other matter, then <i>Insert draft</i> back and continue from where you had stopped, 
                all without needing to copy your message with <i>Ctrl</i> + <i>V</i>.</p>
                
                <p><b>WPM counter:</b> shows how many words per minute are being sent to the client to prevent too many words being sent too fast.</p>
                
                <p><b>Track button:</b> tracks ticket in a dedicated <i>Google Firebase</i> database, which has numerous advantages over <i>Google Sheets</i> and no 
                real disadvantage.</p>
                
                <p><b>Communication system:</b> a message system that displays messages in a dedicated bar container at the very top of the website so that 
                important messages from SLs, TLs, etc. can be immediately shown to all HOs. A message acknowledgement system (<i>mark as read</i> 
                button that sends a message and a checkmark reaction in Slack) is included.</p>`
);

const happinessHub = new PortfolioItem(hhMainInfo, hhDetailedInfo);

portfolioContent.push(happinessHub);


/* END HAPPINESS HUB */







/* STRIKINGLY EDITOR */
const editorMainInfo = new MainInfo("Strikingly Editor's UI", "Strikingly", "Single-Page Application",
    ['images/portfolio/editor/strikingly-editor-thumbnail-1.jpg', 'images/portfolio/editor/strikingly-editor-thumbnail-2.jpg', 'images/portfolio/editor/strikingly-editor-thumbnail-3.jpg',
        'images/portfolio/editor/strikingly-editor-thumbnail-4.jpg', 'images/portfolio/editor/strikingly-editor-thumbnail-5.jpg', 'images/portfolio/editor/strikingly-editor-thumbnail-6.jpg'],
    `<p><b>Strikingly's web design editor</b>, its flagship product, is renowned for its <i>simplicity</i> and <i>ease of use</i> and loved by <i>millions of 
                    clients</i> worldwide. Its <b>UI</b>, however, was outdated and suffered from <i>numerous UX issues</i> that made using the editor significantly <i>more tiring</i> 
                    and <i>cumbersome</i> than necessary, which meant it was in <b>dire need</b> of an <b>overhaul</b>.</p>

                    <p>This <b>complete redesign</b> did away with <i>all issues</i> while, simultaneously, introducing several <i>extremely</i> <b>powerful new features</b>.</p>
                    
                    <p>Standing out among them, the new <b>direct access</b> to the <b>company's Knowledge Base</b> provides users with the ability to <b>read interactive articles</b> 
                    that turn into <b>tour-like tutorials</b> <i>that are fully integrated with the editor</i>. This not only provides for a <b>revolutionary learning experience</b> but 
                    also greatly <i>reduces the load</i> on the company's <i>technical support team</i>.</p>
            `,  'https://github.com/PythonMillionaire/StrikinglyEditor', { url: 'https://newstrikinglyeditor.netlify.app/', text: 'Functional Mock-up'}, ['HTML', 'CSS', 'JS', 'Sass', 'Photoshop']);


const editorDetailedInfo = new DetailedInfo();

// Page one - Left Side Panel
editorDetailedInfo.AddPage(
    "General Improvements",
    ["images/portfolio/editor/advantages.webp"],
    `<p>
                   The <b>original UI</b>'s design suffered from <b>multiple problems</b> that <i>significantly</i> <b>impacted user experience</b>. Most notably, <i>exceedingly
                   simple actions</i> were <i>cumbersome</i> and required <i>many unnecessary clicks</i> to be performed.</p> 
                   
                   <p>
                   For instance, the <b>main menu</b> containing <i>often-used options</i> such as <i>Styles</i>, <i>Store</i>, <i>Blog</i>, <i>Settings</i>, etc. was previously located 
                   <b>on its own page</b>, which meant users needed to <i>first click a button</i> to access it, after which the UI would show <i>nothing but this menu</i>, then <i>click on another 
                   button</i> to <b>get back to editing the website</b>.
                   </p>
                   
                   <p>
                   This <b>inefficient pattern</b> was a <b>recurring theme</b> and one also had to <i>click multiple times</i> to access other <i>basic resources</i> such as the 
                   list of <i>website pages</i> and the list of <i>website sections</i>, always <b>hiding other essential features</b> when doing so. The new design <b>completely solved</b> 
                   the problem by providing <i>simultaneous access</i> to <b>all important features</b>.
                   </p>`
);

// Page two - Canned Replies
editorDetailedInfo.AddPage(
    "Upsell Call-To-Action Buttons",
    ["images/portfolio/editor/call-to-action.webp"],
    `<p>Three new <b>upsell call-to-action buttons</b> were added to the UI, <b>greatly boosting</b> conversion potential.</p> 

                <p>These <i>easily accessible</i> buttons serve as subtle, <b>constant reminders</b> of <i>Strikingly</i>'s three main products: it's <b>premium plans</b>, 
                <b>domains</b> and <b>web design services</b>.
                </p>`
);

// Page three - Right Side Panel
editorDetailedInfo.AddPage(
    "Interactive Tour",
    ["images/portfolio/editor/tour-animated.webp"],
    `<p>The new <b>Knowledge-Base-integrated tutorials</b> within <i>Strikingly</i>'s <b>redesigned editor</b> represent a <b>groundbreaking approach</b> 
                to <i>user education</i> and <i>support</i>. </p>
                
                <p>These <i>tutorials transcend</i> traditional <i>text-based learning</i> by offering an <b>immersive</b>, <b>tour-like experience</b> 
                directly <b>inside the editor</b> itself. As users navigate through the <i>interactive articles</i>, <b>visual cues</b> guide them through each step, effectively <i>turning instructions</i> 
                into <b>hands-on practice</b>.</p> 
                
                <p>This new approach not only significantly <b>enhances comprehension</b> and <b>retention</b> by allowing users to <i>apply new knowledge immediately</i> and <i>more effectively</i>,
                but also <b>greatly reduces the load</b> on <i>Strikingly</i>'s <b>technical support team</b>.</p> 
                
                <p>Augmented by <b>AI-powered voice narration</b>, 
                the tutorials <i>cater to diverse learning preferences</i>, ensuring accessibility for all users.</p>
`
);

// Page four - AI Tools
editorDetailedInfo.AddPage(
    "Quick Access Toolbar",
    ["images/portfolio/editor/quick-access.jpg"],

    `<p>
                    The new <b>Quick Access Toolbar</b> offers an <i>effortless onboarding experience</i> for new users, <b>streamlining</b> their <b>initial setup process</b>! It enables 
                    the <i>immediate addition</i> of our <i>most sought-after sections</i>, the <b>Store</b> and <b>Blog</b>, into the website.
                </p> 
                
                <p> 
                    <i>Upon adding these sections</i>, the <b>buttons transform</b> into <b>a convenient toolbar</b> that <i>comes equipped</i> with <b>intuitive buttons</b> for 
                    <i>common tasks</i>, such as <b>"Add Product"</b>, and also features <i>dynamic statistics counters</i> that display <b>key metrics</b> such as <i>number of orders</i> 
                    or <i>blog post views</i>.
                </p>

                <p>This <b>section can be customized</b> as well as <i>hidden</i> in <b>Settings</b>.</p>`
)

editorDetailedInfo.AddPage(
    "Varied Functionality",
    [],
    `<p>In addition to being <b>exclusively responsible</b> for the <i>radical</i> <b>complete redesign</b>, I have also provided <b>numerous other key suggestions</b> 
                    that <b>greatly improved</b> the <b>editor's UI</b> and <i>significantly</i> <b>enhanced user experience</b>. Below, you can find some of them, <i>exactly as
                    I submitted to my bosses</i>. Some of them accompany mock-ups created in <i>Photoshop</i> and <i>Inspect</i> <b>showing how my proposed changed would look</b>. <i>HO</i> stands for <i>Happiness Officer</i>, our <i>support agents</i>:</p>

                <p><b><a href="https://docs.google.com/document/d/1A6HuWY_SkX-C9M3GWQDl-TilmqqOHqBL3HTjJzIlm3I/edit" target="_blank">General Editor Feedback</a></b></p>
                
                <p><b><a href="https://docs.google.com/document/d/1DOQaYGvBnB0JyVlVlkBc-VA1ygc3E32JDgoz_qQ9tSc/edit" target="_blank">AI-Powered Website Generator Feedback</a></b></p>`
);

const strikinglyEditor = new PortfolioItem(editorMainInfo, editorDetailedInfo);

portfolioContent.push(strikinglyEditor);


/* END STRIKINGLY EDITOR */







/* Morbus Mundi */
const gameMainInfo = new MainInfo("Morbus Mundi's UI", "Personal Project", "Computer Game",
    ['images/portfolio/game/morbus-mundi-thumbnail-1.jpg', 'images/portfolio/game/morbus-mundi-thumbnail-2.jpg', 'images/portfolio/game/morbus-mundi-thumbnail-3.jpg',
        'images/portfolio/game/morbus-mundi-thumbnail-4.jpg', 'images/portfolio/game/morbus-mundi-thumbnail-5.jpg'],
    `<p><b>Morbus Mundi</b> was a <i>fantasy MMORPG</i> being developed by me as a <i>learning project</i> in <b>Unity Engine</b>. I worked on it by myself for a few
                    months. Eventually, the project was <i>abandoned</i>, which was my <i>original intention</i> to begin with because proper <i>MMORPG games</i> are, of course, <b>enormously complex</b>
                    and require <i>dozens of people</i> to be created.</p>

                    <p>Inside the game, a <b>color-processing algorithm</b> was going to be implemented in order to <b>calculate the contrast</b> between the <i>UI elements</i> and 
                    the <i>game's graphics</i> underneath and <b>adjust the UI's opacity</b> and <b>background color</b> accordingly in order to <b>maximize readability</b>.</p>
                    `, 'https://github.com/PythonMillionaire/MorbusMundiUI', { url: 'https://morbusmundiui.netlify.app/', text: 'Functional Mock-up' }, ['Photoshop', 'Unity', 'C#']);


const gameDetailedInfo = new DetailedInfo();

// Page one - Left Side Panel
gameDetailedInfo.AddPage(
    "Status",
    ["images/portfolio/game/status.png"],
    `<p>The <b>Status</b> panel shows the <i>character's</i> <b>status indicators</b>, namely <i>Health</i>, <i>Mana</i>, <i>Stamina</i> and <i>Combat Points</i>. To the left is
                the <i>Experience Points</i> bar and, in the lower right corner, the <i>character's current level</i>.</p>

                <p>At the bottom, one can find the <i>same indicators</i> shown for <b>party members</b>.</p>`
);

// Page one - Left Side Panel
gameDetailedInfo.AddPage(
    "Character Information",
    ["images/portfolio/game/attributes.png"],
    `<p>The <b>Character Information</b> panel includes all of the <i>character's most important information</i>. It is split into five tabs, each
                containing a different type of data.</p>

                <p>The first and <b>most important</b> one is the <b>Attributes</b> tab. Here, one can find the <b>basic attributes</b>, which are <i>Strength</i>, <i>Constitution</i>, 
                <i>Agility</i>, <i>Intelligence</i> and <i>Spirit</i>, upon which <b>secondary stats</b> are based, such as number of <i>health points</i>, <i>physical</i> and <i>magical damage</i>, 
                <i>defense</i>, <i>movement speed</i>, etc.</p>`
);

// Page two - Canned Replies
gameDetailedInfo.AddPage(
    "Inventory",
    ["images/portfolio/game/inventory.png"],
    `<p>The <b>Inventory</b> window serves as the centralized hub for managing a <b>player's items</b> and <b>equipment</b> within the game.</p>

                <p>The <b>left section</b> is dedicated to <b>equipment slots</b>, outlining where items can be equipped on the character. The 
                larger <b>section to the right</b> contains an extensive grid layout, representing the <b>general inventory space</b>.</p>`
);

// Page three - Right Side Panel
gameDetailedInfo.AddPage(
    "Chat & Combat Log",
    ["images/portfolio/game/chat.png"],
    `<p>The <b>Chat</b> and <b>Combat Log</b> windows are essential features for <i>in-game communication</i> and <i>battle awareness</i>. The <b>Combat Log</b>, 
                situated at the top, provides <i>real-time feedback</i> on the <i>most important actions</i> taken or received during combat, such as <i>spells</i> and <i>healing effects</i>.</p>

                <p>Below lies the <b>Chat</b> window, which is divided into tabs  such as <b>General</b>, <b>Party</b>, and <b>Clan</b>, enabling players to 
                communicate with specific groups at a time.</p>`
);

// Page four - AI Tools
gameDetailedInfo.AddPage(
    "Map & Quest",
    ["images/portfolio/game/map-and-quest.png"],

    `<p>The <b>Mini Map</b> is displayed at the top to help players <i>navigate the in-game world</i>. Just underneath are buttons for opening the 
                <i>enlarged version of the map</i> and <i>zooming in</i> and <i>out</i>.</p>

                <p>Below the map, the <b>Objectives</b> panel lists <i>current quests</i> and <i>missions</i>, keeping track of progress with <i>clear indicators</i> such as 
                <i>checkboxes for completed tasks</i> and <i>counters for collectible items</i>. It also <b>alerts players</b> to <i>time-sensitive objectives</i>, ensuring they 
                remain aware of the tasks at hand to advance their journey.</p>
              </p>`);

const game = new PortfolioItem(gameMainInfo, gameDetailedInfo);

portfolioContent.push(game);


/* END Morbus Mundi */










function scrollToProjectTop() {
    document.querySelector('.portfolio-item-project-page-list').scrollIntoView({ behavior: 'smooth' });
}

function scrollToProjectPageTop() {
    document.getElementById('portfolio-item-top-container').scrollIntoView({ behavior: 'smooth' });
}

function unselectAllProjectDetailNumbers() {
    const allSelectedProjectNumbers = document.querySelectorAll('.portfolio-item-project-details-page-list .selected');

    allSelectedProjectNumbers.forEach(number => {
        number.classList.remove('selected');
    });
}


function unselectAllProjectNumbers() {
    const allSelectedProjectNumbers = document.querySelectorAll('.portfolio-item-project-page-list .selected');

    allSelectedProjectNumbers.forEach(number => {
        number.classList.remove('selected');
    });
}

function selectSpecificProjectNumber(index) {
    unselectAllProjectNumbers();

    const allProjectNumberLists = document.querySelectorAll('.portfolio-item-project-page-list');

    allProjectNumberLists.forEach(numberList => {
        const allProjectNumbers = numberList.querySelectorAll('.portfolio-page-number');

        allProjectNumbers[index].classList.add('selected');
    });

}


// called after current project changes
function loadCurrentProjectContent(shouldScroll = true) {
    const currentProjectMainInfo = portfolioContent[currentProjectIndex]['mainInfo'];

    document.getElementById('portfolio-item-project-name').innerHTML = `${currentProjectMainInfo.projectName}`;

    document.getElementById('portfolio-item-project-client').innerHTML = `<b>Client:</b> ${currentProjectMainInfo.projectClient}`;
    document.getElementById('portfolio-item-project-type').innerHTML = `<b>Type:</b> <i>${currentProjectMainInfo.projectType}</i>`;
    document.getElementById('portfolio-item-description').innerHTML = currentProjectMainInfo.projectDescription;

    const allTechnologies = document.querySelectorAll('#portfolio-item-project-technologies .portfolio-item-technology');

    allTechnologies.forEach(technology => {
        technology.style.display = currentProjectMainInfo.projectTechnologies.includes(technology.querySelector('img').dataset.technology) ?  'flex' : 'none';
    })

    '#portfolio-item-project-technologies .portfolio-item-technology'

    let gitHubElementHtml;

    if (currentProjectMainInfo.projectGitHub === 'Closed source')
        gitHubElementHtml = `<img class="social-media-icon disabled-darker" src="icons/github-min.svg" alt="GitHub icon"> <i class="disabled-darker">Closed source</i> `;
    else
        gitHubElementHtml = `
                            <img class="social-media-icon" src="icons/github-min.svg" alt="GitHub icon"> GitHub
                            `;

    const gitHubElement = document.getElementById('portfolio-item-github');
    gitHubElement.href = currentProjectMainInfo.projectGitHub;
    gitHubElement.innerHTML = gitHubElementHtml;

    const websiteSection = document.getElementById('portfolio-item-official-website');
    websiteSection.href = currentProjectMainInfo.projectWebsite["url"];
    websiteSection.innerHTML = `<img class="social-media-icon" src="icons/website-min.svg" alt="Official website icon" /> ${currentProjectMainInfo.projectWebsite["text"]}`;

    const topImage = document.querySelector('#portfolio-item-top-image > img');

    topImage.src = currentProjectMainInfo.projectTopImage.replace("-thumbnail", "");

    // Wait for the image to load before executing the animation
    topImage.addEventListener('animationend', function() {
        //topImage.classList.remove('animate');

        gsap.killTweensOf(topImage);

        gsap.set(topImage, { y: 0 });

        gsap.to(topImage, {
            scale: 1, // Maintain original scale
            y: function() {
                // Now that the image is loaded, offsetHeight should be correct
                return -(topImage.offsetHeight - 100) + "px"; // Adjusted to move up by the image height plus an additional 400px
            },
            repeat: -1, // Infinite loop
            yoyo: true, // Animation reverses on alternate iterations
            ease: "power2.inOut", // Smooth, non-linear speed
            duration: 5, // Duration of one complete cycle (to the top and back)
        });
    });


    const imageGallery = document.getElementById('portfolio-item-image-gallery-thumbnails');

    let imagesHtml = "";
    currentProjectMainInfo['projectImages'].forEach(imageURL => {
        imagesHtml += `<img src="${imageURL}" class="thumbnail">`;

    });
    imageGallery.innerHTML  = imagesHtml;

    imageGallery.querySelectorAll('img').forEach(img => {
        addOrReplaceEventListener(img, 'click', handleZoomOverlayCreation(img, true));
    });

    currentPageIndex = 0;
    projectImageGalleryCurrentIndex = 0;

    loadCurrentPageContent();

    resetPageArrows();

    if (shouldScroll)
        scrollToProjectTop();

    setUpImageGalleryNavigation();

    setUpNavigation(false);
}

function loadCurrentPageContent(){
    const currentProjectDetailedInfo = portfolioContent[currentProjectIndex].detailedInfo.pages[currentPageIndex];

    document.querySelector('#portfolio-item-details-title > h4').innerHTML = `${currentProjectDetailedInfo.pageTitle}`;

    let imagesHtml = "";

    currentProjectDetailedInfo.pageImages.forEach(imageURL => {
        imagesHtml += `<img src="${imageURL}" class="thumbnail">`;
    });

    const container = document.getElementById('portfolio-item-details-content');

    const imageGallery = document.getElementById('portfolio-item-page-image-gallery');
    imageGallery.innerHTML = `<span>${imagesHtml}</span>`;

    imageGallery.querySelectorAll('img').forEach(img => {
        addOrReplaceEventListener(img, 'click', handleZoomOverlayCreation(img));
    });

    // if there are no images, remove the gap so the text covers everything
    if (imagesHtml) {
        container.style.gap = '80px';
    } else {
        container.style.gap = '0px';
    }

    document.getElementById('portfolio-item-page-content').innerHTML = `<span>${currentProjectDetailedInfo.pageContent}</span>`;

    scrollToProjectPageTop();
    setUpImageGalleryNavigation();
}

function navigateProject(direction) {
    let validNavigation = false;
    let fadeOutClass, fadeInClass;

    // Determine the direction of navigation and set classes accordingly
    if (direction === "next" && portfolioContent.length > currentProjectIndex + 1) {
        currentProjectIndex++;
        fadeOutClass = 'fade-out-right';
        fadeInClass = 'fade-in-left';
        validNavigation = true;
    } else if (direction === "previous" && 0 < currentProjectIndex) {
        currentProjectIndex--;
        fadeOutClass = 'fade-out-left';
        fadeInClass = 'fade-in-right';
        validNavigation = true;
    }

    // Proceed if the navigation is valid (within bounds)
    if (validNavigation) {
        const portfolioSection = document.querySelector('#portfolio-item');
        portfolioSection.classList.add(fadeOutClass);

        // Listen for animation end
        portfolioSection.addEventListener('animationend', () => {
            loadCurrentProjectContent();

            // Remove the fade-out class and add fade-in class
            portfolioSection.classList.remove(fadeOutClass);
            portfolioSection.classList.add(fadeInClass);

            // Update navigation button states
            updateNavigationButtons('project', direction);

            // Highlight the current project number
            highlightCurrentNumber('project');

            // Remove the fade-in class after it completes to avoid it reapplying
            portfolioSection.addEventListener('animationend', () => {
                portfolioSection.classList.remove(fadeInClass);
            }, { once: true });

        }, { once: true });

        // Reset the current project detail page index
        currentPageIndex = 0;
    }
}

function nextProject() {
    navigateProject("next");
}


function previousProject() {
    navigateProject("previous");
}

function updateNavigationButtons(context, direction) {
    let prevSelector, nextSelector, isAtStart, isAtEnd;

    if (context === 'project') {
        prevSelector = '.portfolio-navigation.previous';
        nextSelector = '.portfolio-navigation.next';
        isAtStart = currentProjectIndex === 0;
        isAtEnd = portfolioContent.length === currentProjectIndex + 1;
    } else if (context === 'page') {
        prevSelector = '.portfolio-page-navigation.previous';
        nextSelector = '.portfolio-page-navigation.next';
        isAtStart = currentPageIndex === 0;
        isAtEnd = portfolioContent[currentProjectIndex].detailedInfo.pages.length === currentPageIndex + 1;
    }

    if (direction === "next") {
        document.querySelectorAll(prevSelector).forEach(el => el.classList.remove('disabled'));
        if (isAtEnd) {
            document.querySelectorAll(nextSelector).forEach(arrow => arrow.classList.add('disabled'));
        }
    } else if (direction === "previous") {
        document.querySelectorAll(nextSelector).forEach(el => el.classList.remove('disabled'));
        if (isAtStart) {
            document.querySelectorAll(prevSelector).forEach(arrow => arrow.classList.add('disabled'));
        }
    }
}

function highlightCurrentNumber(context) {
    // Determine the selector and index based on the context
    let selector, index;
    if (context === 'project') {
        selector = '.portfolio-item-project-page-list';
        index = currentProjectIndex;
        unselectAllProjectNumbers(); // Assuming this function unselects all project numbers
    } else if (context === 'page') {
        selector = '.portfolio-item-project-details-page-list';
        index = currentPageIndex;
        unselectAllProjectDetailNumbers(); // Assuming this function unselects all page detail numbers
    } else {
        console.error('Invalid context provided to highlightCurrentNumber function');
        return;
    }

    const allNumberLists = document.querySelectorAll(selector);
    allNumberLists.forEach(numberList => {
        const allNumbers = numberList.querySelectorAll('.portfolio-page-number');
        if (allNumbers[index]) { // Check if the element exists to avoid errors
            allNumbers[index].classList.add('selected');
        }
    });
}

function navigatePage(direction) {
    let pageChanged = false;
    let fadeOutClass, fadeInClass;

    // Determine the direction of navigation and set classes accordingly
    if (direction === "next" && portfolioContent[currentProjectIndex].detailedInfo.pages.length > currentPageIndex + 1) {
        currentPageIndex++;
        fadeOutClass = 'fade-out-right';
        fadeInClass = 'fade-in-left';
        pageChanged = true;
    } else if (direction === "previous" && 0 < currentPageIndex) {
        currentPageIndex--;
        fadeOutClass = 'fade-out-left';
        fadeInClass = 'fade-in-right';
        pageChanged = true;
    }

    // Proceed if the navigation is valid (within bounds)
    if (pageChanged) {
        const detailsContainer = document.querySelector('#portfolio-item-details-container');
        detailsContainer.classList.add(fadeOutClass);

        // Listen for animation end
        detailsContainer.addEventListener('animationend', () => {
            loadCurrentPageContent();

            // Remove the fade-out class and add fade-in class
            detailsContainer.classList.remove(fadeOutClass);
            detailsContainer.classList.add(fadeInClass);

            // Update navigation button states
            updateNavigationButtons('page', direction);

            // Highlight the current page number
            highlightCurrentNumber('page');

            // Remove the fade-in class after it completes to avoid it reapplying
            detailsContainer.addEventListener('animationend', () => {
                detailsContainer.classList.remove(fadeInClass);
            }, { once: true });

        }, { once: true });
    }
}


function nextPage() {
    navigatePage("next");
}

function previousPage() {
    navigatePage("previous");
}


function resetPageArrows() {
    // loading the previous is now possible
    const previousArrows = document.querySelectorAll('.portfolio-page-navigation.previous');
    previousArrows.forEach(el => {
        el.classList.add('disabled');
    });

    // loading the next is now possible
    const nextArrows = document.querySelectorAll('.portfolio-page-navigation.next');
    nextArrows.forEach(el => {
        el.classList.remove('disabled');
    });
}


function setUpButtons() {
    /* project navigation */
    const projectArrows = document.querySelectorAll('.portfolio-navigation');

    addOrReplaceEventListener(projectArrows[0], 'click', previousProject);
    projectArrows[0].classList.add('disabled');
    addOrReplaceEventListener(projectArrows[2], 'click', previousProject);
    projectArrows[2].classList.add('disabled');

    // next
    addOrReplaceEventListener(projectArrows[1], 'click', nextProject);
    addOrReplaceEventListener(projectArrows[3], 'click', nextProject);



    /* page navigation */
    const pageArrows = document.querySelectorAll('.portfolio-page-navigation');

    // previous
    addOrReplaceEventListener(pageArrows[0], 'click', previousPage);
    pageArrows[0].classList.add('disabled');
    addOrReplaceEventListener(pageArrows[2], 'click', previousPage);
    pageArrows[2].classList.add('disabled');

    // next
    addOrReplaceEventListener(pageArrows[1], 'click', nextPage);
    addOrReplaceEventListener(pageArrows[3], 'click', nextPage);
}

let projectImageGalleryCurrentIndex = 0;




// project image gallery navigation buttons
function setUpImageGalleryNavigation() {
    const thumbnails = document.querySelectorAll('#portfolio-item-image-gallery-thumbnails img');
    const leftArrow = document.getElementById('portfolio-item-image-gallery-left-arrow');
    const rightArrow = document.getElementById('portfolio-item-image-gallery-right-arrow');

    const maxNumberOfImages = 3;

    function updateGallery() {
        thumbnails.forEach((img, index) => {
            img.style.display = (index >= projectImageGalleryCurrentIndex && index < projectImageGalleryCurrentIndex + 3) ? 'block' : 'none';
        });

        leftArrow.classList.toggle( 'disabled-darker', projectImageGalleryCurrentIndex === 0);
        rightArrow.classList.toggle( 'disabled-darker', projectImageGalleryCurrentIndex >= thumbnails.length - 3);
    }

    function moveBack(event) {
        if (thumbnails.length > maxNumberOfImages)
            event.preventDefault();

        if (projectImageGalleryCurrentIndex > 0) {
            projectImageGalleryCurrentIndex--;
            updateGallery();
        }
    }

    addOrReplaceEventListener(leftArrow, 'click', moveBack);

    function moveForward(event) {
        if (thumbnails.length > maxNumberOfImages)
            event.preventDefault();

        if (projectImageGalleryCurrentIndex < thumbnails.length - 3) {
            projectImageGalleryCurrentIndex++;
            updateGallery();
        }
    }

    addOrReplaceEventListener(rightArrow, 'click', moveForward);

    function mouseScrolled(event) {
        if (event.deltaY > 90)
            moveForward(event);

        else if (event.deltaY < -90)
            moveBack(event);
    }

    addOrReplaceEventListener(leftArrow.parentElement, 'wheel', mouseScrolled);

    updateGallery();
}

function populatePageNumbers(navigationList, loopIndex, whichIndexToUse, unselectFunction, nextFunction, previousFunction) {
    const itemNumber = document.createElement('div');
    itemNumber.classList.add('portfolio-page-number');
    itemNumber.textContent = loopIndex;

    let scrollFunction;

    // Create a tooltip only for project numbers
    if (whichIndexToUse === 'currentProjectIndex') {
        const tooltip = document.createElement('span');
        tooltip.classList.add('custom-tooltip'); // Assuming you have CSS for this class
        tooltip.innerHTML = `<b>${portfolioContent[loopIndex - 1].mainInfo.projectName}</b> - <i>${portfolioContent[loopIndex - 1].mainInfo.projectType}</i>`; // Display project name in the tooltip
        itemNumber.appendChild(tooltip);

        scrollFunction = scrollToProjectTop;
    }
    else
        scrollFunction = scrollToProjectPageTop;

    function handleItemClick() {
        const newIndex = loopIndex - 1;  // Adjust index to be 0-based

        let currentIndexValue;
        if (whichIndexToUse === 'currentProjectIndex')
            currentIndexValue = currentProjectIndex;
        else
            currentIndexValue = currentPageIndex;

        if (newIndex === currentIndexValue) {
            scrollFunction();

            return;
        }

        unselectFunction();

        if (newIndex > currentIndexValue) {
            if (whichIndexToUse === 'currentProjectIndex')
                currentProjectIndex = newIndex - 1;
            else
                currentPageIndex = newIndex - 1;
            nextFunction();
        } else {
            if (whichIndexToUse === 'currentProjectIndex')
                currentProjectIndex = newIndex + 1;
            else
                currentPageIndex = newIndex + 1;
            previousFunction();
        }
    }

    addOrReplaceEventListener(itemNumber, 'click', handleItemClick);

    navigationList.appendChild(itemNumber);
}


function setUpNavigation(isProjectNavigation) {
    let containerSelector, itemCount, nextFunction, previousFunction, whichIndexToUse, unselectFunction;

    if (isProjectNavigation) {
        // Setup for project navigation
        containerSelector = '.portfolio-item-project-page-list';
        itemCount = portfolioContent.length;
        nextFunction = nextProject;
        previousFunction = previousProject;

        unselectFunction = unselectAllProjectNumbers;

        whichIndexToUse = 'currentProjectIndex';
    } else {
        // Setup for detail page navigation
        containerSelector = '.portfolio-item-project-details-page-list';
        itemCount = portfolioContent[currentProjectIndex].detailedInfo.pages.length;

        nextFunction = nextPage;
        previousFunction = previousPage;

        unselectFunction = unselectAllProjectDetailNumbers;

        whichIndexToUse = 'currentPageIndex';
    }

    const allNavigationLists = document.querySelectorAll(containerSelector);

    allNavigationLists.forEach(navigationList => {
        navigationList.innerHTML = ''; // Clear existing items if any

        for (let i = 1; i <= itemCount; i++) {
            populatePageNumbers(navigationList, i, whichIndexToUse, unselectFunction, nextFunction, previousFunction);
        }

        // Optionally, select the first item by default if it exists
        if (itemCount > 0) {
            navigationList.firstChild.classList.add('selected');
        }
    });
}

document.addEventListener('portfolioPageLoaded', _ => {
    setUpButtons();

    loadCurrentProjectContent(false);
    loadCurrentPageContent();

    setUpImageGalleryNavigation();

    setUpNavigation(true);
});





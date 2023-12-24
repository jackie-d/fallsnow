
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let idleCycles = 0;
let IS_SOFT_MODE = sessionStorage.getItem("IS_SOFT_MODE") || false;
let STOP_TIME = 0;

(async () => {

    //IS_SOFT_MODE = (await chrome.storage.local.get(["IS_SOFT_MODE"]).IS_SOFT_MODE) || false;

    while (1) {
        if ( STOP_TIME > 0 ) {
            await sleep(60*1000);
            STOP_TIME--;
            continue;
        }
        if ( idleCycles > 10000 ) {
            await sleep(1000);
            continue;
        }
        const elems = document.body.getElementsByTagName("*");
        const index = Math.floor(Math.random() * (0 - elems.length + 1)) + elems.length;
        const randomElement = elems[index];
        if( String(randomElement.className).indexOf('fallsnow') != -1 ) {
            idleCycles++;
            continue;
        }
        if( String(randomElement.className).indexOf('fallsnow-skip') != -1 ) {
            continue;
        }
        if ( 
                randomElement instanceof SVGElement ||
                randomElement.tagName == 'DIV' ||
                randomElement.tagName == 'SPAN' ||
                randomElement.tagName == 'SCRIPT' ||
                randomElement.tagName == 'LINK' ||
                randomElement.tagName == 'ASIDE' ||
                randomElement.tagName == 'ARTICLE' ||
                randomElement.tagName == 'FOOTER' ||
                randomElement.tagName == 'SECTION' ||
                randomElement.tagName == 'DETAILS' ||
                randomElement.tagName == 'SUMMARY' ||
                randomElement.tagName == 'HEADER' ||
                randomElement.tagName == 'NAV' ||
                randomElement.tagName == 'TABLE' ||
                randomElement.tagName == 'THEAD' ||
                randomElement.tagName == 'TR' ||
                randomElement.tagName == 'UL' ||
                randomElement.tagName == 'FORM' ||
                !isElementInTopOfTheViewport(randomElement)
            ) 
        {
            randomElement.classList.add("fallsnow-skip");
            continue;
        }
        if ( !IS_SOFT_MODE ) {
            randomElement.classList.add("fallsnow");
        }
        makeItFall(randomElement);
        const waitTime = Math.random() * 300 + 5;
        await sleep(waitTime);
    }
})();

addEventListener('scroll', () => {
    idleCycles = 0;
});


async function makeItFall(element) {

    var rect = element.getBoundingClientRect();

    if ( IS_SOFT_MODE ) {
        let originalElement = element;
        element = element.cloneNode(true);
        element.style.position = 'fixed';
        originalElement.parentNode.insertBefore(element, originalElement.nextSibling);
    }

    element.style.position = 'fixed';
    element.style.top = rect.top + 'px';
    element.style.left = rect.left + 'px';
    // element.style.width = element.style.width || (parseInt(element.offsetWidth) + 'px');
    // element.style.height = element.style.height || (parseInt(element.offsetHeight) + 'px');

    const ground = window.innerHeight - 40;
    const fallTime = Math.random() * 50 + 20;
    let isSmoothSideMoveCounter = false;

    while ( parseInt(element.style.top) < ground ) {
        element.style.top = (parseInt(element.style.top) + 5) + 'px';
        if ( isSmoothSideMoveCounter = !isSmoothSideMoveCounter ) {
            const sideMove = Math.random() * 20 - 10;
            element.style.left = (parseInt(element.style.left) + sideMove) + 'px';
        }
        await sleep(fallTime);
    }
}


function isElementInTopOfTheViewport (el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) / 2   
    );
}

document.onkeydown = keydown;

async function keydown(evt){
  if (!evt) evt = event;
  if (evt.ctrlKey && evt.key == 'm') {
    IS_SOFT_MODE = !IS_SOFT_MODE;
    sessionStorage.setItem("IS_SOFT_MODE", IS_SOFT_MODE);
    //chrome.storage.local.set({ 'IS_SOFT_MODE': IS_SOFT_MODE })
    showMessage(IS_SOFT_MODE ? 'Snow is not bad' : 'Snow is bad');
  }
  if (evt.ctrlKey && evt.key == 'q'){
    STOP_TIME++;
    showMessage(`Snow stopped for ${STOP_TIME} minutes`);
  }
}

async function showMessage(text) {
    const message = document.createElement("p");
    message.innerHTML = text;
    message.classList.add('overlay-message');
    document.getElementsByTagName('body')[0].append(message);
    sleep(1000).then(() => message.remove());
}
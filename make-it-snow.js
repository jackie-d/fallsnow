
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let idleCycles = 0;

(async () => {

    while (1) {
        if ( idleCycles > 10000 ) {
            await sleep(1000);
            continue;
        }
        const elems = document.body.getElementsByTagName("*");
        const index = Math.floor(Math.random() * (0 - elems.length + 1)) + elems.length;
        const randomElement = elems[index];
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
            continue;
        }
        if( String(randomElement.className).indexOf('fallsnow') != -1 ) {
            idleCycles++;
            continue;
        }
        randomElement.classList.add("fallsnow");
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

    element.style.position = 'fixed';
    element.style.top = rect.top + 'px';
    element.style.left = rect.left + 'px';
    // element.style.width = element.style.width || (parseInt(element.offsetWidth) + 'px');
    // element.style.height = element.style.height || (parseInt(element.offsetHeight) + 'px');

    const ground = window.innerHeight - 40;
    const fallTime = Math.random() * 50 + 20;

    while ( parseInt(element.style.top) < ground ) {
        element.style.top = (parseInt(element.style.top) + 5) + 'px';
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
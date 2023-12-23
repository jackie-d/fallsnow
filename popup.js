
document.getElementById("fallsnowActive").addEventListener("click", toggleSnow);
document.getElementById("fallsnowOff").addEventListener("click", toggleSnow);


async function toggleSnow() {
    const isSnowing = document.querySelector('input[name="fallsnowActive"]:checked').value;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id, 
            {
                isSnowing
            }, 
            function(response) {}
        )
    });

}



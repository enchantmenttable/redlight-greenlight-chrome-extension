const startButton = document.getElementById("start");
const playButton = document.getElementById("play");

async function readLocalStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (data) => {
            if (data[key] === undefined) {
                reject("không thấy");
            } else {
                resolve(data[key])
            }
        })
    })
}

// async function init() {
//     playButton.checked = await readLocalStorage("play");
// }
// init()


playButton.addEventListener("change", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [playButton.checked],
        func: switchState,
    });

    chrome.storage.local.set({ play: playButton.checked })
})


function switchState(isPlaying) {
    function redlight() {
        const allInputs = document.getElementsByTagName("input");
        Array.from(allInputs).forEach(input => {
            input.value = ""
        });
    }

    function play() {
        if (switcher) {
            chrome.runtime.sendMessage({ type: "updateRedIcon" });
            setTimeout(() => {
                document.addEventListener("keypress", redlight);
                switcher = 0;
                console.log("done red");
            }, 400);
        } else {
            chrome.runtime.sendMessage({ type: "updateGreenIcon" });
            document.removeEventListener("keypress", redlight);
            switcher = 1;
            console.log("done green");
        }
    }

    let switcher = 1;
    if (isPlaying) {
        let intervalId = setInterval(play, 1500);
        chrome.runtime.sendMessage({ type: "setInterval", id: intervalId });
    } else {
        chrome.runtime.sendMessage({ type: "clearInterval" });
        console.log("unchecked");
    }
}

chrome.runtime.onMessage.addListener((message, sender, response) => {
    if (message.type === "hehe") {

        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                args: [message.id],
                func: injectClearInterval,
            });

        });

    }
})

function injectClearInterval(intervalId) {
    console.log("clearInterval from background received");
    window.clearInterval(intervalId);
}

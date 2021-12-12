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

async function init() {
    try {
        playButton.checked = await readLocalStorage("play");
    } catch {
        playButton.checked = false;
    }
}
init()

playButton.addEventListener("change", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (playButton.checked) {
        chrome.tabs.sendMessage(tab.id, { type: "play" });
        chrome.storage.local.set({ play: true });
    } else {
        chrome.tabs.sendMessage(tab.id, { type: "stop" });
        chrome.storage.local.set({ play: false })
    }
})
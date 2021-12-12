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

chrome.runtime.onMessage.addListener((message, sender, response) => {
    if (message.type === "updateRedIcon") {
        chrome.action.setIcon({ path: "../images/red-circle-32.png" });
    } else if (message.type === "updateGreenIcon") {
        chrome.action.setIcon({ path: "../images/green-circle-32.png" });
    } else if (message.type === "stop") {
        chrome.action.setIcon({ path: "../images/that-doll-32.png" });
    }
})

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.clear(() => { })
})

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({ play: false });
})
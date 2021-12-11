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

chrome.runtime.onMessage.addListener(async (message, sender, response) => {
    console.log("sender", sender);
    console.log("sender tab", sender.tab);
    console.log("sender tab id", sender.tab.id);
    if (message.type === "updateRedIcon") {
        chrome.action.setIcon({ path: "../images/red-circle-32.png" });
    } else if (message.type === "updateGreenIcon") {
        chrome.action.setIcon({ path: "../images/green-circle-32.png" });
    } else if (message.type === "setInterval") {
        chrome.storage.local.set({ intervalId: message.id }, data => console.log("setInterval", data));
    } else if (message.type === "clearInterval") {
        chrome.action.setIcon({ path: "../images/that-doll-32.png" });

        // chrome.storage.local.get("intervalId", data => {
        //     console.log("sender.tab.id", sender.tab.id);
        //     chrome.tabs.sendMessage(sender.tab.id, { type: "clearInterval", id: data.intervalId }, data => console.log(data));
        //     chrome.storage.local.remove("intervalId");
        // })
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.storage.local.get("intervalId", data => {
                chrome.tabs.sendMessage(tabs[0].id, { type: "hehe", id: data.intervalId });
                chrome.storage.local.remove("intervalId");
            })
        })
    }
})

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.clear(() => { })
})

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({ play: false });
})
chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "updateRedIcon") {
        chrome.action.setIcon({ path: "../images/red-circle-32.png" });
    } else if (request.message === "updateGreenIcon") {
        chrome.action.setIcon({ path: "../images/green-circle-32.png" });
    }
})
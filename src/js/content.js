function redlight() {
    const allInputs = document.getElementsByTagName("input");
    Array.from(allInputs).forEach(input => {
        input.value = ""
    });
}

state = 1;

function switcher() {
    if (state) {
        chrome.runtime.sendMessage({ type: "updateRedIcon" });
        setTimeout(() => {
            document.addEventListener("keypress", redlight);
            state = 0;
        }, 400);
    } else {
        chrome.runtime.sendMessage({ type: "updateGreenIcon" });
        document.removeEventListener("keypress", redlight);
        state = 1;
    }
}

currentIntervalId = 0;

chrome.runtime.onMessage.addListener((message, sender, response) => {
    if (message.type === "stop") {
        window.clearInterval(currentIntervalId);
        chrome.runtime.sendMessage({ type: "stop" });
    } else if (message.type === "play") {
        currentIntervalId = setInterval(switcher, 4000);
    }
})
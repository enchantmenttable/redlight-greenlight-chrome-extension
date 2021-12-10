const startButton = document.getElementById("start");

startButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("done?");
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: switchEvent,
    });
})

function switchEvent() {
    function redlight() {
        const allInputs = document.getElementsByTagName("input");
        Array.from(allInputs).forEach(element => {
            element.value = ""
        });
    }

    let switcher = 1;
    setInterval(() => {
        if (switcher) {
            chrome.runtime.sendMessage({ message: "updateRedIcon" });
            setTimeout(() => {
                document.addEventListener("keypress", redlight);
                switcher = 0;
                console.log("done red");
            }, 400);
        } else {
            chrome.runtime.sendMessage({ message: "updateGreenIcon" });
            document.removeEventListener("keypress", redlight);
            switcher = 1;
            console.log("done green");
        }
    }, 3500);
}

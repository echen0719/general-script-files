// https://stackoverflow.com/questions/47166101
// you may not reuse, copy, edit, or use this script for your own purposes without asking for permissions
// it is very easy to use so I won't provide user support (I will provide code support if I can)

function changeGold(input) {
    if (!input) return;

    const isAddition = input.startsWith("+") || input.startsWith("-");
    const value = parseInt(input, 10);
    if (isNaN(value)) return;

    let component = null;

    for (const element of document.querySelectorAll("*")) {
        const fiberKey = Object.keys(element).find(k => k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$"));
        if (!fiberKey) continue;

        let fiber = element[fiberKey];
        while (fiber) {
            const instance = fiber.stateNode;
            if (instance && instance.props?.liveGameController && instance.state?.gold !== undefined) {
                component = instance;
                break;
            }
            fiber = fiber.return;
        }
        if (component) break;
    }

    if (!component) {
        console.log("Could not find component. Be on the blooket question screen.")
        return
    }

    const currentGold = component.state.gold || 0;
    let targetGold = 0;

    if (isAddition) {
        targetGold = currentGold + value
    }
    else {
        targetGold = value
    }

    component.setState({gold: targetGold, gold2: targetGold});

    component.props.liveGameController.setVal({
        path: `c/${component.props.client.name}`,
        val: {b: component.props.client.blook, g: targetGold}
    });
}

function createUI() {
    const existing = document.getElementById("hacks-ui");
    if (existing) {
        existing.remove();
    }

    const div = document.createElement("div");
    div.id = "hacks-ui";
    div.style.position = "fixed"; div.style.top = "20px"; div.style.right = "20px"; div.style.width = "300px"; div.style.minHeight = "150px"; div.style.padding = "20px";
    div.style.boxSizing = "border-box"; div.style.background = "rgba(0, 0, 0, 0.7)"; div.style.borderRadius = "10px"; div.style.color = "white";

    div.addEventListener("keypress", (e) => {
        if (/^[0-9+\-*/]$/.test(e.key)) {
            e.stopPropagation();
        }
    }, true); // prevent blooket from picking up typed numbers as answer choices

    const title = document.createElement("h3");
    title.textContent = "Gold Quest Hacks"; title.style.margin = "0 0 15px 0"; title.style.fontSize = "20px"; title.style.textAlign = "center";
    div.appendChild(title);

    const input = document.createElement("input");
    input.id = "gold-hacks-input"; input.type = "text"; input.placeholder = "e.g. +5000 or 100000";
    input.title = "Enter a number (i.e. \"1000\" to set, or \"+/-1000\" to add or subtract)";
    input.style.width = "80%"; input.style.padding = "10px"; input.style.marginBottom = "10px"; input.style.border = "1px solid #ccc";
    input.style.borderRadius = "5px"; input.style.fontSize = "14px"; input.style.boxSizing = "border-box";
    div.appendChild(input)

    const button = document.createElement("button");
    button.textContent = "Change Gold"; button.style.width = "80%"; button.style.padding = "10px"; button.style.background = "#4CAF50";
    button.style.color = "white"; button.style.border = "none"; button.style.borderRadius = "5px"; button.style.cursor = "pointer";
    button.style.fontSize = "14px"; button.style.fontWeight = "bold"; button.style.marginBottom = "10px";

    button.onmouseover = () => button.style.background = "#45A049";
    button.onmouseout = () => button.style.background = "#4CAF50";

    button.addEventListener("click", () => {
        const value = input.value.trim();
        if (value) {
            changeGold(value);
            input.value = "";
        }
        else {
            console.log("You typed something wrong. Look at what you put.")
        }
    });

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            button.click();
        }
    });

    div.appendChild(button);

    const close = document.createElement("button")
    close.textContent = "✕"; close.style.position = "absolute"; close.style.top = "10px"; close.style.right = "15px";
    close.style.background = "transparent"; close.style.border = "none"; close.style.color = "white"; close.style.fontSize = "20px";
    close.style.cursor = "pointer"; close.style.padding = "0 5px"; close.style.lineHeight = "1";

    close.onmouseover = () => close.style.color = "#ff6b6b";
    close.onmouseout = () => close.style.color = "white";
    close.onclick = () => div.remove();

    div.appendChild(close);

    document.body.appendChild(div);
}

createUI();

// https://stackoverflow.com/questions/47166101
// you may not reuse, copy, edit, or use this script for your own purposes without asking for permissions
// it is very easy to use so I won't provide user support (I will provide code support if I can)

function getComponent() {
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

    if (component) {
        return component;
    }

    console.log("Could not find component. Be on the blooket question screen.")
    return
}

async function getAllPlayers() {
    const component = getComponent();
    if (!component) return;

    return await component.props.liveGameController.getDatabaseVal("c");
}

async function getAllNames() {
    const allPlayers = await getAllPlayers();
    let names = [];

    Object.entries(allPlayers).forEach(([name]) => {
        names.push(name);
    });

    return names;
}

function changeGold(input) {
    if (!input) return;

    const isAddition = input.startsWith("+") || input.startsWith("-");
    const value = Number(input)
    if (!Number.isFinite(value)) return;

    const component = getComponent();
    if (!component) return;

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

function changeOtherGold(target, input) {
    if (!input) return;

    const isAddition = input.startsWith("+") || input.startsWith("-");
    const value = Number(input)
    if (!Number.isFinite(value)) return;

    const component = getComponent();
    if (!component) return;

    const currentGold = component.state.gold || 0;
    let targetGold = 0;

    if (isAddition) {
        const allPlayers = await getAllPlayers();

        if (!allPlayers || !allPlayers[target]) {
            console.log("No player data found.");
            return;
        }

        const otherGold = allPlayers[target].g || 0;
        targetGold = otherGold + value
    }
    else {
        targetGold = value
    }

    const tatPayload = `${target}:swap:${targetGold}`;

    component.props.liveGameController.setVal({
        path: `c/${component.props.client.name}`,
        val: {tat: tatPayload, b: component.props.client.blook, g: currentGold} // keep own gold, idk server bug
    });
}

// used AI for this as well but I think it is a popular function
function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    // drag handle (top 10px area)
    const dragHandle = document.createElement("div");
    dragHandle.style.position = "absolute";
    dragHandle.style.top = "0";
    dragHandle.style.left = "0";
    dragHandle.style.right = "0";
    dragHandle.style.height = "10px";
    dragHandle.style.cursor = "move";
    dragHandle.style.zIndex = "10";

    element.appendChild(dragHandle);

    dragHandle.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        const rect = element.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        element.style.transition = "none";
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        element.style.left = `${initialLeft + deltaX}px`;
        element.style.top = `${initialTop + deltaY}px`;
        element.style.right = "auto";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
}

function showAllPlayers() {
    const existing = document.getElementById("players-list-ui");
    if (existing) {
        existing.remove();
        return;
    }

    const div = document.createElement("div");

    div.id = "players-list-ui";
    div.style.position = "fixed";
    div.style.top = "20px";
    div.style.right = "450px";
    div.style.minHeight = "150px";
    div.style.width = "300px";
    div.style.padding = "20px";
    div.style.boxSizing = "border-box";
    div.style.background = "rgba(0, 0, 0, 0.7)";
    div.style.borderRadius = "10px";
    div.style.color = "white";

    const title = document.createElement("h3");

    title.textContent = "All Players";
    title.style.margin = "0 0 15px 0";
    title.style.fontSize = "20px";
    title.style.textAlign = "center";

    div.appendChild(title);

    const playerList = document.createElement("div");

    playerList.id = "player-list-div";
    playerList.style.marginBottom = "15px";

    div.appendChild(playerList);

    const refreshButton = document.createElement("button");

    refreshButton.textContent = "Refresh";
    refreshButton.style.width = "50%";
    refreshButton.style.padding = "10px";
    refreshButton.style.background = "#FF9800";
    refreshButton.style.color = "white";
    refreshButton.style.border = "none";
    refreshButton.style.borderRadius = "5px";
    refreshButton.style.cursor = "pointer";
    refreshButton.style.fontSize = "14px";
    refreshButton.style.fontWeight = "bold";

    refreshButton.onmouseover = () => refreshButton.style.background = "#F57C00";
    refreshButton.onmouseout = () => refreshButton.style.background = "#FF9800";

    async function updatePlayerList() {
        playerList.innerHTML = "";

        const allNames = await getAllNames();

        if (!allNames || allNames.length === 0) {
            const noPlayers = document.createElement("p");
            noPlayers.textContent = "No players found. Error? Check console";
            noPlayers.style.textAlign = "center";
            noPlayers.style.color = "#ccc";
            playerList.appendChild(noPlayers);
            return;
        }

        allNames.forEach((name, index) => {
            const playerName = document.createElement("div");
            playerName.textContent = `${index + 1}. ${name}`;
            playerName.style.padding = "8px 10px";
            playerName.style.marginBottom = "5px";
            playerName.style.background = "rgba(255, 255, 255, 0.1)";
            playerName.style.borderRadius = "5px";
            playerName.style.fontSize = "14px";
            playerName.style.cursor = "pointer";

            playerName.onclick = () => {
                navigator.clipboard.writeText(name);
                playerName.style.background = "#4CAF50";
                playerName.textContent = "Copied!";
                setTimeout(() => {
                    playerName.style.background = "rgba(255, 255, 255, 0.1)";
                    playerName.textContent = `${index + 1}. ${name}`;
                }, 1000);
            };

            playerList.appendChild(playerName);
        });
    }

    refreshButton.addEventListener("click", updatePlayerList);

    div.appendChild(refreshButton);

    const close = document.createElement("button");

    close.textContent = "✕";
    close.style.position = "absolute";
    close.style.top = "10px";
    close.style.right = "15px";
    close.style.background = "transparent";
    close.style.border = "none";
    close.style.color = "white";
    close.style.fontSize = "20px";
    close.style.cursor = "pointer";
    close.style.padding = "0 5px";
    close.style.lineHeight = "1";

    close.onmouseover = () => close.style.color = "#ff6b6b";
    close.onmouseout = () => close.style.color = "white";
    close.onclick = () => div.remove();

    div.appendChild(close);

    document.body.appendChild(div);
    makeDraggable(div);

    updatePlayerList();
}

function createUI() {
    const existing = document.getElementById("hacks-ui");
    if (existing) {
        existing.remove();
    }

    const div = document.createElement("div");

    div.id = "hacks-ui";
    div.style.position = "fixed";
    div.style.top = "20px";
    div.style.right = "100px";
    div.style.minHeight = "250px";
    div.style.width = "300px";
    div.style.padding = "20px";
    div.style.boxSizing = "border-box";
    div.style.background = "rgba(0, 0, 0, 0.7)";
    div.style.borderRadius = "10px";
    div.style.color = "white";

    div.addEventListener("keypress", (e) => {
        if (/^[0-9+\-*/]$/.test(e.key)) {
            e.stopPropagation();
        }
    }, true); // prevent blooket from picking up typed numbers as answer choices

    const title = document.createElement("h3");

    title.textContent = "Gold Quest Hacks";
    title.style.margin = "0 0 15px 0";
    title.style.fontSize = "20px";
    title.style.textAlign = "center";
    div.appendChild(title);

    const setTitle = document.createElement("h4");

    setTitle.textContent = "Set Your Own Gold";
    setTitle.style.margin = "0 0 15px 0";
    setTitle.style.fontSize = "16px";
    setTitle.style.textAlign = "center";
    div.appendChild(setTitle);

    const setInput = document.createElement("input");

    setInput.id = "gold-hacks-set-input";
    setInput.type = "text";
    setInput.placeholder = "e.g. +5000 or 100000";
    setInput.title = "Enter a number (i.e. \"1000\" to set, or \"+/-1000\" to add or subtract)";
    setInput.style.width = "100%";
    setInput.style.padding = "10px";
    setInput.style.marginBottom = "10px";
    setInput.style.border = "1px solid #ccc";
    setInput.style.borderRadius = "5px";
    setInput.style.fontSize = "14px";
    setInput.style.boxSizing = "border-box";
    div.appendChild(setInput)

    const setButton = document.createElement("button");

    setButton.textContent = "Change Gold";
    setButton.style.width = "100%";
    setButton.style.padding = "10px";
    setButton.style.background = "#4CAF50";
    setButton.style.color = "white";
    setButton.style.border = "none";
    setButton.style.borderRadius = "5px";
    setButton.style.cursor = "pointer";
    setButton.style.fontSize = "14px";
    setButton.style.fontWeight = "bold";
    setButton.style.marginBottom = "10px";

    setButton.onmouseover = () => setButton.style.background = "#45A049";
    setButton.onmouseout = () => setButton.style.background = "#4CAF50";

    setButton.addEventListener("click", () => {
        const value = setInput.value.trim();
        if (value) {
            changeGold(value);
            setInput.value = "";
        }
        else {
            console.log("You typed something wrong. Look at what you put.")
        }
    });

    setInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            setButton.click();
        }
    });

    div.appendChild(setButton);

    const separator2 = document.createElement("hr");

    separator2.style.border = "none";
    separator2.style.borderTop = "1px solid rgba(255, 255, 255, 0.3)";
    separator2.style.margin = "15px 0";

    div.appendChild(separator2);

    const swapTitle = document.createElement("h4");
    swapTitle.textContent = "Set Another Player's Gold";
    swapTitle.style.margin = "0 0 15px 0";
    swapTitle.style.fontSize = "16px";
    swapTitle.style.textAlign = "center";

    div.appendChild(swapTitle);

    const targetInput = document.createElement("input");

    targetInput.id = "gold-hacks-target-input";
    targetInput.type = "text";
    targetInput.placeholder = "Player name";
    targetInput.style.fontSize = "14px";
    targetInput.title = "Enter the victim's name (case-sensitive)";
    targetInput.style.width = "100%";
    targetInput.style.padding = "10px";
    targetInput.style.marginBottom = "10px";
    targetInput.style.border = "1px solid #ccc";
    targetInput.style.borderRadius = "5px";
    targetInput.style.boxSizing = "border-box";

    div.appendChild(targetInput)

    const swapInput = document.createElement("input");

    swapInput.id = "gold-hacks-swap-input";
    swapInput.type = "text";
    swapInput.placeholder = "e.g. +5000 or 100000";
    swapInput.title = "Enter a number (i.e. \"1000\" to set, or \"+/-1000\" to add or subtract)";
    swapInput.style.width = "100%";
    swapInput.style.padding = "10px";
    swapInput.style.marginBottom = "10px";
    swapInput.style.border = "1px solid #ccc";
    swapInput.style.borderRadius = "5px";
    swapInput.style.fontSize = "14px";
    swapInput.style.boxSizing = "border-box";

    div.appendChild(swapInput)

    const swapButton = document.createElement("button");

    swapButton.textContent = "Change Gold";
    swapButton.style.width = "100%";
    swapButton.style.padding = "10px";
    swapButton.style.background = "#2196F3";
    swapButton.style.color = "white";
    swapButton.style.border = "none";
    swapButton.style.borderRadius = "5px";
    swapButton.style.cursor = "pointer";
    swapButton.style.fontSize = "14px";
    swapButton.style.fontWeight = "bold";
    swapButton.style.marginBottom = "10px";

    swapButton.onmouseover = () => swapButton.style.background = "#1976D2";
    swapButton.onmouseout = () => swapButton.style.background = "#2196F3";

    swapButton.addEventListener("click", () => {
        const target = targetInput.value.trim();
        const value = swapInput.value.trim();
        if (target && value) {
            changeOtherGold(target, value);
            targetInput.value = "";
            swapInput.value = "";
        }
        else {
            console.log("You typed something wrong. Look at what you put.")
        }
    });

    targetInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            swapButton.click();
        }
    });

    swapInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            swapButton.click();
        }
    });

    div.appendChild(swapButton);

    const separator = document.createElement("hr");

    separator.style.border = "none";
    separator.style.borderTop = "1px solid rgba(255, 255, 255, 0.3)";
    separator.style.margin = "15px 0";

    div.appendChild(separator);

    const togglePlayersButton =  document.createElement("button");

    togglePlayersButton.textContent = "Show Players List";
    togglePlayersButton.style.width = "100%";
    togglePlayersButton.style.padding = "10px";
    togglePlayersButton.style.background = "#9C27B0";
    togglePlayersButton.style.color = "white";
    togglePlayersButton.style.border = "none";
    togglePlayersButton.style.borderRadius = "5px";
    togglePlayersButton.style.cursor = "pointer";
    togglePlayersButton.style.fontSize = "14px";
    togglePlayersButton.style.fontWeight = "bold";
    togglePlayersButton.style.marginBottom = "15px";

    togglePlayersButton.onmouseover = () => togglePlayersButton.style.background = "#7B1FA2";
    togglePlayersButton.onmouseout = () => togglePlayersButton.style.background = "#9C27B0";

    togglePlayersButton.addEventListener("click", () => {
        showAllPlayers();
    });

    div.appendChild(togglePlayersButton);

    const close = document.createElement("button");

    close.textContent = "✕";
    close.style.position = "absolute";
    close.style.top = "10px";
    close.style.right = "15px";
    close.style.background = "transparent";
    close.style.border = "none";
    close.style.color = "white";
    close.style.fontSize = "20px";
    close.style.cursor = "pointer";
    close.style.padding = "0 5px";
    close.style.lineHeight = "1";

    close.onmouseover = () => close.style.color = "#ff6b6b";
    close.onmouseout = () => close.style.color = "white";
    close.onclick = () => div.remove();

    div.appendChild(close);

    document.body.appendChild(div);
    makeDraggable(div);
}

createUI();

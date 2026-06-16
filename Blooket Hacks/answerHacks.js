function getComponent() {
    let component = null;

    for (const element of document.querySelectorAll("*")) {
        const fiberKey = Object.keys(element).find(k => k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$"));
        if (!fiberKey) continue;

        let fiber = element[fiberKey];
        while (fiber) {
            const instance = fiber.stateNode;
            if (instance && instance.props?.question?.answers && instance.props?.onAnswer) {
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

    console.log("Could not find component. Be on the question screen.")
    return
}

function allCorrect() {
    function changeAllCorrect(component) {
        const onAnswer = component.props.onAnswer;
        component.props.onAnswer = function(isCorrect, answerIndex) {
            // any answer sent is set true
            return onAnswer.call(this, true, answerIndex);
        };
    }

    let component = getComponent();
    if (component) {
        changeAllCorrect(component);
    }

    const observer = new MutationObserver(() => {
        newComponent = getComponent();
        if (newComponent) {
            changeAllCorrect(newComponent)
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});
    return observer
}

function highlightCorrect() {
    function highlightAllCorrect(component) {
        const question = component.state.question || component.props.question;
        if (!question) return;

        const correctIndices = [];

        for (let i = 0; i < question.answers.length; i++) {
            if (question.correctAnswers.includes(question.answers[i])) {
                correctIndices.push(i);
            }
        }

        if (correctIndices.length > 0) {
            const answerButtons = document.querySelectorAll("._answerContainer_1brbq_188");

            correctIndices.forEach(index => {
                if (answerButtons[index]) {
                    const target = answerButtons[index];
                    target.style.backgroundColor = "#4bc22e";
                }
            });
        }
    }

    let component = getComponent();
    if (component) {
        highlightAllCorrect(component);
    }

    const observer = new MutationObserver(() => {
        newComponent = getComponent();
        if (newComponent) {
            highlightAllCorrect(newComponent)
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});
    return observer
}

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

function createUI() {
    const existing = document.getElementById("question-hacks-ui");
    if (existing) {
        existing.remove();
    }

    const div = document.createElement("div");

    div.id = "question-hacks-ui";
    div.style.position = "fixed";
    div.style.top = "20px";
    div.style.left = "20px";
    div.style.width = "250px";
    div.style.padding = "20px";
    div.style.background = "rgba(0, 0, 0, 0.7)";
    div.style.borderRadius = "10px";
    div.style.color = "white";

    const title = document.createElement("h3");

    title.textContent = "Question Hacks";
    title.style.margin = "0 0 15px 0";
    title.style.fontSize = "20px";
    title.style.textAlign = "center";

    div.appendChild(title);

    let correctObserver = null;
    let highlightObserver = null;

    function createToggle(text, callback) {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.marginBottom = "10px";
        wrapper.style.cursor = "pointer";

        const checkbox = document.createElement("div");
        checkbox.style.width = "20px";
        checkbox.style.height = "20px";
        checkbox.style.border = "2px solid #fff";
        checkbox.style.borderRadius = "4px";
        checkbox.style.marginRight = "10px";
        checkbox.style.display = "flex";
        checkbox.style.alignItems = "center";
        checkbox.style.justifyContent = "center";
        checkbox.style.transition = "background 0.2s";

        let isChecked = false;

        wrapper.addEventListener("click", () => {
            isChecked = !isChecked;
            checkbox.style.background = isChecked ? "#4CAF50" : "transparent";
            checkbox.innerHTML = isChecked ? "✓" : "";
            checkbox.style.fontSize = "16px";
            checkbox.style.fontWeight = "bold";
            callback(isChecked);
        });

        const label = document.createElement("span");
        label.textContent = text;
        label.style.fontSize = "14px";
        label.style.userSelect = "none";

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);

        div.appendChild(wrapper);
    }

    createToggle("Highlight Correct Answers", (on) => {
        if (on) {
            highlightObserver = highlightCorrect();
        }
        else {
            if (highlightObserver) {
                highlightObserver.disconnect();
                highlightObserver = null;
            }
        }
    });

    createToggle("Every Answer Correct", (on) => {
        if (on) {
            correctObserver = allCorrect();
        }
        else {
            if (correctObserver) {
                correctObserver.disconnect();
                correctObserver = null;
            }
        }
    });

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
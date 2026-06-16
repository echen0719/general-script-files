function getComponent() {
    let component = null;

    for (const element of document.querySelectorAll("*")) {
        const fiberKey = Object.keys(element).find(k => k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$"));
        if (!fiberKey) continue;

        let fiber = element[fiberKey];
        while (fiber) {
            const instance = fiber.stateNode;
            if (instance && instance.props?.liveGameController && instance.props?.client?.name) {
                component = instance;
                break;
            }
            
            if (instance && instance.state?.unlocks !== undefined) {
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

    console.log("Could not find component. Be on the game start screen or question screen.")
    return
}

function unlockBlook(blook) {
    const component = getComponent();
    if (!component) return;

    component.props.liveGameController.setVal({
        path: `c/${component.props.client.name}`,
        val: {b: blook}
    });
}

function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

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
    const existing = document.getElementById("blook-hacks-ui");
    if (existing) {
        existing.remove();
    }

    const blooks = ["Hamster", "Chick", "Chicken", "Cow", "Goat", "Horse", "Pig", "Sheep", "Duck", "Alpaca", "Dog", "Cat", "Rabbit", "Goldfish", "Hamster", "Turtle", "Kitten", "Puppy", "Bear", "Moose", "Fox", "Raccoon", "Squirrel", "Owl", "Hedgehog", "Deer", "Wolf", "Beaver", "Tiger", "Orangutan", "Cockatoo", "Parrot", "Anaconda", "Jaguar", "Macaw", "Toucan", "Panther", "Capuchin", "Gorilla", "Hippo", "Rhino", "Giraffe", "Snowy Owl", "Polar Bear", "Arctic Fox", "Baby Penguin", "Penguin", "Arctic Hare", "Seal", "Walrus", "Witch", "Wizard", "Elf", "Fairy", "Slime Monster", "Jester", "Dragon", "Queen", "Unicorn", "King", "Two of Spades", "Eat Me", "Drink Me", "Alice", "Queen of Hearts", "Dormouse", "White Rabbit", "Cheshire Cat", "Caterpillar", "Mad Hatter", "King of Hearts", "Toast", "Cereal", "Yogurt", "Breakfast Combo", "Orange Juice", "Milk", "Waffle", "Pancakes", "French Toast", "Pizza", "Earth", "Meteor", "Stars", "Alien", "Planet", "UFO", "Spaceship", "Astronaut", "Lil Bot", "Lovely Bot", "Angry Bot", "Happy Bot", "Watson", "Buddy Bot", "Brainy Bot", "Mega Bot", "Old Boot", "Jellyfish", "Clownfish", "Rainbow Jellyfish", "Lovely Frog", "Lucky Frog", "Spring Frog", "Poison Dart Frog", "Lemon Crab", "Pirate Pufferfish", "Donut Blobfish", "Crimson Octopus", "Rainbow Narwhal", "Agent Owl", "Party Pig", "Master Elf", "Phantom King", "Leprechaun", "Rainbow Panda", "White Peacock", "Tiger Zebra", "Lovely Peacock", "Ice Slime", "Frozen Fossil", "Ice Crab", "Teal Platypus", "Blue Butterfly", "Half a Sandwich", "Black Bear", "Pumpkin Pie", "Chipmunk", "Cornucopia", "Autumn Cat", "Pumpkin Puppy", "Red Squirrel", "Autumn Crow", "Snow Globe", "Hot Chocolate", "Gingerbread Man", "Elf", "Snowman", "Santa Claus", "Mrs. Claus", "Nutcracker", "Koala Bear", "Polar Bear", "Arctic Fox", "Penguin", "Seal", "Walrus", "Blizzard Clownfish", "Lovely Peacock", "Tim the Alien", "Rainbow Astronaut", "Hamsta Claus", "Wise Owl", "King of Hearts", "Mad Hatter", "Caterpillar", "Cheshire Cat", "Alice", "White Rabbit", "Captain Blackbeard", "Pirate Queen", "Kraken", "Deckhand", "Parrot", "Lion", "Gorilla", "Hippo", "Frog", "Crab", "Pufferfish", "Blobfish", "Octopus", "Narwhal", "Dolphin", "Baby Shark", "Megalodon", "Panda", "Sloth", "Tenrec", "Flamingo", "Zebra", "Elephant", "Lemur", "Peacock", "Chameleon", "Lion", "Amber", "Dino Egg", "Dino Fossil", "Stegosaurus", "Velociraptor", "Brontosaurus", "Triceratops", "Tyrannosaurus Rex", "Ice Bat", "Ice Bug", "Ice Elemental", "Rock Monster", "Ding", "Donk", "Bush Monster", "Yeti", "Dingo", "Echidna", "Koala", "Kookaburra", "Platypus", "Joey", "Kangaroo", "Crocodile", "Sugar Glider", "Deckhand", "Buccaneer", "Swashbuckler", "Treasure Map", "Seagull", "Jolly Pirate", "Pirate Ship", "Kraken", "Captain Blackbeard", "Ant", "Rhino Beetle", "Ladybug", "Fly", "Worm", "Bee", "Mantis", "Butterfly", "Bananas", "Watermelon", "Cheese", "Doughnut", "Taco", "Bao", "Sushi", "Cheeseburger", "Sandwich", "Vampire Bat"];

    const div = document.createElement("div");
    div.id = "blook-hacks-ui";
    div.style.position = "fixed";
    div.style.top = "20px";
    div.style.right = "100px";
    div.style.minHeight = "200px";
    div.style.width = "300px";
    div.style.padding = "20px";
    div.style.boxSizing = "border-box";
    div.style.background = "rgba(0, 0, 0, 0.7)";
    div.style.borderRadius = "10px";
    div.style.color = "white";
    div.style.zIndex = "99999";

    div.addEventListener("keypress", (e) => {
        if (/^[0-9+\-*/]$/.test(e.key)) {
            e.stopPropagation();
        }
    }, true);

    const title = document.createElement("h3");
    title.textContent = "Blook Changer";
    title.style.margin = "0 0 15px 0";
    title.style.fontSize = "20px";
    title.style.textAlign = "center";
    div.appendChild(title);

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search blook...";
    searchInput.style.width = "100%";
    searchInput.style.padding = "10px";
    searchInput.style.marginBottom = "10px";
    searchInput.style.border = "1px solid #ccc";
    searchInput.style.borderRadius = "5px";
    searchInput.style.fontSize = "14px";
    searchInput.style.boxSizing = "border-box";
    div.appendChild(searchInput);

    const dropdown = document.createElement("select");
    dropdown.style.width = "100%";
    dropdown.style.padding = "10px";
    dropdown.style.marginBottom = "15px";
    dropdown.style.border = "1px solid #ccc";
    dropdown.style.borderRadius = "5px";
    dropdown.style.fontSize = "14px";
    dropdown.style.boxSizing = "border-box";
    dropdown.style.backgroundColor = "#fff";
    dropdown.style.color = "#000";
    div.appendChild(dropdown);

    function updateDropdown(filterText) {
        dropdown.innerHTML = "";
        const lowerFilter = filterText.toLowerCase();
        blooks.forEach(blook => {
            if (blook.toLowerCase().includes(lowerFilter)) {
                const option = document.createElement("option");
                option.value = blook;
                option.textContent = blook;
                dropdown.appendChild(option);
            }
        });
    }

    searchInput.addEventListener("input", (e) => {
        updateDropdown(e.target.value);
    });

    searchInput.addEventListener("keydown", (e) => {
        updateDropdown(e.target.value);

        if (e.key === "Enter") {
            submitButton.click();
        }
    });

    updateDropdown("");

    const submitButton = document.createElement("button");
    submitButton.textContent = "Change Blook";
    submitButton.style.width = "100%";
    submitButton.style.padding = "10px";
    submitButton.style.background = "#4CAF50";
    submitButton.style.color = "white";
    submitButton.style.border = "none";
    submitButton.style.borderRadius = "5px";
    submitButton.style.cursor = "pointer";
    submitButton.style.fontSize = "14px";
    submitButton.style.fontWeight = "bold";

    submitButton.onmouseover = () => submitButton.style.background = "#45A049";
    submitButton.onmouseout = () => submitButton.style.background = "#4CAF50";

    submitButton.addEventListener("click", () => {
        if (dropdown.value) {
            unlockBlook(dropdown.value);
            searchInput.value = "";
            updateDropdown("");
        }
    });

    div.appendChild(submitButton);

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

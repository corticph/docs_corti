// skippable values in lowercase
const tags = ["stream", "experimental"];
const patterns = ["stream", "wss"];

const watchContainer = () => {
    const observer = new MutationObserver((mutations, observer) => {
        for (mut of mutations) {
            if (mut.type !== "childList") {
                continue;
            }
            disablePlaygrounds();
        }
    });
    if (!observer) {
        console.error("Failed to create content observer");
        return;
    }

    const target = document.getElementById("content-container");
    if (!target) {
        console.error("Missing #content-container");
        return;
    }

    observer.observe(target, { childList: true });
};

const disablePlayground = () => {
    const area = document.getElementById("content-area");
    if (!area) {
        console.error("Missing #content-area");
    }

    const flexContainer = area.closest("div.flex");
    if (!flexContainer) {
        console.error("Missing playground container");
        return;
    }

    for (button of flexContainer.getElementsByTagName("button")) {
        if (!button.textContent.toLowerCase().includes("try it")) {
            continue;
        }

        button.disabled = true;
        return true;
    }
};

const disablePlaygrounds = () => {
    for (tag of tags) {
        for (head of document.getElementsByClassName("eyebrow")) {
            if (!head.textContent.toLowerCase().includes(tag)) {
                continue;
            }

            if (disablePlayground()) {
                return;
            }
        }
    }

    for (pattern of patterns) {
        for (head of document.getElementsByTagName("h1")) {
            if (!head.textContent.toLowerCase().includes(pattern)) {
                continue;
            }

            if (disablePlayground()) {
                return;
            }
        }
    }
};

window.addEventListener("load", disablePlaygrounds);
window.addEventListener("load", watchContainer);

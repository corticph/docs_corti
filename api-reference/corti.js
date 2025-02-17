// skippable values in lowercase
const tags = ["stream"];
const patterns = ["stream", "wss"];
const patches = {
    documents: {
        headPattern: "generate",
        contextData: {
            0: "Facts[]",
            1: "Transcript",
            2: "string",
        }
    }
};

const watchContentContainer = () => {
    const observer = new MutationObserver((mutations, observer) => {
        for (const mut of mutations) {
            if (mut.type !== "childList") {
                continue;
            }
            disablePlaygrounds();
            patchBugDocuments();
            watchDocumentsContextTypeContainer();
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

const watchDocumentsContextTypeContainer = () => {
    const docPatch = patches["documents"];
    if (!docPatch) {
        console.error("Missing patch for Documents");
        return;
    }

    const pattern = docPatch["headPattern"];
    if (!docPatch) {
        console.error("Missing header pattern check for Documents");
        return;
    }

    if (shouldSkipDocumentsPatch(pattern)) {
        return;
    }

    const observer = new MutationObserver((mutations, observer) => {
        for (const mut of mutations) {
            if (mut.type !== "childList") {
                continue;
            }
            patchBugDocuments();
        }
    });
    if (!observer) {
        console.error("Failed to create Documents context observer");
        return;
    }

    const target = document.getElementById("body-context-data");
    if (!target) {
        console.error("Missing #body-context-data");
        return;
    }

    observer.observe(target.parentNode.parentNode, { childList: true });
};

const findContentArea = () => {
    const area = document.getElementById("content-area");
    if (!area) {
        throw new Error("Missing #content-area");
    }
    return area;
};

const disablePlayground = () => {
    try {
        const area = findContentArea();
    } catch (exc) {
        console.error(exc);
    }

    const flexContainer = area.closest("div.flex");
    if (!flexContainer) {
        console.error("Missing playground container");
        return;
    }

    for (const button of flexContainer.getElementsByTagName("button")) {
        if (!button.textContent.toLowerCase().includes("try it")) {
            continue;
        }

        button.style.display = "none";
        return true;
    }
};

const disablePlaygrounds = () => {
    for (const tag of tags) {
        for (const head of document.getElementsByClassName("eyebrow")) {
            if (!head.textContent.toLowerCase().includes(tag)) {
                continue;
            }

            if (disablePlayground()) {
                return;
            }
        }
    }

    for (const pattern of patterns) {
        for (const head of document.getElementsByTagName("h1")) {
            if (!head.textContent.toLowerCase().includes(pattern)) {
                continue;
            }

            if (disablePlayground()) {
                return;
            }
        }
    }
};

const patchPlayground = () => {
    try {
        const area = findContentArea();
    } catch (exc) {
        console.error(exc);
    }

    const flexContainer = area.closest("div.flex");
    if (!flexContainer) {
        console.error("Missing playground container");
        return;
    }

    for (const button of flexContainer.getElementsByTagName("button")) {
        if (!button.textContent.toLowerCase().includes("try it")) {
            continue;
        }

        button.style.display = "none";
        return true;
    }
};

const shouldSkipDocumentsPatch = (pattern) => {
    for (const head of document.getElementsByTagName("h1")) {
        if (!head.textContent.toLowerCase().includes(pattern)) {
            return true;
        }
    }
};

const patchBugDocuments = () => {
    const docPatch = patches["documents"];
    if (!docPatch) {
        console.error("Missing patch for Documents");
        return;
    }

    const pattern = docPatch["headPattern"];
    if (!docPatch) {
        console.error("Missing header pattern check for Documents");
        return;
    }

    if (shouldSkipDocumentsPatch(pattern)) {
        return;
    }

    const data = document.getElementById("body-context-data");
    if (!data) {
        console.error("Missing #body-context-data");
        return;
    }

    for (const select of data.getElementsByTagName("select")) {
        const options = Array.from(
            select.getElementsByTagName("option")
        ).entries();

        for (const [idx, option] of options) {
            const contextPatch = docPatch["contextData"];
            if (!contextPatch) {
                console.error("Missing patch for Documents context");
                return;
            }

            const optionPatch = contextPatch[idx];
            if (!optionPatch) {
                console.error(`Missing patch for context option ${idx}`);
                return;
            }

            option.textContent = optionPatch;
        }
    }
};

window.addEventListener("load", () => {
    disablePlaygrounds();
    patchBugDocuments();
    watchContentContainer();
    watchDocumentsContextTypeContainer();
})

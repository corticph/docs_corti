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

const watchPlaygroundContainer = () => {
    const observer = new MutationObserver((mutations, observer) => {
        for (const mut of mutations) {
            if (mut.type !== "childList") {
                continue;
            }
            patchBugDocumentsPlayground(mut.target);
        }
    });
    if (!observer) {
        console.error("Failed to create playground observer");
        return;
    }

    const target = findPlaygroundButton();
    if (!target) {
        console.error("Missing playground button");
        return;
    }
    observer.observe(target.parentNode.parentNode, { childList: true });
};

const watchDocumentsPlaygroundContextTypeContainer = (
    target, contextPatch
) => {
    const observer = new MutationObserver((mutations, observer) => {
        for (const mut of mutations) {
            if (mut.type !== "childList") {
                continue;
            }

            for (const type of mut.target.querySelectorAll('[title="data"]')) {
                for (const select of type.getElementsByTagName("select")) {
                    patchContextDataDropdown(select, contextPatch);

                    // parent overlay thingy patch
                    select.parentNode.children[0].textContent = (
                        select.getElementsByTagName("option")[0].textContent
                    );

                    console.log(mut.target.getElementsByClassName("grid"));
                }
                return;
            }
        }
    });
    if (!observer) {
        console.error("Failed to create content observer");
        return;
    }

    observer.observe(target, { childList: true });
};

const findContentArea = () => {
    const area = document.getElementById("content-area");
    if (!area) {
        throw new Error("Missing #content-area");
    }
    return area;
};

const findPlaygroundButton = () => {
    let area;
    try {
        area = findContentArea();
    } catch (exc) {
        console.error(exc);
        return;
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

        return button;
    }
};

const disablePlayground = () => {
    const button = findPlaygroundButton();
    if (!button) {
        console.error("Missing playground button");
        return;
    }

    button.style.display = "none";
    return true;
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

const patchContextDataDropdown = (select, patchDict) => {
    const options = Array.from(
        select.getElementsByTagName("option")
    ).entries();

    for (const [idx, option] of options) {
        const optionPatch = patchDict[idx];
        if (!optionPatch) {
            console.error(`Missing patch for context option ${idx}`);
            return;
        }

        option.textContent = optionPatch;
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

    const contextPatch = docPatch["contextData"];
    if (!contextPatch) {
        console.error("Missing patch for Documents context");
        return;
    }

    const data = document.getElementById("body-context-data");
    if (!data) {
        console.error("Missing #body-context-data");
        return;
    }

    for (const select of data.getElementsByTagName("select")) {
        patchContextDataDropdown(select, contextPatch);
    }
};

const patchBugDocumentsPlayground = (playground) => {
    if (!playground) {
        const button = findPlaygroundButton();
        if (!button) {
            console.error("Missing playground");
            return;
        }
        playground = button.parentNode.parentNode;
    }

    if (playground.children.length <= 1) {
        return;
    }

    const docPatch = patches["documents"];
    if (!docPatch) {
        console.error("Missing patch for Documents");
        return;
    }

    const pattern = docPatch["headPattern"];
    if (!docPatch) {
        console.error("Missing header pattern check for Documents playground");
        return;
    }

    const popup = Array.from(playground.children).toReversed()[0];
    for (const head of popup.getElementsByClassName("text-base")) {
        if (!head.textContent.toLowerCase().includes(pattern)) {
            return;
        }
    }

    const contextPatch = docPatch["contextData"];
    if (!contextPatch) {
        console.error("Missing patch for Documents context");
        return;
    }

    for (const ctx of popup.querySelectorAll('[title="context"]')) {
        let levels = 5;
        let target = ctx;
        while (target.getElementsByClassName("items-start").length == 0) {
            target = target.parentNode
            levels--;
            if (levels <= 0) {
                return;
            }
        }
        for (const grid of target.getElementsByClassName("items-start")) {
            watchDocumentsPlaygroundContextTypeContainer(grid, contextPatch);
        }
    }
};

window.addEventListener("load", () => {
    disablePlaygrounds();
    patchBugDocuments();
    patchBugDocumentsPlayground();
    watchContentContainer();
    watchPlaygroundContainer();
    watchDocumentsContextTypeContainer();
});

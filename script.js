import parserBabel from "./parser-babel.mjs";
import parserTypeScript from "./parser-typescript.mjs";
import prettierFormat_formatCode from "./parser-java.js";

window.addEventListener("load", startLoading, false);

function startLoading() {
    let codeMirror = document.querySelector(".CodeMirror").CodeMirror;
    if (codeMirror == undefined) {
        // codeMirror not found
        return;
    }
    console.log(codeMirror);
    let programmingLanguage = document.querySelector(
        ".ant-select-selection-selected-value"
    );

    if (!programmingLanguage.title) {
        // Dom not loaded yet
        return;
    }

    let button = getFormatButton();
    button.addEventListener("click", function () {
        formatCodeFinal(codeMirror, programmingLanguage);
    });

    programmingLanguage.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(
        button
    );

    clearInterval(timer);
}

const getFormatButton = function () {
    var button = document.createElement("button");
    button.innerHTML = "▤";
    button.className = "tool-button";
    button.setAttribute("icon", "information");
    button.setAttribute("data-no-border", "true");
    button.setAttribute("type", "ghost");
    button.style.marginRight = "10px";
    button.style.border = "none";
    button.style.backgroundColor = "transparent";
    button.style.borderImage = "none";
    button.style.outline = "none";
    button.style.cursor = "pointer";
    return button;
};

const formatCodeFinal = function (codeMirror, programmingLanguage) {
    let language = programmingLanguage.title;
    let codeText = codeMirror.getValue();
    if (language === undefined) {
        return;
    }
    if (codeText === undefined) {
        return;
    }
    let formattedCode = null;
    if (language === "JavaScript") {
        formattedCode = prettier.format(codeText, {
            parser: "babel",
            plugins: [parserBabel],
        });
        codeMirror.setValue(formattedCode);
    } else if (language === "TypeScript") {
        formattedCode = prettier.format(codeText, {
            parser: "typescript",
            plugins: [parserTypeScript],
        });
    } else if (language === "Java") {
        formattedCode = prettierFormat_formatCode.formatCode(
            codeText,
            {}
        );
    }

    if (formattedCode) {
        codeMirror.setValue(formattedCode);
    }
    console.debug(`Code formatted for ${programmingLanguage.title}`);
};

let timer = setInterval(startLoading, 5000);

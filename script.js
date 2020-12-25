import parserBabel from "./parser-babel.mjs";
import parserTypeScript from "./parser-typescript.mjs";

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
    console.log(programmingLanguage.title);
    if (!programmingLanguage.title) {
        // Dom not loaded yet
        return;
    }
    //  codeMirror.execCommand("selectAll");
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

    button.addEventListener("click", function () {
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
        }

        if (formattedCode) {
            codeMirror.setValue(formattedCode);
        }
    });

    programmingLanguage.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(
        button
    );

    clearInterval(timer);
}

let timer = setInterval(startLoading, 5000);

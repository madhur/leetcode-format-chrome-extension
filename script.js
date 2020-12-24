window.addEventListener("load", startLoading, false);

function startLoading() {
    let codeMirror = document.querySelector(".CodeMirror").CodeMirror;
    console.log(codeMirror);
    let programmingLanguage = document.querySelector(
        ".ant-select-selection-selected-value"
    ).title;
    console.log(programmingLanguage);
    //  codeMirror.execCommand("selectAll");
}

setInterval(startLoading, 5000);

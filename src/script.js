import parserBabel from './parser-babel.mjs';
import parserTypeScript from './parser-typescript.mjs';
import prettierFormat_formatCode from './parser-java.js';
import './dart-style.js';

/*Old UI Variables */
const codeMirrorDOM = '.CodeMirror';
let codeMirror = null;
/* Old UI Variables End */

/* New UI Variables */
let btn = null;
const supportedLanguages = ['JAVA', 'JAVASCRIPT', 'TYPESCRIPT', 'C++', 'DART', "CPP"];
let theme = null;
const lightTextColor = '#000000';
const darkTextColor = '#eff1f6ff';
/* New UI Variables END */

/* Common Variables */
let activeLanguage = null;
/* Common Variables End */

let uiVersion = -1;

window.addEventListener('load', startLoading, false);
window.addEventListener('locationchange', function (event) {
    // Log the state data to the console
    console.log(event);
    if (document.getElementById('button-format') !== null) {
        console.debug('Button present');
    } else {
        console.debug('Button not present');
    }
});

function startLoading() {
    let codeMirrorSelector = document.querySelector(codeMirrorDOM);
    if (codeMirrorSelector === undefined || codeMirrorSelector === null) {
        // codemirror not found on page
        // Check for new UI
        checkAndLoadNewUI();
        return;
    }
    codeMirror = codeMirrorSelector.CodeMirror;
    if (codeMirror === undefined) {
        // codeMirror not found
        // this should not happen
        console.debug('FATAL: CodeMirror not found');
        return;
    }

    activeLanguage = document.querySelector(
        '.ant-select-selection-selected-value'
    );

    if (!activeLanguage || !activeLanguage.title) {
        // Dom not loaded yet
        return;
    }

    if (document.getElementById('format-button') !== null) {
        return;
    } else {
        console.debug('installing button');
    }

    let button = getFormatButton();
    uiVersion = 0;
    console.debug("Ui version is 0");
    addShortcutBinding(formatCodeMirror);
    button.addEventListener('click', function () {
        formatCodeMirror();
    });

    activeLanguage.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(
        button
    );
}

function checkAndLoadNewUI() {
    const buttonLocation = '.mr-auto.flex.flex-nowrap.items-center.gap-3';

    if (!document.querySelector(buttonLocation)) {
        checkAndLoadNewUIv2();
        return;
    }

    if (
        !document.querySelector('.tool-button') &&
        document.querySelector(buttonLocation)
    ) {
        uiVersion = 1;
        console.debug("Ui version is 1");
        btn = getFormatButtonNew();
        document.querySelector(buttonLocation).appendChild(btn);
        addShortcutBinding(formatCodeMonaco);
        setupLanguageObserver();
    }
}

function checkAndLoadNewUIv2() {


    let buttonLocation = 'div.flex.flex-nowrap.items-center';

    if (
        !document.querySelector('.tool-button') &&
        document.querySelector(buttonLocation)
    ) {
        uiVersion = 2;
        console.debug("Ui version is 2");
        btn = getFormatButtonNew();
        document.querySelector(buttonLocation).appendChild(btn);
        addShortcutBinding(formatCodeMonacov2);
        setupLanguageObserverv2();
    }

}


function setupLanguageObserver() {
    const languageObserver = '.relative.notranslate';
    const languageSelector = '.relative.notranslate div div';
    const targetNode = document.querySelector(languageObserver);

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        activeLanguage = document.querySelector(languageSelector).innerText;
        console.debug(activeLanguage);
        if (supportedLanguages.includes(activeLanguage.toUpperCase())) {
            btn.style.visibility = 'visible';
        } else {
            btn.style.visibility = 'hidden';
        }
        setButtonTheme(btn);
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}


function setupLanguageObserverv2() {
    const languageObserver = '[data-mode-id]';
    const targetNode = document.querySelector(languageObserver);

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: false, subtree: false };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        let d = document.querySelector('[data-mode-id]');
        let activeLanguage = d.getAttribute('data-mode-id');
        console.debug(activeLanguage);
        if (supportedLanguages.includes(activeLanguage.toUpperCase())) {
            btn.style.visibility = 'visible';
        } else {
            btn.style.visibility = 'hidden';
        }
        setButtonTheme(btn);
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}

const getFormatButtonNew = function () {
    var button = document.createElement('button');
    button.innerHTML = 'Format';
    button.className = 'tool-button';
    button.id = 'format-button';
    button.setAttribute('icon', 'information');
    button.setAttribute('data-no-border', 'true');
    button.setAttribute('type', 'ghost');
    button.style.marginRight = '10px';
    button.style.marginLeft = '10px';
    button.style.border = 'none';
    setButtonTheme(button);
    button.style.borderImage = 'none';
    button.style.outline = 'none';
    button.style.cursor = 'pointer';
    button.title = 'Format';
    button.style.padding = '4px 20px';
    button.style.fontWeight = '600';
    button.style.borderRadius = '3px';

    if (uiVersion == 1){
        button.addEventListener('click', formatCodeMonaco);
    }
    else if (uiVersion == 2) {
        button.addEventListener('click', formatCodeMonacov2);
    }
    else {
        console.error("uiVersion variable not set", uiVersion);
    }
    return button;
};

function addShortcutBinding(func) {
    window.addEventListener('keyup', (event) => {
        if (event.ctrlKey && event.altKey && event.key == 'f')
            func();
    });
}

const getFormatButton = function () {
    var button = document.createElement('button');
    button.innerHTML = '▤';
    button.className = 'tool-button';
    button.id = 'format-button';
    button.setAttribute('icon', 'information');
    button.setAttribute('data-no-border', 'true');
    button.setAttribute('type', 'ghost');
    button.style.marginRight = '10px';
    button.style.border = 'none';
    button.style.backgroundColor = 'transparent';
    button.style.borderImage = 'none';
    button.style.outline = 'none';
    button.style.cursor = 'pointer';
    button.title = 'Format';
    return button;
};

const formatCodeMirror = function () {
    let language = getLanguage();
    let codeText = codeMirror.getValue();
    const formattedCode = formatCode(codeText, language);
    if (formattedCode) {
        codeMirror.setValue(formattedCode);
        console.debug(`Code formatted for ${language}`);
    }
};

const formatCodeMonaco = function () {
    let language = getLanguage();

    let codeText = getCode();
    const formattedCode = formatCode(codeText, language);
    if (formattedCode) {
        insertCode(formattedCode);
        console.debug(`Code formatted for ${language}`);
    }
};

const formatCodeMonacov2 = function () {
    let language = getLanguage();

    let codeText = getCodev2();
    const formattedCode = formatCode(codeText, language);
    if (formattedCode) {
        insertCodev2(formattedCode);
        console.debug(`Code formatted for ${language}`);
    }
};

function getLanguage() {
    if (uiVersion == 1) {
        return document.querySelector('.relative.notranslate').innerText;
    }
    else if (uiVersion == 2) {
        let d = document.querySelector('[data-mode-id]');
        return d.getAttribute('data-mode-id');
    }
    else if (uiVersion == 0) {
        return document.querySelector(
            '.ant-select-selection-selected-value'
        ).title;

    }
}


function insertCode(code) {
    if (code) {
        let model = monaco.editor.getModels()[0];
        model.setValue(code);
    }
}

function insertCodev2(code) {
    if (code) {
        let model = findMonaco();
        model.setValue(code);
    }
}


function getCode() {
    const model = monaco.editor.getModels()[0];
    const code = model.getValue();

    return code;
}

function getCodev2() {
    const model = findMonaco();
    if (model == null) {
        console.error("Could not found instance of monaco editor");
        return;
    }
    const code = model.getValue();

    return code;
}

function findMonaco() {
    let models = monaco.editor.getModels();
    const filter = function(m) {
        return m._languageId != "plaintext";
    }
    if (models && models.length >= 1) {
        return models.find(filter);
    }

}

const formatCode = function (codeText, language) {
    if (language === undefined) {
        return;
    }
    if (codeText === undefined) {
        return;
    }
    let formattedCode = null;
    if (language.toUpperCase() === 'JavaScript'.toUpperCase()) {
        formattedCode = prettier.format(codeText, {
            parser: 'babel',
            plugins: [parserBabel],
        });
    } else if (language.toUpperCase() === 'TypeScript'.toUpperCase()) {
        formattedCode = prettier.format(codeText, {
            parser: 'typescript',
            plugins: [parserTypeScript],
        });
    } else if (language.toUpperCase() === 'Java'.toUpperCase()) {
        formattedCode = prettierFormat_formatCode.formatCode(codeText, {
            printWidth: 200,
            tabWidth: 4,
        });
    } else if (language.toUpperCase() === 'C++'.toUpperCase() || language.toUpperCase() === "cpp".toUpperCase()) {
        formattedCode = js_beautify(codeText, {
            indent_size: 4,
            brace_style: 'expand',
        });
        formattedCode = applyCustomRules(formattedCode);
    } else if (language.toUpperCase() === 'Dart'.toUpperCase()) {
        formattedCode = dartfmt.formatCode(codeText).code;
    } else {
        console.debug(
            `Formatter not available for ${language}`
        );
        return;
    }

    return formattedCode;
};

const applyCustomRules = function (formatted) {
    return formatted
        .replace(/\}\r\n/g, '}\n\n')
        .replace(/\<\s([a-zA-Z0-9_,: *&<>]+)\s>/g, '<$1>')
        .replace(/\<\s([a-zA-Z0-9_,: *&<>]+)>/g, '<$1>')
        .replace(/\<([a-zA-Z0-9_:*]+)\s>/g, '<$1>')
        .replace(/iterator\s</g, 'iterator<')

        .replace(/ = {\s*([0-9 ,-.]+)\s+};/g, ' = { $1 };')
        .replace(/\n\s*\n/g, '\n\n')
        .replace(/,\n\n/g, ',\n')
        .replace(/\r\n\t{}/g, ' {}')
        .replace(/\{\r\n\n/g, '{\r\n')
        .replace(/\r\n\tconst & /g, ' const &')
        .replace(/,\s+const /g, ', const ')
        .replace(/#\r\ndefine/g, '#define')
        .replace(/#\ndefine/g, '#define')
        .replace(/# define/g, '\r\n#define')
        .replace(/;#define/g, ';\r\n#define')
        .replace(/#define/g, '\n#define')
        .replace(/\n\s*\n#define/g, '\n#define')
        .replace(/;\r\n#define/g, ';\r\n\r\n#define')
        .replace(/;\n#define/g, ';\n\n#define')
        .replace(/\r\n#include/g, '#include')
        .replace(/\n#include/g, '#include')
        .replace(
            /([a-zA-Z0-9\t ./<>?;:"'`!@#$%^&*()\[\]{}_+=|\\-]+)#include/g,
            '$1\r\n#include'
        )
        .replace(/vector </g, 'vector<')
        .replace(/set </g, 'set<')
        .replace(/map </g, 'map<')
        .replace(/queue </g, 'queue<')
        .replace(/stack </g, 'stack<')
        .replace(/stack </g, 'stack<')
        .replace(/deque </g, 'deque<')
        .replace(/list </g, 'list<')
        .replace(/array </g, 'array<')
        .replace(/ - > /g, '->')
        .replace(/\(\s+{\s+/g, '({ ')
        .replace(/\s+\}\)/g, ' })')
        .replace(/\tpublic_colon/g, 'public:')
        .replace(/\tprivate_colon/g, 'private:')
        .replace(/\tprotected_colon/g, 'protected:')

        .replace(/^#define(.*)$/, '#define')

        .replace(/xxxx/g, 'const')
        .replace(/\*(\s+)const/g, '*const')

        .replace(/operator (\W+) /g, 'operator$1')
        .replace(/operator<= >/g, 'operator<=>')
        .replace(/=(\s+)default/g, '= default')
        .replace(/; \}/g, ';\n}')
        .replace(/{\n\t\t\t/g, '{ ')
        .replace(/= { {/g, '= {\n\t\t{')
        .replace(/} };/g, '}\n\t};')

        .replace(/(\W+)\* /g, '$1*')
        .replace(/;\*/g, '; *')
        .replace(/(\w+) \*(\w+);/g, '$1 * $2;')
        .replace(/(\w+) \*(\w+)\)/g, '$1 * $2)')
        .replace(/(\w+) \*(\w+)\(/g, '$1 * $2(')
        .replace(/(\w+)(\s*)\*(\w+)(\s*)\</g, '$1 * $3 <')
        .replace(/(\w+)(\s*)\*(\w+)(\s*)\>/g, '$1 * $3 >')
        .replace(/(\w+)(\s*)\*(\w+)(\s*)\=/g, '$1 * $3 =')
        .replace(/(\d+)(\s*)\*(\d+)/g, '$1 * $3')

        .replace(/(\W) \* (\w)/g, '$1 *$2')
        .replace(/->\* /g, '->*')
        .replace(/ \[ &/g, ' [&')
        .replace(/\r\n\r\nusing/g, '\r\nusing')
        .replace(/\n\nusing/g, '\nusing')
        .replace(/\s,\s/g, ', ')
        .replace(/> ::/g, '>::')

        .replace(/(\s+)&\s+/g, '$1&')
        .replace(/\s\[/g, '[')
        .replace(/\(\s/g, '(')
        .replace(/\s\)/g, ')')

        .replace(/int \* /g, 'int *')
        .replace(/char \* /g, 'char *')
        .replace(/double \* /g, 'double *')
        .replace(/float \* /g, 'float *')
        .replace(/bool \* /g, 'bool *')
        .replace(/void \* /g, 'void *')
        .replace(/wchar_t \* /g, 'wchar_t *')

        .replace(/(\w+) \*\* /g, '$1 **')

        .replace(/\((\w+) \*\)/g, '($1*)')
        .replace(/(\w+) \*\>/g, '$1*>')

        .replace(/(\s)\<= /g, '$1 <= ')

        .replace(/\((\w+) &(\w+)\)/g, '($1 & $2)')
        .replace(/\[(\w+) &(\w+)\]/g, '[$1 & $2]')

        .replace(/\s<\s/g, '<')
        .replace(/\s<([^<])/g, '<$1')
        .replace(
            /([A-Za-z0-9_,\.\(\)\[\]\-\>]+)<([A-Za-z0-9_,\.\(\)\[\]\-\>]+)([\s\;\)])/g,
            '$1 < $2$3'
        )

        .replace(/<(\s+)const/g, '<const')

        .replace(/#include</g, '#include <')
        .replace(/#include < /g, '#include <')
        .replace(/(\w)\> /g, '$1 > ')
        .replace(/(\w)\>= /g, '$1 >= ')
        .replace(/\s+{}/g, ' {}')
        .replace(/\s+{\s+}/g, ' {}')

        .replace(/\s\<\s(\w+)\s\*,/g, '<$1*,')
        .replace(/\[ \*/g, '[*')

        .replace(/\<(\w+)\s\>/g, '<$1>')
        .replace(/, (\w+)\s\>/g, ', $1>')

        .replace(/\/\/TEMPLATE/g, 'template <')
        .replace(/\[ = \]/g, '[=]')
        .replace(/\}\n\n}/g, '}\n}')
        .replace(/\}\n\n(\s*)\}/g, '}\n$1}')
        .replace(/\}\n\n(\s+)\}/g, '}\n$1}')

        .replace(/\}\n\n(\s+)else/g, '}\n$1else')

        .replace(/\n\}\)\;/g, '\n\t});')
        .replace(/\,\[/g, ', [')

        .replace(/\;\n\n(\s+)\}/g, ';\n$1}')

        .replace(/(\s+)\{([ \t]+)(\w+)/g, '$1{$1\t$3')
        .replace(/(\s+)\{([ \t]+)\/\//g, '$1{$1$2//')
        .replace(/=\s{(\s+)/g, '= { ')

        .replace(/\{\r\n\s+([0-9,-\s.]+)\r\n\s+\}/g, '{ $1 }')
        .replace(/\{\n\s+([0-9,-\s.]+)\n\s+\}/g, '{ $1 }')
        .replace(/\{ \{/g, '{\n\t\t{')
        .replace(/ \/\//g, '\t//')

        .replace(/(['"])(\s+)\}/g, '$1 }')
        .replace(/(\w+) \* (\w+) =/g, '$1 *$2 =')
        .replace(/(\w+) \* (\w+)\)/g, '$1 *$2)')
        .replace(/(\w+) \* (\w+)\(/g, '$1* $2(')

        .replace(/(\w+) \*\& (\w+)/g, '$1* &$2')

        .replace(/\s\<\s(\w+)\s\>/g, '<$1>')
        .replace(/\s\<\s(\w+)\,/g, '<$1,')
        .replace(/\{\}~/g, '{}\n\t~')
        .replace(/_cast </g, '_cast<')

        .replace(/\>\s+\{\s*([A-Za-z0-9 ,-.\"]+)\s+\}\;/g, '> { $1 };');
};

const setButtonTheme = function (btn) {
    theme = document.getElementsByTagName('html')[0].getAttribute('data-theme');
    if (theme === 'dark') {
        btn.style.color = darkTextColor;
    } else if (theme === 'light') {
        btn.style.color = lightTextColor;
    }
};

setTimeout(startLoading, 5000);

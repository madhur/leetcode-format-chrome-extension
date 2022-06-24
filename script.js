import parserBabel from "./parser-babel.mjs";
import parserTypeScript from "./parser-typescript.mjs";
import prettierFormat_formatCode from "./parser-java.js";

window.addEventListener("load", startLoading, false);
window.addEventListener("locationchange", function (event) {
    // Log the state data to the console
    console.log(event);
    if (document.getElementById("button-format") !== null) {
        console.debug("Button present");
    } else {
        console.debug("Button not present");
    }
});

function startLoading() {
    let codeMirrorSelector = document.querySelector(".CodeMirror");
    if (codeMirrorSelector === undefined || codeMirrorSelector === null) {
        // codemirror not found on page
        return;
    }
    let codeMirror = codeMirrorSelector.CodeMirror;
    if (codeMirror === undefined) {
        // codeMirror not found
        return;
    }

    let programmingLanguage = document.querySelector(
        ".ant-select-selection-selected-value"
    );

    if (!programmingLanguage || !programmingLanguage.title) {
        // Dom not loaded yet
        return;
    }

    if (document.getElementById('format-button') !== null) {
        return;
    }
    else {
        console.debug('installing button');
    }

    let button = getFormatButton();
    button.addEventListener("click", function () {
        formatCodeFinal(codeMirror, programmingLanguage);
    });

    programmingLanguage.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(
        button
    );

    //clearInterval(timer);
}

const getFormatButton = function () {
    var button = document.createElement("button");
    button.innerHTML = "▤";
    button.className = "tool-button";
    button.id = "format-button";
    button.setAttribute("icon", "information");
    button.setAttribute("data-no-border", "true");
    button.setAttribute("type", "ghost");
    button.style.marginRight = "10px";
    button.style.border = "none";
    button.style.backgroundColor = "transparent";
    button.style.borderImage = "none";
    button.style.outline = "none";
    button.style.cursor = "pointer";
    button.title = "Format";
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
        formattedCode = prettierFormat_formatCode.formatCode(codeText, {
            printWidth: 200,
            tabWidth: 4
        });
    } else if (language === "C++") {
        formattedCode = js_beautify(codeText, {
            'indent_size': 4,
            'brace_style': 'expand'
        });
        formattedCode = applyCustomRules(formattedCode);
    }
    else {
        console.debug(`Formatter not available for ${programmingLanguage.title}`);
        return;
    }

    if (formattedCode) {
        codeMirror.setValue(formattedCode);
    }
    console.debug(`Code formatted for ${programmingLanguage.title}`);
};

const applyCustomRules = function (formatted) {
    return formatted.replace(/\}\r\n/g, '}\n\n')
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
        .replace(/([a-zA-Z0-9\t ./<>?;:"'`!@#$%^&*()\[\]{}_+=|\\-]+)#include/g, '$1\r\n#include')
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
        .replace(/([A-Za-z0-9_,\.\(\)\[\]\-\>]+)<([A-Za-z0-9_,\.\(\)\[\]\-\>]+)([\s\;\)])/g, '$1 < $2$3')

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
        .replace(/\{ \{/g, '{\n\t\t\{')
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
}


setInterval(startLoading, 5000);

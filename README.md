JsLexer
=======
Simple Lexer on a pure JavaScript.


    ...
    
    var calculator = [ 
        {
            name:       'WS', 
            pattern:    '\\s+', 
            ignore:     true
        }, 
        {
            name:       'NUMBER', 
            pattern:    '[0-9]+', 
            preprocess: function(value) {
                return '<span style="color:green">' + value + '</span>';
            }
        }, 
        {
            name:       'OPERATION', 
            pattern:    '\\+|\\-|\\*|\\/|\\=', 
            preprocess: function(value) {
                return '<span style="color:#9900CC">' + value + '</span>';
            }
        }, 
        {
            name:       'SEPARATOR', 
            pattern:    '\\(|\\)|;'
        }, 
        {
            name:       'VAR', 
            pattern:    'VAR', 
            modifiers:  'i', 
            preprocess: function(value) {
                return '<span style="bold;color:blue">' + value + '</span>';
            }
        }, 
        {
            name:       'NAME', 
            pattern:    '[a-zA-Z_][a-zA-Z0-9_]*', 
            modifiers:  'i', 
            preprocess: function(value) {
                return '<span style="font-weight:bold;">' + value + '</span>';
            }
        }
    ];
    
    ...
    
    var editor = document.getElementById('editor');
    var tokens = tokenization(editor.textContent, calculator);
    
    ...


License
=======
Distributed under MIT License.


/*
 * JsLexer -- Pure JavaScript Lexer.
 *
 * Version 1.0.0.
 *
 * Copyright (c) 2015 Dmitriy Zavodnikov.
 *
 * Licensed under the MIT License.
 */
/**
 * Rules format:
 * 
 * <code><pre>
 * var rules = [
 *     {
 *         name:        'identifier',
 *         pattern:     '[a-zA-Z0-9_]+',
 *         // Optional
 *         ignore:      false,
 *         // Optional
 *         preprocess:  function(value) {
 *             return value;
 *         }
 *     }
 * ];
 * </pre></code>
 */
var defaultPreprocess = function(value) {
    return value;
}

function createToken(tokenValue, tokenRule) {
    return {
        value:      tokenRule.preprocess(tokenValue),
        startPos:   0,
        endPos:     tokenValue.length,
        rule:       tokenRule
    };
}

function matching(text, tokenRules) {
    var index       = text.length;
    var tokenValue  = null;
    var tokenRule   = null;

    // Search token closest to begin of string.
    for (var i = 0; i < tokenRules.length; ++i) {
        var tr = tokenRules[i];
        var match = text.match(new RegExp(tr.pattern, tr.modifiers));
        if (match) {
            // Save local minimum.
            if (index > match.index) {
                index = match.index;
                tokenValue = match[0];
                tokenRule = tr;
            }

            // Best token found.
            if (index == 0) {
                break;
            }
        }
    }

    // Check that token was found.
    if (index == 0) {
        return createToken(tokenValue, tokenRule);
    } else {
        throw 'Can not parse string "' + text.substring(0, index) + '"!';
    }
}

function preprocessRules(tokenRules) {
    for (var i = 0; i < tokenRules.length; ++i) {
        var tokenRule = tokenRules[i];

        // Name.
        if (!tokenRule.name) {
            tokenRule.name = tokenRule.pattern;
        }

        // Ignore.
        if (!tokenRule.ignore) {
            tokenRule.ignore = false;
        }

        // Preprocess.
        if (!tokenRule.preprocess) {
            tokenRule.preprocess = defaultPreprocess;
        }
    }
}

function tokenization(text, tokenRules) {
    preprocessRules(tokenRules);

    var result          = [];
    var currentIndex    = 0;
    while (currentIndex < text.length) {
        var token = matching(text.substring(currentIndex), tokenRules);
        
        if (!token.rule.ignor) {
            token.startPos = token.startPos + currentIndex;
            token.endPos = token.endPos + currentIndex;
            result.push(token);
        }
        currentIndex = token.endPos;
        token = null;
    }

    return result;
}

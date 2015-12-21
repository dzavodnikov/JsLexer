/*
 * JsLexer -- Pure JavaScript Lexer.
 *
 * Version 2.0.0.
 *
 * Copyright (c) 2015 Dmitry Zavodnikov.
 *
 * Licensed under the MIT License.
 */
/**
 * Rules format:
 * 
 * <code><pre>
 * var rules = [
 *     {
 *         name:        'number',   // Name
 *         pattern:     '[0-9]+',   // RegExp
 *         // Optional
 *         modifiers:   'i',        // Default is empty. 
                                    // See 'http://www.w3schools.com/jsref/jsref_obj_regexp.asp' for more details.
 *         preprocess:  function(value) {
 *             return value;        // Default behaviour.
 *         }
 *     }
 * ];
 * </pre></code>
 */
var defaultPreprocess = function(value) {
    return value;
}

function fillMissingRuleFields(tokenRule) {
    // Pattern.
    if (!tokenRule.pattern) {
        throw 'All token rules should contain reg-exp pattern!';
    }

    // Name.
    if (!tokenRule.name) {
        tokenRule.name = tokenRule.pattern;
    }

    // Preprocess.
    if (!tokenRule.preprocess) {
        tokenRule.preprocess = defaultPreprocess;
    }
}

function matching(text, currentPosition, tokenRules) {
    var index       = text.length;
    var tokenValue  = null;
    var tokenRule   = null;

    // Search token closest to begin of string.
    for (var i = 0; i < tokenRules.length; ++i) {
        var tr      = tokenRules[i];
        var match   = text.substring(currentPosition).match(new RegExp(tr.pattern, tr.modifiers));
        if (match) {
            // Save local minimum.
            if (index > match.index) {
                index       = match.index;
                tokenValue  = match[0];
                tokenRule   = tr;
            }

            // Best token (nearest to current position) found.
            if (index == 0) {
                break;
            }
        }
    }

    // Check that token was found.
    if (index == 0) {
        return {
            value:      tokenRule.preprocess(tokenValue),
            startPos:   currentPosition,
            endPos:     currentPosition + tokenValue.length,
            rule:       tokenRule
        };
    } else {
        var unparsedText = text.substring(currentPosition, currentPosition + index);
        return {
            value:      unparsedText,
            startPos:   currentPosition,
            endPos:     currentPosition + unparsedText.length,
            rule:       null
        };
    }
}

function tokenRulesPreprocessing(tokenRules) {
    for (var i = 0; i < tokenRules.length; ++i) {
        var tokenRule = tokenRules[i];
        fillMissingRuleFields(tokenRule);
    }
}

function tokenization(text, tokenRules) {
    if (!tokenRules) {
        throw 'Token rules can not be null!';
    }
    tokenRulesPreprocessing(tokenRules);

    var tokens          = [];
    if (!text) {
        var currentPosition = 0;
        while (currentPosition < text.length) {
            // Find token.
            var token = matching(text, currentPosition, tokenRules);
            // Update current position.
            currentPosition = token.endPos;
            // Add token to result list.
            tokens.push(token);
        }
    }

    return tokens;
}

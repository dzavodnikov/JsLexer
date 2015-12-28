/*
 * JsLexer -- Pure JavaScript Lexer.
 *
 * Version 3.0.0.
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
 *         name:    'number',            // Name
 *         pattern: new RegExp('[0-9]+') // RegExp
 *     }
 * ];
 * </pre></code>
 * 
 * Return format:
 * <code><pre>
 * var tokens = [
 *     {
 *         value:    '123',
 *         startPos: 12,
 *         endPos:   15,
 *         type:     {
 *             name:    'number',
 *             pattern: new RegExp('[0-9]+')
 *         }
 *     }
 * ];
 * </pre></code>
 */
function tokenRulesPreprocessing(tokenRules) {
    for (var i = 0; i < tokenRules.length; ++i) {
        var tokenRule = tokenRules[i];
        if (!tokenRule.pattern) {
            throw 'All token rules should contain reg-exp pattern!';
        }
        if (!tokenRule.name) {
            tokenRule.name = tokenRule.pattern;
        }
    }
}

function tokenization(tokenRules, input) {
    if (!tokenRules) {
        throw 'Token rules can not be null!';
    }
    tokenRulesPreprocessing(tokenRules);

    var tokens = [];
    if (input != null && input.length > 0) {
        var currentPosition = 0;
        while (currentPosition < input.length) {
            var currentInput = input.substring(currentPosition, input.length);

            // Search token closest to begin of string.
            var tokenPosition   = currentInput.length;
            var tokenValue      = null;
            var tokenType       = null;
            for (var i = 0; i < tokenRules.length; ++i) {
                var type = tokenRules[i];
                var matcher = currentInput.match(type.pattern);
                if (matcher) {
                    if (tokenPosition > matcher.index) {
                        tokenPosition   = matcher.index;
                        tokenValue      = matcher[0];
                        tokenType       = type;
                    }

                    // Best token (nearest to current position) found.
                    if (tokenPosition == 0) {
                        break;
                    }
                }
            }

            if (tokenPosition != 0) {
                tokenValue  = currentInput.substring(0, tokenPosition);
                tokenType   = null;
            }

            var end = currentPosition + tokenValue.length;
            tokens.push({
                value:      tokenValue,
                startPos:   currentPosition,
                endPos:     end,
                type:       tokenType
            });
            currentPosition = end;
        }
    }
    return tokens;
}

/*
 * JsLexer -- Pure JavaScript Lexer.
 *
 * Version 3.0.1.
 *
 * Copyright (c) 2015-2016 Dmitry Zavodnikov.
 *
 * Licensed under the MIT License.
 */
/**
 * Rules format:
 * 
 * <code><pre>
 * var rules = [
 *      {
 *          name:           'number',
 *          pattern:        new RegExp('[0-9]+'),
 *          skip:           false,
 *          preprocessing:  function(rawValue) {
 *              return rawValue;
 *          }
 *      }
 * ];
 * </pre></code>
 * 
 * Return format:
 * <code><pre>
 * var tokens = [
 *      {
 *          type:       {
 *              name:           'number',
 *              pattern:        new RegExp('[0-9]+'),
 *              skip:           false,
 *              preprocessing:  function(rawValue) {
 *                  return rawValue;
 *              }
 *          },
 *          value:      '123',
 *          startPos:   12,
 *          endPos:     15
 *      }
 * ];
 * </pre></code>
 */
function tokenRulesPreprocessing(tokenRules) {
    if (tokenRules == null) {
        throw 'Parameter "tokenRules" can not be null or undefined!';
    }

    for (var i = 0; i < tokenRules.length; ++i) {
        var tokenRule = tokenRules[i];
        if (!tokenRule.pattern) {
            throw 'All token rules should contain reg-exp pattern!';
        }
        if (tokenRule.name == null) {
            tokenRule.name = tokenRule.pattern;
        }
        if (tokenRule.skip == null) {
            tokenRule.skip = false;
        }
        if (tokenRule.preprocessing == null) {
            tokenRule.preprocessing = function(rawValue) {
                return rawValue;
            };
        }
    }
}

function tokenization(tokenRules, input) {
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

            var next = currentPosition + tokenValue.length;
            if (tokenType == null) {
                // Add fragments that we can not be parsed to the output list with null token type value.
                tokens.push({
                    type:       null, 
                    value:      tokenValue,
                    startPos:   currentPosition,
                    endPos:     next
                });
            } else {
                if (!tokenType.skip) {
                    tokens.push({
                        type:       tokenType, 
                        value:      tokenType.preprocessing(tokenValue),
                        startPos:   currentPosition,
                        endPos:     next
                    });
                }
            }
            currentPosition = next;
        }
    }
    return tokens;
}


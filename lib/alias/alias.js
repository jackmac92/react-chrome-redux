'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Simple middleware intercepts actions and replaces with
 * another by calling an alias function with the original action
 * @type {object} aliases an object that maps action types (keys) to alias functions (values) (e.g. { SOME_ACTION: newActionAliasFunc })
 */
exports.default = function (aliases) {
  return function () {
    return function (next) {
      return function (action) {
        var alias = aliases[action.type];

        if (!alias) {
          return next(action);
        }

        var aliasResponse = alias(action);

        if (typeof aliasResponse.then !== 'function') {
          return next(aliasResponse);
        }
        aliasResponse.then(function () {
          for (var _len = arguments.length, response = Array(_len), _key = 0; _key < _len; _key++) {
            response[_key] = arguments[_key];
          }

          return next(Object.assign({}, action, {
            aliasResult: response
          }));
        });
      };
    };
  };
};
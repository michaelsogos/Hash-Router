/*!
 * hash-router v1.2.7
 * https://github.com/michaelsogos/Hash-Router
 * 
 * Developed by Michael Sogos
 * Copyright 2016
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 CreatedOn: 2014-10-19
 *
 * Copyright (C) 2016 by Michael Sogos <![[michael.sogos[at]gurustudioweb[dot]it]]>
 * Thanks to these libraries to inspired me:
 * - path.js https://github.com/mtrpcic/pathjs
 * - sammy.js http://sammyjs.org/
 * - director.js https://github.com/flatiron/director
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 **/

"use strict";

(function (global) {
    var Router = {
        /** Initialize the router and attach to url change event to the browser.
        * @param {function} onRouteChange Callback function to call just before the route logic will be executed.
        * @param {function} onRouteNotFound Callback function to call when no routes match the url.
        * @return {bool}
        */
        init: function (onRouteChange, onRouteNotFound) {
            Router.__eventOnChange = onRouteChange;
            Router.__eventOnNotFound = onRouteNotFound;
            
            if (!("onhashchange" in window)) {
                console.error("The browser doesn't support HASH on URL!");
                return false;
            }
            Router.__bindHashChange();
            if (window.location.hash == '' || window.location.hash == '#') {
                Router.__listener('#/');
                return true;
            }
            else {
                Router.__listener(window.location.hash);
                return true;
            }
            return true;
        },
        /** Change the url and run the proper route.
        * @param {string} hash The hash to redirect to.        
        */
        navigate: function (hash) {
            window.location.hash = hash;
        },
        /** Run the route callback functions with priority BEFORE -> ON -> AFTER.
        * @param {object} route The route object.
        */
        run: function (route) {
            if (Router.__eventOnChange != null) Router.__eventOnChange(route);
            Router.__run(route, 'before');
        },
        /** Add a route rule to router.
        * @param {object} route The route object.
        * @param {bool} overwrite If true and an route with same path already exist, it will be overwrited.
        * @return {bool}
        */
        add: function (route, overwrite) {
            var isAlreadyMapped = false;
            if (!route.path) {
                console.error("Cannot find property path when adding a new route!");
                return false;
            }
            for (var i = 0; i < Router.routes.length; i++) {
                if (Router.routes[i].path === route.path) {
                    isAlreadyMapped = true;
                    if (overwrite === true) {
                        Router.routes[i] = route;
                        return true;
                    }
                    break;
                }
            }
            if (isAlreadyMapped) {
                console.error("A route for the path " + route.path + " is already mapped!");
                return false;
            }
            Router.routes.push(route);
            return true;
        },
        /** Find a route for specified path.
        * @param {string} path The path to find.
        * @return {object} The route object
        */
        findRoute: function (path) {
            for (var i = 0; i < Router.routes.length; i++) {
                if (Router.routes[i].path === path) return Router.routes[i];
            }
        },
        /** Find a route for specified hash.
        * @param {string} hash The hash to match the route path.
        * @return {object} The route object
        */
        matchRoute: function (hash) {
            var hashParts = Router.__cleanHash(hash);
            var testerSlices = hashParts.hashParams.split("/");
            var tester = hashParts.hashParams;
            var params = {};
            var query = {};
            
            //parse querystring
            if (hashParts.hashQueryArray.length > 0) {
                for (var q = 0; q < hashParts.hashQueryArray.length; q++) {
                    var keyValue = (hashParts.hashQueryArray[q]).split('=');
                    if (keyValue.length >= 1 && keyValue[0]) {
                        query[decodeURIComponent(keyValue[0])] = keyValue[1] ? decodeURIComponent(keyValue[1]) : '';
                    }
                }
            }
            
            //parse hash parameters
            for (var i = 0; i < Router.routes.length; i++) {
                var route = Router.routes[i];
                tester = hashParts.hashParams;
                
                if (route.path.search(/:/) > 0) {//Dynamic parts
                    var routeSlices = route.path.split("/");
                    for (var x = 0; x < routeSlices.length; x++) {
                        if ((x < testerSlices.length) && (routeSlices[x].charAt(0) === ":")) {
                            params[routeSlices[x].replace(/:/, '')] = testerSlices[x];
                            tester = tester.replace(testerSlices[x], routeSlices[x]);
                        }
                    }
                }
                
                if (route.path === tester) {
                    route.params = params;
                    route.url = hash;
                    route.query = query;
                    return route;
                }
            }
            return null;
        },
        /** Find the route for the actual URL.
        * @return {object} The route object
        */
        actualRoute: function () {
            return this.matchRoute(window.location.hash);
        },
        /* List of route object */
        routes: [],
        __bindHashChange: function () {
            window.onhashchange = function () { Router.__listener(location.hash) }
        },
        __cleanHash: function (hash) {
            var result = {};
            var hashIndexOfQuery = hash.indexOf('?');
            
            result.hash = hash;
            result.hashParams = hashIndexOfQuery >= 0 ? hash.substring(0, hashIndexOfQuery) : hash;
            result.hashQuery = hashIndexOfQuery >= 0 ? hash.substring(hash.indexOf('?') + 1) : '';
            result.hashQueryArray = result.hashQuery ? result.hashQuery.split('&') : [];
            
            var cleanedHashParams = result.hashParams.replace(/\/+$/, '');
            if (result.hashParams !== cleanedHashParams) {
                window.onhashchange = null;
                result.hash = cleanedHashParams;
                result.hash += result.hashQuery ? '?' + result.hashQuery : '';
                window.location.hash = result.hash;
                Router.__bindHashChange();
            }
            
            return result;
        },
        __listener: function (hash) {
            var route = Router.matchRoute(hash);
            if (!route && !Router.__eventOnNotFound) {
                console.error("Cannot find a valid route for hash " + hash + "!");
                return false;
            } else if (!route && Router.__eventOnNotFound) {
                Router.__eventOnNotFound(Router.__hashToArray(hash));
                return false;
            }
            return Router.run(route);
        },
        __hashToArray: function (hash) {
            var tokens = hash.split("/");
            if (tokens.length > 0 && tokens[0] == '#') tokens.shift();
            return tokens;
        },
        __run: function (route, state, previousResult) {
            if (route[state]) {
                var runTask = new Router.__task(function (result) {
                    var nextState = Router.__nextState(state);
                    if (nextState) Router.__run(route, nextState, result);
                });
                route.event = {};
                route.event.previousResult = previousResult;
                route.event.state = state;
                route.task = runTask;
                route[state]();
            } else {
                var nextState = Router.__nextState(state);
                if (nextState) Router.__run(route, nextState);
            }
        },
        __nextState: function (state) {
            if (state == 'before') return 'on';
            if (state == 'on') return 'after';
            return null;
        },
        __eventOnChange: null,
        __eventOnNotFound: null,
        __task: function (doneFunction) {
            return {
                __callback: doneFunction,
                ///Send a signal to task to execute callback function
                done: function (result) {
                    this.__callback(result);
                }
            }
        },
    }
    
    global.Router = Router;

})(this);

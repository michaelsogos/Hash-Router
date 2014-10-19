/*!
 * hash-router v1.0
 * https://github.com/michaelsogos/Hash-Router
 * 
 * Developed by Michael Sogos
 * Copyright 2014 
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Date: 2014-10-19
 *
 * Copyright (C) 2014 by Michael Sogos <![[michael.sogos[at]gurustudioweb[dot]it]]>
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
var Router = {
    init: function (onChangeFunction) {
        Router.__eventOnChange = onChangeFunction;
        if (!("onhashchange" in window)) {
            console.error("The browser doesn't support HASH on URL!");
            alert("The browser is not compatible with this web application!");
            return false;
        }
        window.onhashchange = function () { Router.listener(location.hash) }
        if (window.location.hash == '' || window.location.hash == '#') {
            Router.listener('#/');
            return true;
        }
        else {
            Router.listener(window.location.hash);
            return true;
        }
        return true;
    },
    listener: function (hash) {
        var route = Router.matchRoute(hash);
        if (!route) {
            console.error("Cannot find a valid route for hash " + hash + "!");
            return false;
        }
        return Router.run(route);
    },
    navigate: function (path) {
        window.location.hash = path;
    },
    __run: function (route, state, previousResult) {
        if (route[state]) {
            var runTask = new Router.task(function (result) {
                if (result !== false) {
                    var nextState = Router.__nextState(state);
                    if (nextState) Router.__run(route, nextState, result);
                }
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
    run: function (route) {
        Router.__eventOnChange(route);
        Router.__run(route, 'before');
    },
    add: function (route, overwrite) {
        var isAlreadyMapped = false;
        if (!route.path) {
            console.error("Cannot find property path when adding a new route!");
            return false;
        }
        for (i = 0; i < Router.routes.length; i++) {
            if (Router.routes[i].path === route.path) {
                isAlreadyMapped = true;
                if (overwrite === true) {
                    Router.routes[i] = route;
                    return;
                }
                break;
            }
        }
        if (isAlreadyMapped) {
            console.error("A ruote for the path " + ruote.path + " is already mapped!");
            return false;
        }
        Router.routes.push(route);
    },
    findRoute: function (path) {
        for (i = 0; i < Router.routes.length; i++) {
            if (Router.routes[i].path === path) return Router.routes[i];
        }
    },
    matchRoute: function (url) {
        var tester = url;
        var params = {};

        for (i = 0; i < Router.routes.length; i++) {
            var route = Router.routes[i];
            if (route.path.search(/:/) > 0) {//Dynamic parts
                var routeSlices = route.path.split("/");
                var testerSlices = tester.split("/");
                for (x = 0; x < routeSlices.length; x++) {
                    if ((x < testerSlices.length) && (routeSlices[i].charAt(0) === ":")) {
                        params[routeSlices[i].replace(/:/, '')] = testerSlices[i];
                        compare = tester.replace(testerSlices[i], routeSlices[i]);
                    }
                }
            }
            if (route.path === tester) {
                route.params = params;
                route.url = url;
                return route;
            }
        }
        return null;
    },
    routes: [],
}

Router.task = function (doneFunction) {
    return {
        __callback: doneFunction,
        done: function (result) {
            this.__callback(result);
        }
    }
}
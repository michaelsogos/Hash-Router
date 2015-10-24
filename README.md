# Hash-Router #

[![GitHub version](https://badge.fury.io/gh/michaelsogos%2Fhash-router.svg)](https://badge.fury.io/gh/michaelsogos%2Fhash-router)
[![Bower version](https://badge.fury.io/bo/hash-router.svg)](https://badge.fury.io/bo/hash-router)

Build Status:
Travis CI: [![Build Status](https://travis-ci.org/michaelsogos/Hash-Router.svg?branch=master)](https://travis-ci.org/michaelsogos/Hash-Router)</li>
CircleCi: [![Circle CI](https://circleci.com/gh/michaelsogos/Hash-Router/tree/master.svg?style=svg)](https://circleci.com/gh/michaelsogos/Hash-Router/tree/master)</li>    


Tiny and lightweight browser router library, developed with SPA in mind :)


[Documentation & Examples](http://michaelsogos.github.io/Hash-Router)

# Why #

I tried for two weeks many useful libraries (sammy.js, director.js, path.js, crossroads.js, etc.)
that do the same thing that i do with my library, but every time a piece of
code/functionality/behaviour lacks to reach the "perfection".

I'm working a lot developing SPA (single page application) web application, and in my opinion, 
an SPA web application have to be based on lazy loading concept, that's why the other libraries fail. 
In an lazy loading scenario the router rules could be lazy loaded.

So if i want to load a js file (controller?) that isn't loaded yet?
And if inside this file i will found new set of router rules?
And if one of these rules is the same that is executing now?

# How to manage lazy loading #

To better understanding imagine that your main application starts with some needed libarary 
(jquery, bootstrap, etc.) and the main js controller.
Of course a small set of router rules already existing in the main js controller,
but not every rules needed to the entire web app.

These initial rules are a starting point to load the right controller when a route is requested.

When the controller js files is loaded (as you want, like RequiredJS or any library suitable for you)
you have to:
<ul>
    <li>Register any route rules found into the controller</li>
    <li>Run route for the actual path running, because the main route was only a starting point</li>    
</ul>

# How to manage route function priority #

For any route is possible to specify a function to execute when the hash change, and to better organize
the code you can specify an <i><b>before</b></i> and <i><b>after</b></i> function too.

When a function make an ajax async request (or any async call) the issue could be that next function will be
executed before the actual function complete its execution.

So every function calls are syncronized thanks to a task manager (see the example).
The difference with other libraries is that you have to specify when your function/task has been done,
else the assumption is to not execute next function.

Actually the priority is <b><i>BEFORE</i></b> -> <b><i>ON</i></b> -> <b><i>AFTER</i></b>,
but there isn't a real difference using BEFORE or ON.
You can insert the custom code all in one method (not important which) without problem.
The only advantage is that any value returned from one function will be sent to the next function (see example),
this should really improve your code organization.
Typically i evaluate some condition on <b><i>BEFORE</i></b> and then execute specific code to the <b><i>ON</i></b>.

# Open Scenario #

The library can be used in normal scenario like you can do with path.js (or sammy.js or ...),
even if you don't need lazy loading capabilities.

The library have no opinion about how you lazy load files, and most important
<b>the context passed to route functions is completely customizable as you want</b>.


# Copyright and Licensing #
I hope you can appreciate my work and help me to improve this library with your suggestions.
Use it freely as you want!

Copyright (c) 2014 Michael Sogos, released under the MIT license.

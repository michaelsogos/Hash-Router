Hash-Router
===========

Tiny and lightweight browser router library, developed with SPA in mind :)

I tried for two week many useful library (sammy.js, director.js, path.js, crossroads.js, etc.) that do the samething that i do with my library;
but every time a piece of code/functionality/behaviour is missed to reach the "perfection".

I'm working a lot with SPA web application and, in my opinion, an SPA web application have to be based on lazy loading concept;
that's why the other library fail. In an lazy loading scenario the router rules could be lazy loaded.
So if i want to load a js file (controller?) that isn't loaded yet? And if inside this file i will found new set of router rules?

The library can be used in normal scenario like you can do with path.js (or sammy.js or ...),
but there are some behaviours in my library writed with lazy loading rules in mind.

The library have no opinion about how you lazy load files, and most important <b>the context passed to route functions is completely customizable as you want</b>.

I hope you can appreciate my work and help me to improve this library with your suggestions.



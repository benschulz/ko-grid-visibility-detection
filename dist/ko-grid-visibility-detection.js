/*
 Copyright (c) 2015, Ben Schulz
 License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
*/
function h(d,c){return function(e){return e}(function(e,b,f){function k(b){return b.parentNode?[b.parentNode].concat(k(b.parentNode)):[]}var d=["visible"],c=window.requestAnimationFrame.bind(window);f.defineExtension("ko-grid-visibility-detection",{Constructor:function(e,f,a){function m(){g||(g=c(function(){g=0;a.rootElement.offsetWidth&&a.rootElement.offsetHeight&&a.layout.recalculate()}))}var l=[],g=0;[a.rootElement].concat(k(a.rootElement)).forEach(function(a){var c=b.bindingProvider.instance.getBindingAccessors(a,
b.contextFor(a));d.forEach(function(a){if(a=c&&"function"===typeof c[a]&&c[a]){var d=a();a=b.isSubscribable(d)?d:b.pureComputed(a);l.push(a.subscribe(m))}})});this.dispose=function(){l.forEach(function(a){return a.dispose()})}}});return f.declareExtensionAlias("visibilityDetection","ko-grid-visibility-detection")}({},c,d))}
"function"===typeof define&&define.amd?define(["ko-grid","knockout","ko-data-source","ko-indexed-repeat"],h):window["ko-grid-visibility-detection"]=h(window.ko.bindingHandlers.grid,window.ko);
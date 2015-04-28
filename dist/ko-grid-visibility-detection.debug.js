/**
 * @license Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
;(function(factory) {
    if (typeof define === 'function' && define['amd'])
        define(['ko-grid', 'knockout', 'ko-data-source', 'ko-indexed-repeat'], factory);
    else
        window['ko-grid-visibility-detection'] = factory(window.ko.bindingHandlers['grid'], window.ko);
} (function(ko_grid, knockout) {
var ko_grid_visibility_detection_visibility_detection, ko_grid_visibility_detection;

ko_grid_visibility_detection_visibility_detection = function (module, ko, koGrid) {
  var extensionId = 'ko-grid-visibility-detection'.indexOf('/') < 0 ? 'ko-grid-visibility-detection' : 'ko-grid-visibility-detection'.substring(0, 'ko-grid-visibility-detection'.indexOf('/'));
  var INTERESTING_BINDINGS = ['visible'];
  // TODO allow configuration?
  var requestAnimationFrame = window.requestAnimationFrame.bind(window);
  koGrid.defineExtension(extensionId, {
    Constructor: function VisibilityDetectionExtension(bindingValue, config, grid) {
      var disposables = [], animationFrameRequest = 0;
      var recalculateLayoutIfNecessary = function () {
        if (!animationFrameRequest)
          animationFrameRequest = requestAnimationFrame(function () {
            animationFrameRequest = 0;
            if (grid.rootElement.offsetWidth && grid.rootElement.offsetHeight)
              grid.layout.recalculate();
          });
      };
      var ancestry = [grid.rootElement].concat(ancestorsOf(grid.rootElement));
      ancestry.forEach(function (a) {
        var bindings = ko.bindingProvider.instance.getBindingAccessors(a, ko.contextFor(a));
        INTERESTING_BINDINGS.forEach(function (b) {
          var valueAccessor = bindings && typeof bindings[b] === 'function' && bindings[b];
          if (!valueAccessor)
            return;
          var value = valueAccessor();
          var subscribable = ko.isSubscribable(value) ? value : ko.pureComputed(valueAccessor);
          disposables.push(subscribable.subscribe(recalculateLayoutIfNecessary));
        });
      });
      this.dispose = function () {
        disposables.forEach(function (disposable) {
          return disposable.dispose();
        });
      };
    }
  });
  function ancestorsOf(node) {
    return node.parentNode ? [node.parentNode].concat(ancestorsOf(node.parentNode)) : [];
  }
  return koGrid.declareExtensionAlias('visibilityDetection', extensionId);
}({}, knockout, ko_grid);
ko_grid_visibility_detection = function (main) {
  return main;
}(ko_grid_visibility_detection_visibility_detection);return ko_grid_visibility_detection;
}));
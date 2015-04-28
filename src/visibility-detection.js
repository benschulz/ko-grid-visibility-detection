'use strict';

define(['module', 'knockout', 'ko-grid'], function (module, ko, koGrid) {
    var extensionId = module.id.indexOf('/') < 0 ? module.id : module.id.substring(0, module.id.indexOf('/'));

    var INTERESTING_BINDINGS = ['visible']; // TODO allow configuration?

    var requestAnimationFrame = window.requestAnimationFrame.bind(window);

    koGrid.defineExtension(extensionId, {
        Constructor: function VisibilityDetectionExtension(bindingValue, config, grid) {
            var disposables = [],
                animationFrameRequest = 0;

            var recalculateLayoutIfNecessary = () => {
                if (!animationFrameRequest)
                    animationFrameRequest = requestAnimationFrame(() => {
                        animationFrameRequest = 0;

                        if (grid.rootElement.offsetWidth && grid.rootElement.offsetHeight)
                            grid.layout.recalculate();
                    });
            };

            var ancestry = [grid.rootElement].concat(ancestorsOf(grid.rootElement));
            ancestry.forEach(a => {
                var bindings = ko.bindingProvider.instance.getBindingAccessors(a, ko.contextFor(a));

                INTERESTING_BINDINGS.forEach(b => {
                    var valueAccessor = bindings && typeof bindings[b] === 'function' && bindings[b];
                    if (!valueAccessor)
                        return;

                    var value = valueAccessor();
                    var subscribable = ko.isSubscribable(value) ? value : ko.pureComputed(valueAccessor);
                    disposables.push(subscribable.subscribe(recalculateLayoutIfNecessary));
                });
            });

            this.dispose = function () {
                disposables.forEach(disposable => disposable.dispose());
            };
        }
    });

    function ancestorsOf(node) {
        return node.parentNode ? [node.parentNode].concat(ancestorsOf(node.parentNode)) : [];
    }

    return koGrid.declareExtensionAlias('visibilityDetection', extensionId);
});

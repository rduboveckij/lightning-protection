(function (angular, _, name) {
    "use strict";

    angular
        .module(name, [
            'lightning.protection.graphic.service'
        ])
        .directive('lightningProtectionRegion', LightningProtectionRegion);

    LightningProtectionRegion.$inject = [
        'lightningProtectionContext'
    ];

    function LightningProtectionRegion(lightningProtectionContext) {
        return {
            restrict: 'E',
            scope: {
                size: '=',
                reliability: '=',
                objects: '=',
                protectors: '=',
                grounds: '='
            },
            template: "<canvas id='mainRegion' width='780' height='780'/>",
            link: link,
            controller: LightningProtectionRegionController
        };

        function link(scope, element) {
            lightningProtectionContext.value = element.find('canvas')[0].getContext('2d');
        }
    }

    LightningProtectionRegionController.$inject = [
        '$scope',
        'lightningProtectionContext',
        'LightningProtectionService'
    ];

    function LightningProtectionRegionController($scope, lightningProtectionContext, LightningProtectionService) {
        $scope.$watch("size", watchSizeCb);
        $scope.$watch(watchInputValue, LightningProtectionService.draw, true);

        function watchSizeCb(size) {
            $scope.scale = lightningProtectionContext.original / size;
            $scope.proxyPoint = function (point) {
                return {
                    original: point,
                    x: point.x * $scope.scale,
                    y: (size - point.y) * $scope.scale,
                    z: point.z * $scope.scale
                };
            };
        }

        function watchInputValue(scope) {
            return {
                reliability: scope.reliability,
                objects: scope.objects,
                protectors: scope.protectors,
                grounds: scope.grounds,
                scale: scope.scale,
                proxyPoint: scope.proxyPoint
            };
        }
    }

})(angular, _, 'lightning.protection.graphic');
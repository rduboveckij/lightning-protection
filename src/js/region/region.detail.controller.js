(function (angular, _, name) {
    "use strict";

    angular
        .module(name, [
            'lightning.protection.graphic',
            'lightning.protection.service.math',
            'lightning.protection.service.model',
            'lightning.protection.point',
            'lightning.protection.constant',
            'lightning.protection.repository.local-storage',
            'lightning.protection.color-generator'
        ])
        .controller('RegionDetailCtrl', RegionDetailCtrl);

    RegionDetailCtrl.$inject = [
        '$scope',
        '$rootScope',
        '$routeParams',
        'ProtectionZoneUtil',
        'protectionReliability',
        'PointDialogFactory',
        'LocalStorage',
        'ColorGenerator',
        'BaseMath',
        'ModelFactory'
    ];

    function RegionDetailCtrl($scope, $rootScope, $routeParams, ProtectionZoneUtil, protectionReliability, PointDialogFactory, LocalStorage, ColorGenerator, BaseMath, ModelFactory) {
        $scope.protectionReliability = protectionReliability;
        $scope.region = _.findWhere(LocalStorage.regions, {id: $routeParams.id});
        $scope.protector = ModelFactory.emptyProtector();
        $scope.object = ModelFactory.emptyObject();

        $scope.addProtector = addProtector;
        $scope.removeProtector = removeProtector;
        $scope.editProtector = editProtector;
        $scope.addObject = addObject;
        $scope.removeObject = removeObject;
        $scope.editObject = editObject;
        $scope.addOrEditObjectPoint = addOrEditObjectPoint;
        $scope.addOrEditProtectorPoint = addOrEditProtectorPoint;
        $scope.removeObjectPoint = removeObjectPoint;
        $scope.addOrEditRegionPoint = addOrEditRegionPoint;
        $scope.removeRegionPoint = removeRegionPoint;

        $scope.$watch(watchForObjectDto, calcObjectDtos, true);
        $scope.$watch(watchCalcZone, calcZone, true);

        $rootScope.addDetailToNav($scope.region.id, $scope.region.name);

        $scope.$on('$destroy', $rootScope.removeDetailFromNav);

        function watchForObjectDto() {
            return {objects: $scope.region.objects, grounds: $scope.region.grounds};
        }

        function watchCalcZone() {
            return {
                objects: $scope.region.objects,
                protectors: $scope.region.protectors,
                reliability: $scope.region.reliability
            };
        }

        function addProtector() {
            $scope.region.protectors.push($scope.protector);
            $scope.protector = ModelFactory.emptyProtector();
        }

        function removeProtector(protector) {
            $scope.region.protectors = _.without($scope.region.protectors, protector);
        }

        function editProtector(protector) {
            $scope.removeProtector(protector);
            $scope.protector = protector;
        }

        function addObject() {
            $scope.region.objects.push($scope.object);
            $scope.object = ModelFactory.emptyObject();
        }

        function removeObject(object) {
            $scope.region.objects = _.without($scope.region.objects, object);
        }

        function editObject(object) {
            $scope.removeObject(object);
            $scope.object = object;
        }

        function addOrEditObjectPoint(point) {
            PointDialogFactory.addOrEditPoint(point, $scope.region.size).then(function (newPoint) {
                $scope.removeObjectPoint(point);
                $scope.object.points.push(newPoint);
            });
        }

        function addOrEditProtectorPoint() {
            PointDialogFactory.addOrEditPoint($scope.protector.point, $scope.region.size).then(function (newPoint) {
                $scope.protector.point = newPoint;
            });
        }

        function removeObjectPoint(point) {
            $scope.object.points = _.without($scope.object.points, point);
        }

        function addOrEditRegionPoint(point) {
            PointDialogFactory.addOrEditPoint(point, $scope.region.size).then(function (newPoint) {
                $scope.removeRegionPoint(point);
                $scope.region.grounds.push(newPoint);
            });
        }

        function removeRegionPoint(point) {
            $scope.region.grounds = _.without($scope.region.grounds, point);
        }

        function calcObjectDtos(value) {
            var fixedPoint = _.min(value.grounds, function (point) {
                return point.x + point.y;
            });
            $scope.objectDtos = _.map(value.objects, function (object) {
                var result = _.clone(object);
                result.points = _.map(result.points, function (point) {
                    var result = _.clone(point);
                    result.x += fixedPoint.x;
                    result.y += fixedPoint.y;
                    return result;
                });
                result.centerOfSharp = BaseMath.centerOfSharp(result.points);
                return result;
            });
        }

        function calcZone(value) {
            $scope.protectorSplits = ProtectionZoneUtil.splitRods(value.protectors, value.reliability);
            var calcSingleRod = ProtectionZoneUtil.getSingleRod(value.reliability);
            $scope.protectorSplits.singles = $scope.protectorSplits.singles
                .map(calcSingleRod)
                .map(protectorFindZoneForSingleRod)
                .value();

            $scope.protectorSplits.duals = $scope.protectorSplits.duals
                .map(orderKeyAndValue)
                .map(function (pair) {
                    pair.key = calcSingleRod(pair.key);
                    pair.value = calcSingleRod(pair.value);
                    return pair;
                })
                .map(prepareDualRod)
                .map(protectorFindZoneForDualRod)
                .value();
        }

        function orderKeyAndValue(pair) {
            var key = pair.key, value = pair.value;
            if (key.point.y >= value.point.y) {
                return pair;
            }
            pair.key = value;
            pair.value = key;
            return pair;
        }

        function protectorFindZoneForSingleRod(protector) {
            protector.zones = _.chain($scope.objectDtos)
                .pluck('points')
                .flatten()
                .filter(_.curry(ProtectionZoneUtil.isPointInProtector)(protector))
                .pluck('z')
                .uniq()
                .map(function (height) {
                    return {
                        enabled: true,
                        height: height,
                        radius: ProtectionZoneUtil.rodCalc(protector.radius, protector.height, height),
                        color: ColorGenerator.generate(height)
                    };
                })
                .value();
            protector.zones.unshift({
                enabled: true,
                height: 0,
                radius: protector.radius,
                color: ColorGenerator.default
            });
            return protector;
        }

        function protectorFindZoneForDualRod(pair) {
            var key = pair.key, value = pair.value;
            pair.zones = _.chain($scope.objectDtos)
                .pluck('points')
                .flatten()
                .filter(function (point) {
                    return ProtectionZoneUtil.isPointInProtector(key, point) ||
                        ProtectionZoneUtil.isPointInProtector(value, point) ||
                        BaseMath.containsInPolygon(pair.polygon, point);
                })
                .pluck('z')
                .uniq()
                .map(function (height) {
                    return {
                        enabled: true,
                        height: height,
                        radiusKey: ProtectionZoneUtil.rodCalc(key.radius, key.height, height),
                        radiusValue: ProtectionZoneUtil.rodCalc(value.radius, value.height, height),
                        color: ColorGenerator.generate(height)
                    };
                })
                .value();
            pair.zones.unshift({
                enabled: true,
                height: 0,
                radiusKey: key.radius,
                radiusValue: value.radius,
                color: ColorGenerator.default
            });
            return pair
        }

        function prepareDualRod(pair) {
            var key = pair.key, value = pair.value;
            var theta = BaseMath.angle(key.point, value.point);
            pair.startTheta = (theta + 0.5) * Math.PI;
            pair.endTheta = (theta - 0.5) * Math.PI;
            pair.centerHeight = ProtectionZoneUtil.centerHeightCalc(pair);
            pair.polygon = [
                BaseMath.pointOnCircle(key.point, pair.startTheta, key.radius),
                BaseMath.pointOnCircle(key.point, pair.endTheta, key.radius),
                BaseMath.pointOnCircle(value.point, pair.endTheta, value.radius),
                BaseMath.pointOnCircle(value.point, pair.startTheta, value.radius)
            ];
            return pair;
        }
    }

})(angular, _, 'lightning.protection.region.detail');
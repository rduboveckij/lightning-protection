(function (angular, _, name) {
    "use strict";

    angular
        .module(name, [
            'lightning.protection.constant'
        ])
        .factory('ProtectionZoneUtil', ProtectionZoneUtil);

    ProtectionZoneUtil.$inject = [
        'protectionReliabilities',
        'BaseMath'
    ];

    function ProtectionZoneUtil(protectionReliabilities, BaseMath) {
        return {
            isPointInProtector: isPointInProtector,
            centerHeightCalc: centerHeightCalc,
            rodCalc: rodCalc,
            findAllHeight: findAllHeight,
            calcRadius: calcRadius, // @Deprecated
            getSingleRod: getSingleRod,
            getDualRod: getDualRod,
            splitRods: splitRods
        };

        function isPointInProtector(protector, point) {
            return point.z <= protector.height && BaseMath.distance(protector.point, point) <= protector.radius;
        }

        function centerHeightCalc(pair) {
            var L = pair.distance, Lmax = pair.distanceMax,
                Lc = pair.distanceMiddle, h0 = pair.mainHeight;
            return L <= Lc ? h0 : h0 * (Lmax - L) / (Lmax - Lc)
        }

        function rodCalc(r0, h, hx) {
            return r0 * (h - hx) / h;
        }

        function findAllHeight(objects) {
            return _.chain(objects)
                .pluck('points')
                .flatMap(angular.identity)
                .pluck('z')
                .uniq()
                .map(function (z) {
                    return {enabled: true, height: z};
                })
                .value();
        }

        function calcRadius(protector, objectsPoints, singleRodData) {
            var pointRod = protector.point;
            var radius = singleRodData(protector.point.z).radius;
            var points = _.filter(objectsPoints, function (point) {
                return BaseMath.distance(pointRod, point) <= radius;
            });
            if (_.size(points) > 1) {
                return [singleRodData(_.min(points).z), singleRodData(_.max(points).z)];
            } else {
                return [radius];
            }
        }

        function getSingleRod(value) {
            var factory = findRod(value, 'singleRod');
            return function (protector) {
                return _.extend(_.clone(protector), factory(protector.point.z));
            };
        }

        function getDualRod(value) {
            return findRod(value, 'dualRod');
        }

        function findRod(value, type) {
            var reliability = _.findWhere(protectionReliabilities, {reliability: value});
            if (!reliability) {
                console.error("This reliability is not supported", reliability);
            }
            return function (h) {
                var range = _.find(reliability.ranges, function (item) {
                    return item.range.from < h && h <= item.range.to
                });
                if (!range) {
                    console.error("Stem height of more than 150, zero or negative are not allowed", reliability, h);
                }
                return range[type](h);
            };
        }

        function splitRods(protectors, reliability) {
            var dualRodData = getDualRod(reliability);
            var dualRods = _.chain(protectors)
                .manyToMany()
                .map(function (pair) {
                    var first = pair.key.point, second = pair.value.point;
                    // todo: not checked idea
                    var h = Math.min(first.z, second.z);
                    return _.extend(pair, {
                        mainHeight: h,
                        distance: BaseMath.distance(first, second)
                    }, dualRodData(h));
                })
                .filter(function (pair) {
                    var first = pair.key.point, second = pair.value.point;
                    // todo: not checked idea
                    var h = Math.min(first.z, second.z);
                    return BaseMath.distance(first, second) <= dualRodData(h).distanceMax;
                })
                // order is necessary
                .uniq(function (pair) {
                    return 31 * (parseInt(pair.key.id) + parseInt(pair.value.id));
                })
                .value();
            var excluded = _.chain(dualRods)
                .flatMap(_.values)
                .uniq('id')
                .value();
            var singleRods = _.reject(protectors, function (protector) {
                return _.include(excluded, protector);
            });
            return {singles: _.chain(singleRods), duals: _.chain(dualRods)};
        }
    }

    angular
        .module(name)
        .factory('BaseMath', BaseMath);

    function BaseMath() {
        return {
            angle: angle,
            distance: distance,
            uuid2: uuid2,
            centerOfSharp: centerOfSharp,
            avgPoint: avgPoint,
            pointOnCircle: pointOnCircle,
            containsInPolygon: containsInPolygon
        };

        function angle(first, second) {
            var y = second.y - first.y, x = second.x - first.x;
            var theta = Math.atan2(y, x) / Math.PI;
            return theta < 0 ? Math.abs(theta) : (2 - theta);
        }

        function distance(first, second) {
            return Math.sqrt(Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2));
        }

        // RFC4122v4 compliant solution with modification
        function uuid2() {
            var accumulate = Date.now();
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, genNumber);

            function genNumber(char) {
                var number = (accumulate + Math.random() * 16) % 16 | 0;
                accumulate = Math.floor(accumulate / 16);
                return (char === 'x' ? number : (number & 0x3 | 0x8)).toString(16);
            }
        }

        function centerOfSharp(points) {
            return {x: avgPoint(points, 'x'), y: avgPoint(points, 'y'), z: avgPoint(points, 'z')};
        }

        function avgPoint(points, property) {
            return _.reduce(_.pluck(points, property), function (memo, num) {
                    return memo + num;
                }, 0) / _.size(points);
        }

        function pointOnCircle(center, angle, radius) {
            return {
                x: center.x + Math.cos(angle) * radius,
                y: center.y + Math.sin(angle) * radius,
                z: center.z
            };
        }

        //  return h * (data.distanceMax - distance(first, second)) /
        //(data.distanceMax - data.distanceMiddle)
        /*
         test
         console.log(containsInPolygon([{x:0, y:0}, {x:0, y:3}, {x:3, y:3}, {x:3, y:0}], {x:2, y:2}), true);
         console.log(containsInPolygon([{x:0, y:0}, {x:0, y:3}, {x:3, y:3}, {x:3, y:0}], {x:0, y:0}), true);
         console.log(containsInPolygon([{x:0, y:0}, {x:0, y:3}, {x:3, y:3}, {x:3, y:0}], {x:2, y:5}), false);
         console.log(containsInPolygon([{x:0, y:0}, {x:0, y:3}, {x:3, y:3}, {x:3, y:0}], {x:5, y:2}), false);
         console.log(containsInPolygon([{x:0, y:0}, {x:0, y:3}, {x:3, y:3}, {x:3, y:0}], {x:-1, y:-1}), false);

         console.log(containsInPolygon([{x:0, y:0}, {x:0, y:3}, {x:4, y:4}, {x:4, y:0}], {x:3.5, y:3.5}), true);
         console.log(containsInPolygon([{x:0, y:0}, {x:0, y:3}, {x:4, y:4}, {x:4, y:0}], {x:0.5, y:3.5}), false);
         */
        function containsInPolygon(polygon, c) {
            if (_.isEmpty(polygon)) {
                return false;
            }
            return !_.any(_.map(_.zip(polygon, _.union(_.rest(polygon), [_.first(polygon)])), function (pair) {
                var a = _.first(pair);
                var b = _.last(pair);
                return (c.x - a.x) * (b.y - a.y) - (c.y - a.y) * (b.x - a.x);
            }), _.lessThan(0));
        }
    }

})(angular, _, 'lightning.protection.service.math');
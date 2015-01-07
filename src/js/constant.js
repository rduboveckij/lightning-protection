(function (angular, _, name) {
    "use strict";

    var protectionReliability = {
        DOT9: 0.9,
        DOT99: 0.99,
        DOT999: 0.999
    };

    var heightRange = {
        F0_T30: {from: 0, to: 30},
        F30_T100: {from: 30, to: 100},
        F100_T150: {from: 100, to: 150},
        MAX: 150
    };

    angular
        .module(name, [])
        .constant('heightRange', heightRange)
        .constant('protectionReliability', protectionReliability)
        .constant('protectionReliabilities', [
            {
                reliability: protectionReliability.DOT9,
                ranges: [
                    {
                        range: heightRange.F0_T30,
                        singleRod: single(simple(0.85), simple(1.2)),
                        dualRod: dual(simple(5.75), simple(2.5))
                    },
                    {
                        range: heightRange.F30_T100,
                        singleRod: single(simple(0.85), simple(1.2)),
                        dualRod: dual(hard(30, 5.75, 3.57), simple(2.5))
                    },
                    {
                        range: heightRange.F100_T150,
                        singleRod: single(simple(0.85), hard(100, 1.2)),
                        dualRod: dual(simple(5.5), simple(2.5))
                    }
                ]
            },
            {
                reliability: protectionReliability.DOT99,
                ranges: [
                    {
                        range: heightRange.F0_T30,
                        singleRod: single(simple(0.8), simple(0.8)),
                        dualRod: dual(simple(4.75), simple(2.5))
                    },
                    {
                        range: heightRange.F30_T100,
                        singleRod: single(simple(0.8), hard(30, 0.8, 1.43)),
                        dualRod: dual(hard(30, 4.75, 3.57), hard(30, 2.25, 10.07))
                    },
                    {
                        range: heightRange.F100_T150,
                        singleRod: single(hard(100, 0.8), simple(0.7)),
                        dualRod: dual(simple(4.5), simple(1.5))
                    }
                ]
            },
            {
                reliability: protectionReliability.DOT999,
                ranges: [
                    {
                        range: heightRange.F0_T30,
                        singleRod: single(simple(0.7), simple(0.6)),
                        dualRod: dual(simple(4.25), simple(2.25))
                    },
                    {
                        range: heightRange.F30_T100,
                        singleRod: single(hard(100, 0.7, 0.714), hard(30, 0.6, 1.43)),
                        dualRod: dual(hard(30, 4.25, 3.57), hard(30, 2.25, 10.07))
                    },
                    {
                        range: heightRange.F100_T150,
                        singleRod: single(hard(100, 0.65), hard(100, 0.5, 2)),
                        dualRod: dual(simple(4), simple(1.5))
                    }
                ]
            }
        ]);

    function simple(factor) {
        return function (h) {
            return factor * h;
        };
    }

    function hard(distance, a, b) {
        if (!b) {
            b = 1
        }
        return function (h) {
            return (a - b * 0.001 * (h - distance)) * h;
        };
    }

    function single(heightFunc, radiusFunc) {
        return function (h) {
            return {height: heightFunc(h), radius: radiusFunc(h)};
        };
    }

    function dual(distanceMaxFunc, distanceMiddleFunc) {
        return function (h) {
            return {distanceMax: distanceMaxFunc(h), distanceMiddle: distanceMiddleFunc(h)};
        };
    }

})(angular, _, 'lightning.protection.constant');
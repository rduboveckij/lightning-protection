(function (angular, _, randomColor, name) {
    "use strict";

    angular
        .module(name, [])
        .factory('ColorGenerator', ColorGenerator);

    function ColorGenerator() {
        var heightColors = {};
        return {
            default: '#337ab7',
            heightColors: heightColors,
            generate: generate
        };

        function generate(height) {
            if (!_.has(heightColors, height)) {
                heightColors[height] = randomColor({luminosity: 'bright'});
            }
            return heightColors[height];
        }
    }

})(angular, _, randomColor, 'lightning.protection.color-generator');
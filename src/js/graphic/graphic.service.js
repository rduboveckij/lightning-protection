(function (angular, _, name) {
    "use strict";

    angular
        .module(name, [
            'lightning.protection.service.math'
        ])
        .value("lightningProtectionContext", {value: null, original: 780})
        .factory('LightningProtectionRender', LightningProtectionRender);

    LightningProtectionRender.$inject = [
        'lightningProtectionContext'
    ];

    function LightningProtectionRender(lightningProtectionContext) {
        var context;
        return {
            clear: clear,
            drawLabel: drawLabel,
            drawPolygon: drawPolygon,
            drawSingleRod: drawSingleRod,
            drawProtector: drawProtector,
            drawDualRodProtector: drawDualRodProtector,
            drawDualRodStroke: drawDualRodStroke
        };

        function clear() {
            context = lightningProtectionContext.value;
            var original = lightningProtectionContext.original;
            context.clearRect(0, 0, original, original)
        }

        function drawLabel(name, x, y, color) {
            context.font = '14pt Calibri';
            context.fillStyle = _.defaultEmpty(color, 'black');
            context.fillText(name, x, y);
        }

        function drawPolygon(points, color) {
            if (_.isEmpty(points)) {
                return;
            }
            var first = _.first(points);
            context.beginPath();
            context.moveTo(first.x, first.y);
            _.each(_.rest(points), function (point) {
                context.lineTo(point.x, point.y);
            });
            context.lineTo(first.x, first.y);
            context.closePath();
            context.strokeStyle = _.defaultEmpty(color, 'black');
            context.stroke();
        }

        function drawSingleRod(protector) {
            _.each(protector.zones, _.curry(drawSingleZone)(protector.point));
            drawProtector(protector);
        }

        function drawSingleZone(point, zone) {
            context.setLineDash([33, 10]);
            context.beginPath();
            context.arc(point.x, point.y, zone.radius, 0, 2 * Math.PI, false);
            context.closePath();
            context.strokeStyle = zone.color;
            context.stroke();
            context.setLineDash([]);
        }

        function drawProtector(protector) {
            var point = protector.point;
            context.beginPath();
            var protectorSize = 5;
            context.fillRect(point.x - protectorSize / 2, point.y - protectorSize / 2, protectorSize, protectorSize);
            context.font = '16pt Calibri';
            context.fillStyle = 'blue';
            context.fillText(protector.name, point.x + protectorSize, point.y - protectorSize);
        }

        function drawDualRodProtector(pair) {
            drawProtector(pair.key);
            drawProtector(pair.value);
        }

        function drawDualRodStroke(pair) {
            _.each(pair.zones, _.curry(drawDualZone)(pair));
            drawDualRodProtector(pair);
        }

        function drawDualZone(pair, zone) {
            var pointKey = pair.key.point, pointValue = pair.value.point,
                startTheta = pair.startTheta, endTheta = pair.endTheta;
            context.setLineDash([33, 10]);
            context.beginPath();
            context.arc(pointKey.x, pointKey.y, zone.radiusKey, startTheta, endTheta, false);
            context.arc(pointValue.x, pointValue.y, zone.radiusValue, endTheta, startTheta, false);
            /*context.moveTo(pair.b.x, pair.b.y);
             context.lineTo(pair.c.x, pair.c.y);
             context.moveTo(pair.a.x, pair.a.y);
             context.lineTo(pair.d.x, pair.d.y);*/
            context.closePath();
            context.strokeStyle = zone.color;
            context.stroke();
            context.setLineDash([]);
        }
    }

    angular
        .module(name)
        .factory('LightningProtectionService', LightningProtectionService);

    LightningProtectionService.$inject = [
        '$filter',
        'LightningProtectionRender',
        'BaseMath'
    ];

    function LightningProtectionService($filter, LightningProtectionRender, BaseMath) {
        return {
            draw: draw
        };

        function draw(value) {
            LightningProtectionRender.clear();
            drawGrounds(value);
            drawObjects(value);
            drawProtectors(value);
        }

        function drawGrounds(value) {
            LightningProtectionRender.drawPolygon(_.map($filter('orderBy')(value.grounds, 'created'), value.proxyPoint));
        }

        function drawObjects(value) {
            _.each(value.objects, function (object) {
                var points = $filter('orderBy')(object.points, 'created');
                LightningProtectionRender.drawPolygon(_.map(points, value.proxyPoint));
                var center = value.proxyPoint(object.centerOfSharp);
                LightningProtectionRender.drawLabel(object.name, center.x, center.y);
            });
        }

        function drawProtectors(value) {
            var splitRods = value.protectors;
            _.each(_.map(splitRods.singles, prepareSingleProtector(value.scale, value.proxyPoint)), LightningProtectionRender.drawSingleRod);
            _.each(_.map(splitRods.duals, prepareDualProtector(value.scale, value.proxyPoint)), LightningProtectionRender.drawDualRodStroke);
        }

        function prepareSingleProtector(scale, proxyPoint) {
            return function (protector) {
                var result = _.cloneDeep(protector);
                result.point = proxyPoint(result.point);
                result.radius *= scale;
                result.zones = _.map(_.filter(result.zones, {'enabled': true}), function (zone) {
                    zone.radius *= scale;
                    return zone;
                });
                return result;
            };
        }

        function prepareDualProtector(scale, proxyPoint) {
            return function (pair) {
                var result = _.cloneDeep(pair);
                result.key.point = proxyPoint(result.key.point);
                result.value.point = proxyPoint(result.value.point);
                result.zones = _.map(_.filter(result.zones, {'enabled': true}), function (zone) {
                    zone.radiusKey *= scale;
                    zone.radiusValue *= scale;
                    return zone;
                });
                return result;
            };
        }
    }

})(angular, _, 'lightning.protection.graphic.service');
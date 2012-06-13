/*jslint browser:true, sloppy:false, indent:4*/
/*global YUI*/
YUI.add('GeoLocTimeZones', function (Y) {
    "use strict";
    Y.namespace("GeoLoc");
   
    function init(config) {
        if (config.TZpointsID  === undefined) {
            config.TZpointsID = 'Time_zones_points'; // Path tags id from the svg image. Includes the UTC offset and the Time Zone. Points
        }
        if (config.TZmapID  === undefined) {
            config.TZmapID = 'Time_zones'; // Path tags id's from the svg image. Includes the UTC offset. Polygons
        }
        if (config.mapBoundaryID  === undefined) {
            config.mapBoundaryID = 'mapamundi_border'; // Rect tag id. Boundary of the world map svg image
        }
        function selectTimeZone(timeZone) {
            Y.all('.selected').each(function (node) {
                //add and remove classes in the onclick event on the map
                // un bug impide usar addclass, removeclass sobre nodos de svgs
                node.getDOMNode().className.baseVal = "";
            });
            
            Y.one('#' + config.pinID).setStyle('display', 'none');
            //check timezone exists (US/mountains doesn't)
            if (Y.one('#' + config.TZpointsID + " path[data-tz='" + timeZone + "']") !== null){
                var offSet = Y.one('#' + config.TZpointsID + " path[data-tz='" + timeZone + "']").getAttribute('data-standard-t');
                //check UTC offset exists. Because due to map generalization some islands have disappeared on the mapamundi
                if (Y.one('#' + config.TZmapID + " path[data-standard-t='" + offSet + "']") !== null) {
                    Y.one('#' + config.TZmapID + " path[data-standard-t='" + offSet + "']").getDOMNode().className.baseVal = "selected";
                }
                Y.one('#' + config.pinID).setStyle('display', 'block');
                Y.one('#' + config.pinID).setXY([(Y.one('#' + config.TZpointsID + " path[data-tz='" + timeZone + "']").getX() - config.pinOffsetX), (Y.one('#' + config.TZpointsID + " path[data-tz='" + timeZone + "']").getY() - config.pinOffsetY)]);
            //-config.pinOffsetX-config.pinOffsetY
            }
        }
       
        function cliqueado(e, filter) {
            var nodePos = [],
                selector,
                dist = 0,
                selectPoint;
            function getCloser(node) {
            // calculate the closer timezone to the click
                nodePos = node.getXY();
                if (Math.sqrt(Math.pow((nodePos[0] - e.pageX), 2) + Math.pow((nodePos[1] - e.pageY), 2)) < dist || dist === 0) {
                    dist = Math.sqrt(Math.pow((nodePos[0] - e.pageX), 2) + Math.pow((nodePos[1] - e.pageY), 2));
                    selectPoint = node;
                }
            }
            Y.all(filter).each(getCloser);
            selector = document.getElementById(config.selectID);
            selector.value = selectPoint.getAttribute('data-tz');
            selectTimeZone(selectPoint.getAttribute('data-tz'));
    
        function attachedToMap() {
            if (config.dynamicSelect) {
                var selectNode = Y.one('#' + config.divSelectContainerID);
                var createdNode = Y.Node.create('<select id="' + config.selectID + '" size="1" ></select>');
                selectNode.append(createdNode);
                createdNode.append(Y.Node.create('<option id="tz" value="UTC" selected="selected">Select a time zone</option>'));
                Y.all('#' + config.TZpointsID + ' path').each(function (node,index) {
                    // fills the select tag with the tz of the svg
                    createdNode.append(Y.Node.create('<option id= tz-"' + index + '" value="' + node.getAttribute('data-tz') + '">' + node.getAttribute('data-tz') + '</option>'));
                });
            } else {
                console.log('no');
            }
            
            function onClick(e) {
            // cliqueado (event, filter on the points with the timezone clicked on the map)
            cliqueado(e, '#' + config.TZpointsID + " path[data-standard-t='" +  e.target.getAttribute('data-standard-t') + "']");
            }
            Y.one('#' + config.TZmapID).delegate('click', onClick, 'path');
            
            function onClick(e) {
                // cliqueado (event, filter only with the tag path). the user click "on the sea". no timezone defined.
                cliqueado(e, '#' + config.TZpointsID + " path");
            }
            Y.one('#' + config.mapBoundaryID).delegate('click', onClick, 'rect');
            
            function onChange() {
                //selectTimeZone (timeZone)
                selectTimeZone(document.getElementById(config.selectID).value);
            }
            Y.one('#' + config.selectID).delegate('change', onChange, 'select');
            
        }
        Y.one('#' + config.svgImageID).load(config.svgURL, undefined, attachedToMap);
    }
    Y.GeoLoc.init = init;
}, '0.0.1', {
    requires: ['node', 'selector-css3', 'overlay','node-load']
});
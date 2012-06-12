/*jslint browser:true, sloppy:false, indent:4*/
/*global YUI*/
YUI.add('GeoLocTimeZones', function (Y) {
    "use strict";
    Y.namespace("GeoLoc");
   
    function init(config) {
        
        function selectTimeZone(timeZone) {
            Y.all('.selected').each(function (node) {
                //añadir y eliminar clases en Time_zones onclick sobre el mapa
                // un bug impide usar addclass, removeclass sobre nodos de svgs
                node.getDOMNode().className.baseVal = "";
            });
            
            Y.one('#' + config.pinID).setStyle('display', 'none');
            //check timezone exists (US/mountains doesnt)
            if (Y.one('#' + config.TZpointsID + " path[data-tz='" + timeZone + "']") !== null){
                var offSet = Y.one('#' + config.TZpointsID + " path[data-tz='" + timeZone + "']").getAttribute('data-standard-t');
                //check offset exists. Because due to map generalization some islands have disappeared on the mapamundi
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
        }
        function attachedToMap() {
            if (config.dynamicSelect) {
                var selectNode = Y.one('#' + config.divSelectContainerID);
                var createdNode = Y.Node.create('<select id="' + config.selectID + '" size="1" ></select>');
                selectNode.append(createdNode);
                console.log('#' + config.TZpointsID + ' path');
                //<option id="tz" value="UTC" selected="selected">Select a time zone</option>'
                createdNode.append(Y.Node.create('<option id="tz" value="UTC" selected="selected">Select a time zone</option>'));
                Y.all('#' + config.TZpointsID + ' path').each(function (node,index) {
                    //llenar el select con las tz presentes en el svg
                    createdNode.append(Y.Node.create('<option id= tz-"' + index + '" value="' + node.getAttribute('data-tz') + '">' + node.getAttribute('data-tz') + '</option>'));
                });
            } else {
                console.log('no');
            }
            
            function onClick(e) {
            // cliqueado(event, filter on the points with the timezone clicked on the map)
            cliqueado(e, '#' + config.TZpointsID + " path[data-standard-t='" +  e.target.getAttribute('data-standard-t') + "']");
            }
            Y.one('#' + config.TZmapID).delegate('click', onClick, 'path');
            
            function onClick(e) {
                // cliqueado(event, filter only with the tag path). the user click "on the sea". no timezone defined.
                cliqueado(e, '#' + config.TZpointsID + " path");
            }
            Y.one('#' + config.mapBoundaryID).delegate('click', onClick, 'rect');
            //añadir o eliminar clases en Time_zones_points y Time_zones on change del select option
            function onChange() {
                //selectTimeZone(timeZone)
                selectTimeZone(document.getElementById(config.selectID).value);
            }
            Y.one('#' + config.selectID).delegate('change', onChange, 'select');
            ///
            
        }
        Y.one('#' + config.svgImageID).load(config.svgURL, undefined, attachedToMap);
    }
    Y.GeoLoc.init = init;
}, '0.0.1', {
    requires: ['node', 'selector-css3', 'overlay','node-load']
});
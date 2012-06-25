tzwidget
========

<<<<<<< HEAD
GeoLocTimeZones module allows you to select a time zone directly by clicking the map or by selecting from a dropdown menu.
=======
GeoLocTimeZones module allows you to select a time zone directly on clicking the map or by selecting from a dropdown menu.
>>>>>>> 86b42ba81c814b125d707db521fc6ca3227a84fb


Includes:
	- GeoLocTimeZones.js: yui module

	- worldmap.svg: special worldmap create based on the IANA time zone database http://www.iana.org/time-zones.

	- tzWidget.html: html sample. How to use the GeoLocTimeZones module and the configuration variables.
		
		+ Configuration variables:
		--------------------------
	
			- pinOffsetX: Sets the marker horizontal alignment Center.
                        
			- pinOffsetY: Sets the marker vertical alignment baseline (respects to marker's size).
                            
			- pinID: 'location'. Pin marker ID.
                            
			- selectID: 'selector-widget-tz'. Select tag to choose the time zone.
                            
			- divSelectContainerID: 'selector'. Select container Id (div).
                            
			- dynamicSelect: true/false. Fill the select option dynamically with the timezones stored in the 
			
			  svg. If 'false' you create the select.
                            
			- svgImageID: 'worldmap'. Svg Id.
                            
			- svgURL: 'worldmap.svg'. url to the svg image.


	- tzWidget\style.css: style sheet for the correct view of the map.

	- tzWidget\location_pin.png: pin marker image, with transparency.

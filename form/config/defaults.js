define({
    //Default configuration settings for the applciation. This is where you"ll define things like a bing maps key,
    //default web map, default app color theme and more. These values can be overwritten by template configuration settings
    //and url parameters.
    "appid": "0e7cf371140140f781843cd6c1bbee33",
    "webmap": "",
    "form_layer": {
        "id": ""
    },
    "details": {
        "Title": "",
        "Logo": "",
        "Description": ""
    },
    "fields": {
    },
    "theme": "basic", // see values in themes.js
    "oauthappid": null,
    //Enter the url to the proxy if needed by the applcation. See the "Using the proxy page" help topic for details
    // //developers.arcgis.com/en/javascript/jshelp/ags_proxy.html
    "proxyurl": "",
    //Example of a template specific property. If your template had several color schemes
    //you could define the default here and setup configuration settings to allow users to choose a different
    //color theme.
    //Enter the url to your organizations bing maps key if you want to use bing basemaps
    "bingmapskey": "",
    //Defaults to arcgis.com. Set this value to your portal or organization host name.
    "sharinghost": location.protocol + "//" + "www.arcgis.com",
    "units": null,
    "useSmallHeader": false,
    "enableSharing": false,
    "defaultMapExtent": true,
    "pushpinColor": "blue",
    "nextBasemap": "hybrid",
    "defaultBasemap": "topo",
    "selectedTitleField": {},
    "disableViewer": false,
    "enableAttachments": true,
    "attachmentIsRequired": false,
    "attachmentLabel": "",
    "attachmentHelpText": "",
    "showLayer": true,
    "disableLogo": false,
    "enableBasemapToggle": false,
    "enableOfflineSupport": true,
    "locate":false,
    "locationSearchOptions": {
        "enableMyLocation": true,
        "enableSearch": true,
        "enableLatLng": true,
        "enableUSNG": false,
        "enableMGRS": false,
        "enableUTM": false
    },
    "locationSearch": true,
    //When searchExtent is true the locator will prioritize results within the current map extent.
    "searchExtent": false,
    "searchLayers":[{
        "id": "",
        "fields": []
    }],
    "attachmentInfo":{
    },
    "submitButtonText": "",
    "viewSubmissionsText": "",
    "helperServices": {
        "geometry": {
            "url": null
        },
        "printTask": {
            "url": null
        },
        "elevationSync": {
            "url": null
        },
        "geocode": [{
            "url": null
        }]
    },
    "bitlyLogin": "a8341e480f22bf45cd2260dd94de4723dd9a4cd8",
    "bitlyKey": "723a5ab5f5ce04993bfe988104286c7e0c619962"
});

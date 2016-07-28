// --------------- get querystring value ----------------------------
// this function gets the dotnum of the crossing the user was viewing from
// the url so that it can be used for query tasks in the report page
// -----------------------------------------------------------------------
function getParameterByName (name) {
  if (name !== '' && name !== null && name !== undefined) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
    var results = regex.exec(location.search)
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
  } else {
    var arr = location.href.split('/')
    return arr[arr.length - 1]
  }
}
// ----------------------------------------------------------------

// -------------------------------------------------------------------
// ----------------- Initialize ArcGIS Javascript API Functions -----------
// --------------------------------------------------------------------
require([
  'dojo/dom', 'dojo/on',
  'esri/tasks/query', 'esri/tasks/QueryTask',
  'esri/layers/FeatureLayer', 'esri/map', 'esri/symbols/SimpleMarkerSymbol',
  'esri/renderers/SimpleRenderer', 'esri/graphic',
  'dojo/domReady!'
], function (dom, on, Query, QueryTask, FeatureLayer, Map, SimpleMarkerSymbol, SimpleRenderer, Graphic) {
  // ---------------------------------------------------------------------

  var FormNo = getParameterByName('FormNo') // fetch form number from URL

  var RRWCUrl = 'https://services1.arcgis.com/NXmBVyW5TaiCXqFs/ArcGIS/rest/services/Flaggging_Request_ALL/FeatureServer/0' // feature service url

  var RRWCFeatureLayer = new FeatureLayer(RRWCUrl, 'RRWC') // create FeatureLayer for updating later

  // -------------------------------------------------------------------
  // ------------Setup Map & symbol -------------------------------
  // -------------------------------------------------------------

  var symbol = new SimpleMarkerSymbol({
    'color': [20, 175, 200, 150],
    'size': 17,
    'type': 'esriSMS',
    'style': 'esriSMSDiamond',
    'outline': { 'color': [255, 255, 255, 255], 'width': 1 }
  })

  var map = new Map('map', {
    center: [-72, 44],
    zoom: 5,
    basemap: 'hybrid'
  })

  // -----------------------------------------------------

  // -------------------------------------------------------------------
  // ------------Set Query Parameters -------------------------------
  // -------------------------------------------------------------
  var queryTask = new QueryTask(RRWCUrl)

  var query = new Query()

  var outFields = [
    'AppDate',
    'CompName', 'WorkReason', 'BillAddress', 'BillTown', 'BillState', 'BillZIP',
    'CompType', 'AppName', 'AppPhone', 'AppEmail', 'WorkRR', 'WorkTown',
    'WorkFromMP', 'WorkToMP', 'WorkDuration', 'WorkStartDate', 'WorkDescription',
    'WorkEquipment', 'WorkCompletionDate', 'WorkAsset'
  ]

  query.outFields = outFields
  query.returnGeometry = true
  query.outSpatialReference = {'wkid': 4326}

  query.where = 'FormNo=' + FormNo

  // execute query and then pass result into getPhotos func and initiate
  queryTask.execute(query, showResults)
  // -----------------------------------------------------

  function showResults (results) {
    var makeSpans = []
    var resultItems = []
    var resultCount = results.features.length

    var resultFeature = results.features[0]
    var graphic = new Graphic()
    graphic.setSymbol(symbol)
    graphic.geometry = resultFeature.geometry

    var x = Number(results.features[0].geometry.x.toFixed(4))
    var y = Number(results.features[0].geometry.y.toFixed(4))

    for (var fields in results.fields) {
      makeSpans.push('<strong>' + results.fields[fields].alias + ': </strong>' + '<span class="data" id="' + results.fields[fields].name + '"></span><br>')
    }
    dom.byId('full-info').innerHTML = makeSpans.join('')

    for (var i = 0; i < resultCount; i++) {
      var featureAttributes = results.features[i].attributes
      for (var attr in featureAttributes) {
        if (featureAttributes[attr]) {
          resultItems = []
          if (attr.includes('Date')) {
            var d = new Date(featureAttributes[attr])
            var n = document.querySelectorAll('#' + attr)
            for (var j = 0; j < n.length; j++) {
              n[j].innerHTML = d.format('dddd, mmmm dS, yyyy')
            }
          } else {
            resultItems.push('<strong>' + attr + ': </strong>' + featureAttributes[attr] + '</br>')
            var o = document.querySelectorAll('#' + attr)
            for (var k = 0; k < o.length; k++) {
              o[k].innerHTML = featureAttributes[attr]
            }
          }
        } else {
          var p = document.querySelectorAll('#' + attr)
          for (var l = 0; l < p.length; l++) {
            p[l].innerHTML = '<em> not specified </em>'
          }
        }
      }
    }
    map.on('load', function () {
      map.centerAndZoom([x, y], 16)
      map.graphics.add(graphic)
    })
  }

  function createGraphic (formAttributes) {

  }

  function sendUpdate (data) {
    console.log(data + ' update sent')
  }
})

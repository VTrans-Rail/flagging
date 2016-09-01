// --------------- get querystring value ----------------------------
// this function gets the dotnum of the crossing the user was viewing from
// the url so that it can be used for query tasks in the report page
// -----------------------------------------------------------------------
function getParameterByName (name) {
  if (name !== '' && name !== null && name !== undefined) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
    var results = regex.exec(window.location.search)
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
  } else {
    var arr = window.location.href.split('/')
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

  var RRWCFeatureLayer = new FeatureLayer(RRWCUrl, {
    outFields: ['*']
  }) // create FeatureLayer for updating later

  var feature = '' // make the feature var in the global scope to allow access later

  on(dom.byId('approve'), 'click', function () { submit('approved') })
  on(dom.byId('reject'), 'click', function () { submit('rejected') })

  // -------------------------------------------------------------------
  // ------------Setup Map & symbol -------------------------------
  // -------------------------------------------------------------

  var symbol = new SimpleMarkerSymbol({ // symbol setup using JSON object from http://help.arcgis.com/en/arcgisserver/10.0/apis/rest/symbol.html
    'color': [20, 175, 200, 150],
    'size': 17,
    'type': 'esriSMS',
    'style': 'esriSMSDiamond',
    'outline': { 'color': [255, 255, 255, 255], 'width': 1 }
  })
  if (document.getElementById('map')) { // only show if there is a map div
    var map = new Map('map', {
      center: [-72, 44],
      zoom: 5,
      basemap: 'hybrid'
    })
  }

  // -----------------------------------------------------

  // -------------------------------------------------------------------
  // ------------Set Query Parameters -------------------------------
  // -------------------------------------------------------------
  var queryTask = new QueryTask(RRWCUrl)

  var query = new Query()

  var outFields = [
    'OBJECTID', 'AppDate',
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
    // setup the graphic of the one result feature
    feature = new Graphic(results.features[0].geometry, symbol, results.features[0].attributes)

    var makeSpans = [] // create one <span> for each `outField`
    for (var fields in results.fields) {
      if (document.getElementById('full-info')) { // for the vtrans page
        makeSpans.push('<strong>' + results.fields[fields].alias + ': </strong>' + '<span class="data" id="' + results.fields[fields].name + '"></span><br>')
      } else if (document.getElementById('status-info')) {

      }
    }
    dom.byId('full-info').innerHTML = makeSpans.join('') // populate the dom with the makeSpans and join each element with a ''

    var resultCount = results.features.length // number of attributes returned
    for (var i = 0; i < resultCount; i++) { // loop through each attribute
      var featureAttributes = results.features[i].attributes // populate the value of the current position
      for (var attr in featureAttributes) {
        if (featureAttributes[attr]) { // if not blank
          var resultItems = [] // clear out the array each loop
          if (attr.includes('Date')) { // if date, then format it accordingly
            var d = new Date(featureAttributes[attr])
            var n = document.querySelectorAll('#' + attr)
            for (var j = 0; j < n.length; j++) {
              n[j].innerHTML = d.format('dddd, mmmm dS, yyyy')
            }
          } else { // handle all other cases like this
            resultItems.push('<strong>' + attr + ': </strong>' + featureAttributes[attr] + '</br>')
            var o = document.querySelectorAll('#' + attr)
            for (var k = 0; k < o.length; k++) {
              o[k].innerHTML = featureAttributes[attr]
            }
          }
        } else { // if blank, set the _not specified_
          var p = document.querySelectorAll('#' + attr)
          for (var l = 0; l < p.length; l++) {
            p[l].innerHTML = '<em> not specified </em>'
          }
        }
      }
    }
    if (document.getElementById('map')) {
      var x = Number(results.features[0].geometry.x.toFixed(4)) // get the coordinates of the result
      var y = Number(results.features[0].geometry.y.toFixed(4))
      if (map.loaded) {
        map.centerAndZoom([x, y], 16)
        map.graphics.add(feature)
      } else {
        map.on('load', function () { // once the map is loaded, center and zoom and add point
          map.centerAndZoom([x, y], 16)
          map.graphics.add(feature)
        })
      }
    }
  }

  // -------------------------------------------------------
  // Tool for gathering data from the form
  // calculating some new values
  // passing them back into the featureclass
  // and kicking off the email submit process
  // -------------------------------------------------------

  function submit (decision) {
    var formFields = document.getElementsByClassName('form-control')

  // verify that the form is filled out
  // show error warnings if left blank
  // remove error warnings if filled out

    for (var i = 0; i < formFields.length; i++) {
      if (formFields[i].value) {
        var exes = document.getElementsByClassName('form-control-feedback')
        for (var l = 0; l < exes.length; l++) {
          exes[l].style.display = 'none'
        }
        formFields[i].parentElement.className = 'form-group'
        document.getElementById('incomplete').style.display = 'none'
      } else {
        formFields[i].parentElement.className += ' has-error has-feedback'
        document.getElementById('incomplete').style.display = 'block'
        var xes = document.getElementsByClassName('form-control-feedback')
        for (var j = 0; j < xes.length; j++) {
          xes[j].style.display = 'block'
        }
      }
    }

    var formData = {} // set blank object for holding data from the form

    // fetch values from the form
    // set today's date
    formData.AgentName = document.getElementById('agentName').value
    formData.Comments = document.getElementById('comments').value
    formData.ApproveDate = new Date().format('m/dd/yy')
    formData.Decision = decision

    sendUpdate(formData) // submit data to REST endpoint
  }

  function sendUpdate (formData) { // this will hold the function that pushes the update
    // updated attributes of the feature returned by the query layer
    feature.setAttributes({
      RPMApprovalBy: formData.AgentName,
      RPMComment: formData.Comments,
      RPMDecisionDate: formData.ApproveDate,
      RRDecision: formData.Decision
    })
    // run the applyEdits tool against the featureclass with the feature data
    try {
      RRWCFeatureLayer.applyEdits(null, [feature], null, clearForm, errback)
    } catch (e) {
      console.error(e)
    } finally {
      RRWCFeatureLayer.on('edits-complete', function () { console.log('edits complete') })
    }
  }

  function clearForm () { // a function to clear the form after successful submission
    console.log('successful callback')
  }
  function errback () {
    console.error('error')
  }
})

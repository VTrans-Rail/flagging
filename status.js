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
  'esri/graphic', 'dojo/domReady!'
], function (dom, on, Query, QueryTask, Graphic) {
  // ---------------------------------------------------------------------

  var FormNo = getParameterByName('FormNo') // fetch form number from URL

  if (!FormNo) {
    badFormNo('blank') // run this after getting formNo from the URL
  }

  function badFormNo (problem) {
    var mains = document.getElementsByClassName('main')
    for (var i = 0; i < mains.length; i++) {
      mains[i].style.display = 'none'
    }
    if (problem === 'blank') {
      document.getElementById('noFormNo').style.display = 'block'
    } else if (problem === 'noResults') {
      document.getElementById('badFormNo').style.display = 'block'
    }
  }

  var RRWCUrl = 'https://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/PM_FlaggingRequest_ALL_Hosted/FeatureServer/0' // feature service url

  var feature = '' // make the feature var in the global scope to allow access later

  // -----------------------------------------------------
  // -------------------------------------------------------------------
  // ------------Set Query Parameters -------------------------------
  // -------------------------------------------------------------
  var queryTask = new QueryTask(RRWCUrl)

  var query = new Query()

  var outFields = ['*']

  query.outFields = outFields
  query.returnGeometry = true
  query.outSpatialReference = {'wkid': 4326}

  query.where = 'FormNo=' + FormNo

  // execute query and then pass result into getPhotos func and initiate
  queryTask.execute(query, showResults)
  // -----------------------------------------------------

  function showResults (results) {
    // check if the formNo is invalid, returning null results
    if (results.features.length === 0) {
      badFormNo('noResults')
      return
    }

    // setup the graphic of the one result feature
    feature = new Graphic(results.features[0].geometry, null, results.features[0].attributes)

    var displayFields = ['AppDate', 'FormNo', 'RRFlaggerPhone', 'RRFlagger']

    var reqStatus = ['<h2><i class="glyphicon glyphicon-ok"></i></h2><p><strong>Submitted </strong><i><span id="AppDate"></span></i></p>']

    var req = dom.byId('req-status')
    req.innerHTML = reqStatus.join('')
    req.style.color = 'green'

    var reqnum = dom.byId('reqnum')
    reqnum.innerHTML = feature.attributes.FormNo

    if (feature.attributes.RPMDecision) { // if VTrans has approved
      displayFields.push('RPMDecision', 'RPMDecisionDate')
      reqStatus = ['<h2><i class="glyphicon glyphicon-ok"></i></h2><p><strong>Approved </strong><i><span id="RPMDecisionDate"></span></i></p>']
      req = dom.byId('rpm-status')
      req.innerHTML = reqStatus.join('')
      req.style.color = 'green'
    }

    if (feature.attributes.RRDecision) {
      displayFields.push('RRDecision', 'RRDecisionDate')
      reqStatus = ['<h2><i class="glyphicon glyphicon-ok"></i></h2><p><strong>Approved </strong><i><span id="RRDecisionDate"></span></i></p>']
      req = dom.byId('vrs-status')
      req.innerHTML = reqStatus.join('')
      req.style.color = 'green'
      var approved = document.getElementById('approved').style = 'display: block'
    }

    var displayArray = results.fields.filter(function (field) { return (displayFields.indexOf(field.name) >= 0) })

    var resultCount = results.features.length // number of attributes returned
    for (var i = 0; i < resultCount; i++) { // loop through each attribute
      var featureAttributes = results.features[i].attributes // populate the value of the current position
      for (var attr in featureAttributes) {
        if (featureAttributes[attr]) { // if not blank
          var resultItems = [] // clear out the array each loop
          if (attr.indexOf('Date') !== -1) { // if date, then format it accordingly
            var d = new Date(featureAttributes[attr])
            var n = document.querySelectorAll('#' + attr)
            for (var j = 0; j < n.length; j++) {
              n[j].innerHTML = d.format('mmmm dS, yyyy')
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
  }
})

/* global sendEmail */
var feature = '' // make the feature var in the global scope to allow access later
var decision = ''
// var formType = window.location.pathname.split(/(\w+)/)[1] // for dev
var formType = window.location.pathname.match(/v\w+/)[0] // for prod

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
  'esri/renderers/SimpleRenderer', 'esri/graphic', 'esri/arcgis/utils',
  'dojo/domReady!'
], function (dom, on, Query, QueryTask, FeatureLayer, Map, SimpleMarkerSymbol, SimpleRenderer, Graphic, arcgisUtils) {
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

  var RRWCFeatureLayer = new FeatureLayer(RRWCUrl, {
    outFields: ['*']
  }) // create FeatureLayer for updating later

  on(dom.byId('approve'), 'click', function () { submit('Approve') })
  on(dom.byId('reject'), 'click', function () { submit('Reject') })

  // -------------------------------------------------------------------
  // ------------Setup Map & symbol -------------------------------
  // -------------------------------------------------------------

  var webMapItemID = 'b1fe89a19dbe4204969c5c29328dd4c1'

  // var symbol = new SimpleMarkerSymbol({ // symbol setup using JSON object from http://help.arcgis.com/en/arcgisserver/10.0/apis/rest/symbol.html
  //   'color': [20, 175, 200, 150],
  //   'size': 17,
  //   'type': 'esriSMS',
  //   'style': 'esriSMSDiamond',
  //   'outline': { 'color': [255, 255, 255, 255], 'width': 1 }
  // })

  var symbol = new SimpleMarkerSymbol({ // symbol setup using JSON object from http://help.arcgis.com/en/arcgisserver/10.0/apis/rest/symbol.html
    'color': [0, 112, 255, 194],
    'size': 25,
    'type': 'esriSMS',
    'style': 'esriSMSDiamond',
    'outline': {
      'color': [0, 197, 255, 255],
      'width': 3,
      'type': 'esriSLS',
      'style': 'esriSLSSolid'
    }
  })

  if (document.getElementById('map')) { // only show if there is a map div
    // var map = new Map('map', {
    //   center: [-72, 44],
    //   zoom: 5,
    //   basemap: 'hybrid'
    // })

  }

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
    feature = new Graphic(results.features[0].geometry, symbol, results.features[0].attributes)

    if (feature.attributes.RPMDecision && formType === 'vtrans') { // check is the request has been previously approved
      document.getElementById('alertTop').style.display = 'block'
      document.getElementById('alertBot').style.display = 'block'
      document.getElementById('agentName').value = feature.attributes.RPMApprovalBy
      document.getElementById('comments').value = feature.attributes.RPMComment
    }

    if (feature.attributes.RRDecision && formType === 'vrs') { // check is the request has been previously approved
      document.getElementById('alertTop').style.display = 'block'
      document.getElementById('alertBot').style.display = 'block'
      document.getElementById('agentName').value = feature.attributes.RRApprovedBy
      document.getElementById('flaggerName').value = feature.attributes.RRFlagger
      document.getElementById('flaggerPhone').value = feature.attributes.RRFlaggerPhone
      document.getElementById('VRSComment').value = feature.attributes.RRComment
    }

    var makeSpans = [] // create one <span> for each `outField`

    // var displayFields = [ // fields as field names
    //   'AppDate',
    //   'CompName', 'VTransProject', 'BillAddress', 'BillTown', 'BillState', 'BillZIP',
    //   'CompType', 'AppName', 'AppPhone', 'AppEmail', 'WorkRR', 'WorkTown',
    //   'WorkFromMP', 'WorkToMP', 'WorkDuration', 'WorkStartDate', 'WorkCompletionDate', 'WorkDescription',
    //   'WorkEquipment', 'WorkCompletionDate', 'WorkAsset'
    // ]

    var displayFields = [ // shorter list until geoprocessing is setup
      'AppDate',
      'AppName',
      'AppPhone',
      'AppEmail',
      'CompName',
      'BillAddress',
      'BillTown',
      'BillState',
      'BillZIP',
      'WorkStartDate',
      'WorkDuration',
      'WorkCompletionDate',
      'WorkDescription',
      'WorkEquipment',
      'WorkCompletionDate',
      'VTransProject'
    ]

    var displayArray = results.fields.filter(function (field) { return (displayFields.indexOf(field.name) >= 0) })

    // TODO: Fix which fields are displayed (rather than ouftields = *)
    for (var field in displayArray) {
      makeSpans.push('<strong>' + displayArray[field].alias + ': </strong>' + '<span class="data" id="' + displayArray[field].name + '"></span><br>')
    }
    dom.byId('full-info').innerHTML = makeSpans.join('') // populate the dom with the makeSpans and join each element with a ''

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
      arcgisUtils.createMap(webMapItemID, 'map').then(function (response) {
        var map = response.map
        var x = Number(results.features[0].geometry.x.toFixed(4)) // get the coordinates of the result
        var y = Number(results.features[0].geometry.y.toFixed(4))
        if (map.loaded) {
          map.centerAndZoom([x, y], 18)
          map.graphics.add(feature)
        } else {
          map.on('load', function () { // once the map is loaded, center and zoom and add point
            map.centerAndZoom([x, y], 18)
            map.graphics.add(feature)
          })
        }
      })
    }
  }

  // -------------------------------------------------------
  // Tool for gathering data from the form
  // calculating some new values
  // passing them back into the featureclass
  // and kicking off the email submit process
  // -------------------------------------------------------

  function submit (click) {
    decision = click
    var agentField = document.getElementById('agentName') // grab agentName DOM node
    var formStatus = false
    if (formType === 'vrs') { // for VRS: check flaggerName DOM node too
      var checkResult // var for checking each vrs field
      var invalidCount = 0 // increment when invalid
      var controls = document.getElementsByClassName('form-control')
      for (var i = 0; i < 3; i++) { // 3 is the textarea which we don't care about
        checkResult = checkForm(controls[i])
        if (!checkResult) { // if checkForm comes back true, set formStatus to true
          invalidCount++
        }
      }
      if (!invalidCount) {
        formStatus = true
      }
    } else { // for vtrans page, just check agent
      formStatus = checkForm(agentField) // check that it has a value
    }

    var formData = {} // set blank object for holding data from the form

    // fetch values from the form
    // set today's date
    if (formType === 'vtrans') {
      formData.AgentName = document.getElementById('agentName').value
      formData.Comments = document.getElementById('comments').value
      formData.ApproveDate = new Date()
      formData.Decision = decision
    } else if (formType === 'vrs') {
      formData.AgentName = document.getElementById('agentName').value
      formData.RRFlagger = document.getElementById('flaggerName').value
      formData.flaggerPhone = document.getElementById('flaggerPhone').value
      formData.VRSComment = document.getElementById('VRSComment').value
      formData.ApproveDate = new Date()
      formData.Decision = decision
    }

    if (formStatus) { // if the checkForm returned true then the fields were filled out
      sendUpdate(formData) // submit data to REST endpoint
    } else {
      console.log('Not everything was filled out.')
    }
  }

  function checkForm (input) {
    // verify that the form is filled out
    // show error warnings if left blank
    // remove error warnings if filled out

    var checkResult = false

    if (input.value) { // if the agent name is filled out
      removeWarns()
      return checkResult
    } else { // if the agent name isn't filled out
      addWarns()
      return checkResult
    }

    function removeWarns () {
      var exes = document.getElementsByClassName('form-control-feedback') // find all instances of feedback
      for (var l = 0; l < exes.length; l++) {
        exes[l].style.display = 'none' // set them to display none
      }
      input.parentElement.className = 'form-group' // change the class of the parent group to remove has-error has-fedback
      document.getElementById('incomplete').style.display = 'none' // warning note text above buttons
      checkResult = true // go back to submit()
    }

    function addWarns () {
      input.parentElement.className += ' has-error has-feedback' // add the feedback classes to the parent
      document.getElementById('incomplete').style.display = 'block' // turn on feedback text above button
      var xes = document.getElementsByClassName('form-control-feedback') // turn on all feedback
      for (var j = 0; j < xes.length; j++) {
        xes[j].style.display = 'block'
      }
      checkResult = false
    }
  }

  function sendUpdate (formData) { // this will hold the function that pushes the update
    // updated attributes of the feature returned by the query layer
    if (formType === 'vtrans') {
      feature.attributes.RPMApprovalBy = formData.AgentName
      feature.attributes.RPMComment = formData.Comments
      feature.attributes.RPMDecisionDate = formData.ApproveDate
      feature.attributes.RPMDecision = formData.Decision
    } else {
      feature.attributes.RRApprovedBy = formData.AgentName
      feature.attributes.RRFlagger = formData.RRFlagger
      feature.attributes.RRFlaggerPhone = formData.flaggerPhone
      feature.attributes.RRComment = formData.RRComment
      feature.attributes.RRDecisionDate = formData.ApproveDate
      feature.attributes.RRDecision = formData.Decision
    }
    // run the applyEdits tool against the featureclass with the feature data
    try {
      RRWCFeatureLayer.applyEdits(null, [feature], null, null, errback)
    } catch (e) {
      console.error(e)
    }
  }

  RRWCFeatureLayer.on('edits-complete', handleEditsComplete)

  function handleEditsComplete (evt) {
        // Check for errors after online edits complete
    var errors = Array.prototype.concat(
            evt.adds.filter(function (r) {
              return !r.success
            }),
            evt.updates.filter(function (r) {
              return !r.success
            }),
            evt.deletes.filter(function (r) {
              return !r.success
            })
        )
    if (errors.length) {
      var messages = errors.map(function (e) {
        document.getElementById('editFail').style.display = 'block'
        return e.error.message
      })
      window.alert('Error editing features: ' + messages.join('\n'))
    } else {
      document.getElementById('editSuccess').style.display = 'block'
      prepEmail()
    }
  }

  function prepEmail () { // a function to fetch data to send in the email
    var emailFormParams = {
      req_email: feature.attributes.AppEmail,
      req_name: feature.attributes.AppName,
      email_type: decision,
      source: formType,
      form_number: feature.attributes.FormNo
    }
    sendEmail(emailFormParams)
  };
  function errback (e) {
    console.error(e)
  }
})

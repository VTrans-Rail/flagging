require([
  'dojo/dom', 'dojo/on',
  'esri/tasks/query', 'esri/tasks/QueryTask',
  'dojo/domReady!'
], function (dom, on, Query, QueryTask) {
  var RRWCUrl = 'https://services1.arcgis.com/NXmBVyW5TaiCXqFs/arcgis/rest/services/PM_FlaggingRequest_ALL_Hosted/FeatureServer/0' // feature service url

  // document.getElementById('submitButton').addEventListener('click', submitFormPostProcess)

  function submitFormPostProcess () {
    console.log('post process ' + RRWCUrl)
  }
})

// --------------- get querystring value ----------------------------
// this function gets the dotnum of the crossing the user was viewing from
// the url so that it can be used for query tasks in the report page
// -----------------------------------------------------------------------
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
// ----------------------------------------------------------------


// -------------------------------------------------------------------
// ----------------- Initialize ArcGIS Javascript API Functions -----------
// --------------------------------------------------------------------
require([
  "dojo/dom", "dojo/on",
  "esri/tasks/query", "esri/tasks/QueryTask",
  "esri/layers/FeatureLayer",
  "dojo/domReady!"
], function(dom, on, Query, QueryTask, FeatureLayer) {
  // ---------------------------------------------------------------------

  var FormNo = getParameterByName("FormNo");

  var RRWCUrl = "https://services1.arcgis.com/NXmBVyW5TaiCXqFs/ArcGIS/rest/services/Flaggging_Request_ALL/FeatureServer/0"

  // -------------------------------------------------------------------
  // ------------Set Query Parameters -------------------------------
  // -------------------------------------------------------------
  var queryTask = new QueryTask(RRWCUrl);

  var query = new Query();

  var outFields = [
    'AppDate',
    'CompName', 'WorkReason', 'BillAddress', 'BillTown', 'BillState', 'BillZIP',
    'CompType', 'AppName', 'AppPhone', 'AppEmail', 'WorkRR', 'WorkTown',
    'WorkFromMP', 'WorkToMP', 'WorkDuration', 'WorkStartDate', 'WorkDescription',
    'WorkEquipment', 'WorkCompletionDate', 'WorkAsset'
  ];

  query.returnGeometry = false; // do not need for report page
  query.outFields = outFields;

  query.where = "FormNo=" + FormNo;

  //execute query and then pass result into getPhotos func and initiate
  queryTask.execute(query, showResults);
  //-----------------------------------------------------

  function showResults(results) {
    var makeSpans = [];
    var resultItems = [];
    var resultCount = results.features.length;

    for (var fields in results.fields) {
      makeSpans.push('<strong>' + results.fields[fields].alias + ': </strong>' + '<span class="data" id="' + results.fields[fields].name + '"></span><br>');
    }
    dom.byId("full-info").innerHTML = makeSpans.join("");

    for (var i = 0; i < resultCount; i++) {
      var featureAttributes = results.features[i].attributes;
      for (var attr in featureAttributes) {
        var domInsert = [];
        if (featureAttributes[attr]) {
          if (attr.includes("Date")) {
            var d = new Date(featureAttributes[attr]);
            var n = document.querySelectorAll("#" + attr);
            for (var i = 0; i < n.length; i++) {
              n[i].innerHTML = d.format("dddd, mmmm dS, yyyy");
            }
          } else {
            resultItems.push("<strong>" + attr + ": </strong>" + featureAttributes[attr] + "</br>");
            var n = document.querySelectorAll("#" + attr);
            for (var i = 0; i < n.length; i++) {
              n[i].innerHTML = featureAttributes[attr];
            }
          }
        } else {
          for (var i = 0; i < n.length; i++) {
            var n = document.querySelectorAll("#" + attr);
            n[i].innerHTML = "<em> not specified </em>";
          }
        }
      }
    }
    // dom.byId("head-info").innerHTML = resultItems.join("");
    // dom.byId("info").innerHTML = resultItems.join("");
  }

});

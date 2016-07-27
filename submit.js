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

  // fetch values from the form
  // set today's date

  var agentName = document.getElementById('agentName').value
  var agmtNum = document.getElementById('agmtNum').value
  var comments = document.getElementById('comments').value
  var approveDate = new Date().format('m/dd/yy')

  // submit data to REST endpoint
}

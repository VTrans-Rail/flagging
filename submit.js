// -------------------------------------------------------
// Tool for gathering data from the form
// calculating some new values
// passing them back into the featureclass
// and kicking off the email submit process
// -------------------------------------------------------

// verify that the form is filled out

function submit (decision) {
  var formFields = document.getElementsByClassName('form-control')

  for (var i = 0; i < formFields.length; i++) {
    if (formFields[i].value) {
      continue
    } else {
      formFields[i].parentElement.className += ' has-error has-feedback'
      document.getElementById('incomplete').style.display = 'block'
    }
  }

  // fetch values from the form

  document.getElementById('agmtNum')
}

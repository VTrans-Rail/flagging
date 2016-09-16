function sendEmail (emailSubmission) {
    // parameters: service_id, template_id, template_parameters
  console.log('email test sent')
  document.getElementById('emailSuccess').style.display = 'block'
  var btns = document.getElementsByClassName('btn')
  for (var i = 0; i < btns.length; i++) {
    btns[i].setAttribute('disabled', 'disabled')
  }
  try {
    emailjs.send('sendgrid', 'vrs', emailSubmission)
    .then(function (response) {
      console.log('successful email')
    }, function (err) {
      console.error('failed - error = ', err)
      document.getElementById('emailFail').style.display = 'block'
    })
  } catch (e) {
    console.error(e)
  } finally {
    // TODO: show confirmation that the email was sent
  }
}

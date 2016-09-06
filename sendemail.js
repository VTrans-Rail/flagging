function sendEmail (emailSubmission) {
    // parameters: service_id, template_id, template_parameters
  console.log('email test sent')
  document.getElementById('emailSuccess').style.display = 'block'
  // try {
  //   emailjs.send('sendgrid', 'vrs', emailSubmission)
  //   .then(function (response) {
  //     console.log('successful email')
  //   }, function (err) {
  //     console.error('failed - error = ', err)
  //     document.getElementById('emailFail').style.display = 'block'
  //   })
  // } catch (e) {
  //   console.error(e)
  // } finally {
  //   // TODO: show confirmation that the email was sent
  // }
}

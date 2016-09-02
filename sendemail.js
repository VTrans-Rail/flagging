function sendEmail (emailSubmission) {
    // parameters: service_id, template_id, template_parameters
  try {
    emailjs.send('sendgrid', 'vrs', emailSubmission)
    .then(function (response) {
      console.log('successful email')
    }, function (err) {
      console.error('failed - error = ', err)
    })
  } catch (e) {
    console.error(e)
  } finally {

  }
}

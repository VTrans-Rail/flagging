function sendEmail (emailSubmission) {
    // parameters: service_id, template_id, template_parameters
  try {
    emailjs.send('sendgrid', 'vrs', emailSubmission)
  } catch (e) {
    console.error(e)
  } finally {

  }
}

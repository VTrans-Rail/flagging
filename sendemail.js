function sendEmail (emailSubmission) {
  // import json file options vis http://stackoverflow.com/questions/2177548/load-json-into-variable
  var json = (function () {
    var json = null
    $.ajax({
      'async': false,
      'global': false,
      'url': '../email_opts.json',
      'dataType': 'json',
      'success': function (data) {
        json = data
      }
    })
    return json
  })()

    // var emailSubmission = {
    //   to:
    //   from_name:
    //   from_email:
    //   reply_to:
    //   cc:
    //   bcc:
    //   subject:
    //   header:
    //   body:
    //   link:
    //   button:
    // };

  console.log('email test sent')
  // document.getElementById('emailSuccess').style.display = 'block'
  // var btns = document.getElementsByClassName('btn')
  // for (var i = 0; i < btns.length; i++) {
  //   btns[i].setAttribute('disabled', 'disabled')
  // }
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

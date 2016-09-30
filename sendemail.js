function sendEmail (emailFormParams) {
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

  var params = {} // object to pass to sending function

  if (emailFormParams.source === 'form' && emailFormParams.email_type === 'exception') {
    params = {
      to: emailFormParams.req_email,
      from_name: 'VTrans Rail Division',
      from_email: json.recipients.mark,
      reply_to: json.recipients.mark,
      cc: json.recipients.rpm,
      bcc: json.recipients.gis,
      subject: json.subject.user.test,
      header: json.header_text.user.error,
      body1: json.body_text.user.error.l1,
      body2: json.body_text.user.error.l2,
      body3: json.body_text.user.error.l3,
      link: json.link.base + json.link.form,
      button: json.button_text.user.resubmit
    }
    send(params)
  }
}

function send (params) {
  console.log(params)
  console.log('email test sent')

  // document.getElementById('emailSuccess').style.display = 'block'
  // var btns = document.getElementsByClassName('btn')
  // for (var i = 0; i < btns.length; i++) {
  //   btns[i].setAttribute('disabled', 'disabled')
  // }
  try {
    emailjs.send('sendgrid', 'email', params)
    .then(function (response) {
      console.log('successful email')
    }, function (err) {
      console.error('failed - error = ', err)
      // document.getElementById('emailFail').style.display = 'block'
    })
  } catch (e) {
    console.error(e)
  } finally {
    // TODO: show confirmation that the email was sent
  }
}

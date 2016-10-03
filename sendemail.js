function sendEmail (emailFormemails) {
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

  var formExceptionemails = {
    to: emailFormemails.req_email,
    from_name: 'VTrans Rail Division',
    from_email: json.recipients.mark,
    reply_to: json.recipients.mark,
    cc: json.recipients.rpm,
    bcc: json.recipients.gis + ', ' + json.recipients.rwa,
    subject: json.subject.user.test,
    header: json.header_text.user.error,
    body1: json.body_text.user.error.l1,
    body2: json.body_text.user.error.l2,
    body3: json.body_text.user.error.l3,
    link: json.link.base + json.link.form,
    button: json.button_text.user.resubmit
  }

  var formSuccessUseremails = {
    to: emailFormemails.req_email,
    from_name: 'VTrans Rail Division',
    from_email: json.recipients.mark,
    reply_to: json.recipients.mark,
    cc: null,
    bcc: json.recipients.gis + ', ' + json.recipients.rwa,
    subject: json.subject.user.test,
    header: json.header_text.user.success,
    body1: json.body_text.user.success,
    body2: null,
    body3: null,
    link: json.link.base + json.link.status + json.link.query + emailFormemails.form_number,
    button: json.button_text.user.status
  }

  var formSuccessRPMemails = {
    to: json.recipients.rpm,
    from_name: emailFormemails.req_name,
    from_email: emailFormemails.req_email,
    reply_to: emailFormemails.req_email,
    cc: null,
    bcc: json.recipients.gis + ', ' + json.recipients.rwa,
    subject: json.subject.user.test,
    header: json.header_text.approver.submitted,
    body1: json.body_text.approver.submitted,
    body2: null,
    body3: null,
    link: json.link.base + json.link.vtrans + json.link.query + emailFormemails.form_number,
    button: json.button_text.approver.review
  }

  var emails = [] // array of emails to send

  if (emailFormemails.source === 'form') {
    if (emailFormemails.email_type === 'success') {
      emails.push(formSuccessUseremails, formSuccessRPMemails)
    } else if (emailFormemails.email_type === 'exception') {
      emails.push(formExceptionemails)
    }
  }
  // else if (emailFormemails.source === 'vtrans') {
  //   if (decision === 'approved') {
  //
  //   } else if (decision === 'rejected') {
  //
  //   }
  // } else if (emailFormemails.source === 'vrs') {
  //   if (decision === 'approved') {
  //
  //   } else if (decision === 'rejected') {
  //
  //   }
  // }
  send(emails)

  function send (emails) {
    console.log(emails)
    console.log('email test sent')

    // document.getElementById('emailSuccess').style.display = 'block'
    // var btns = document.getElementsByClassName('btn')
    // for (var i = 0; i < btns.length; i++) {
    //   btns[i].setAttribute('disabled', 'disabled')
    // }
    try {
      for (var i = 0; i < emails.length; i++) {
        console.log(emails[i])
        emailjs.send('sendgrid', 'email', emails[i])
      .then(function (response) {
        console.log('successful email')
      }, function (err) {
        console.error('failed - error = ', err)
        // document.getElementById('emailFail').style.display = 'block'
      })
      }
    } catch (e) {
      console.error(e)
    } finally {
      // TODO: show confirmation that the email was sent
    }
  }
}

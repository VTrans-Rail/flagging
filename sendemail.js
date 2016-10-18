/* global $, emailjs */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "sendEmail" }] */
function sendEmail (emailFormemails) {
  // import json file options vis http://stackoverflow.com/questions/2177548/load-json-into-variable
  var json = (function () {
    var json = null
    $.ajax({
      'async': false,
      'global': false,
      // 'url': '/flagging/email_opts.json', // prod change me!
      'url': '/flagging/email_opts_dev.json', // prod dev!!! what
      // 'url': '/email_opts_dev.json', // dev
      'dataType': 'json',
      'success': function (data) {
        json = data
      }
    })
    return json
  })()

  var formExceptionemails = {
    to: emailFormemails.req_email,
    from_name: 'VTrans Rail Section',
    from_email: json.recipients.mark,
    reply_to: json.recipients.mark,
    cc: json.recipients.rpm,
    bcc: json.recipients.gis + ', ' + json.recipients.rwa,
    subject: json.subject.user.error,
    header: json.header_text.user.error + ' (Req # ' + emailFormemails.form_number + ')',
    user_name: emailFormemails.req_name,
    body1: json.body_text.user.error.l1,
    body2: json.body_text.user.error.l2,
    body3: json.body_text.user.error.l3,
    link: json.link.base + json.link.form,
    button: json.button_text.user.resubmit
  }

  var formSuccessUseremails = {
    to: emailFormemails.req_email,
    from_name: 'VTrans Rail Section',
    from_email: json.recipients.mark,
    reply_to: json.recipients.mark,
    cc: null,
    bcc: json.recipients.gis + ', ' + json.recipients.rwa,
    subject: json.subject.user.success,
    header: json.header_text.user.success + ' (Req # ' + emailFormemails.form_number + ')',
    user_name: emailFormemails.req_name,
    body1: json.body_text.user.success,
    body2: null,
    body3: null,
    link: json.link.base + json.link.status + json.link.query + emailFormemails.form_id,
    button: json.button_text.user.status
  }

  var formSuccessRPMemails = {
    to: json.recipients.rpm,
    from_name: emailFormemails.req_name,
    from_email: emailFormemails.req_email,
    reply_to: emailFormemails.req_email,
    cc: null,
    bcc: json.recipients.gis + ', ' + json.recipients.rwa,
    subject: json.subject.approver.submitted,
    header: json.header_text.approver.submitted + ' (Req # ' + emailFormemails.form_number + ')',
    user_name: 'Rail Property Management Team',
    body1: json.body_text.approver.submitted,
    body2: null,
    body3: null,
    link: json.link.base + json.link.vtrans + json.link.query + emailFormemails.form_id,
    button: json.button_text.approver.review
  }

  var vtransApprovedemails = {
    to: json.recipients.vrs,
    from_name: 'VTrans Rail Section',
    from_email: json.recipients.mark,
    reply_to: json.recipients.mark,
    cc: json.recipients.rpm,
    bcc: json.recipients.gis + ', ' + json.recipients.rwa,
    subject: json.subject.approver.approved,
    header: json.header_text.approver.vtrans_approved + ' (Req # ' + emailFormemails.form_number + ')',
    user_name: 'Vermont Rail Systems',
    body1: json.body_text.approver.vtrans_approved,
    body2: null,
    body3: null,
    link: json.link.base + json.link.vrs + json.link.query + emailFormemails.form_id,
    button: json.button_text.approver.review
  }

  var vtransRejectedemails = {
    to: emailFormemails.req_email,
    from_name: 'VTrans Rail Section',
    from_email: json.recipients.mark,
    reply_to: json.recipients.mark,
    cc: json.recipients.rpm,
    bcc: json.recipients.gis + ', ' + json.recipients.rwa,
    subject: json.subject.user.rejected,
    header: json.header_text.user.rejected + ' (Req # ' + emailFormemails.form_number + ')',
    user_name: emailFormemails.req_name,
    body1: json.body_text.user.rejected.l1,
    body2: json.body_text.user.rejected.l2,
    body3: json.body_text.user.rejected.l3,
    link: json.link.base + json.link.form,
    button: json.button_text.user.resubmit
  }

  var vrsApprovedemails = {
    to: emailFormemails.req_email,
    from_name: 'VTrans Rail Section',
    from_email: json.recipients.mark,
    reply_to: json.recipients.mark,
    cc: json.recipients.rpm + ',' + json.recipients.vrs,
    bcc: json.recipients.gis + ', ' + json.recipients.rwa,
    subject: json.subject.user.approved,
    header: json.header_text.user.approved + ' (Req # ' + emailFormemails.form_number + ')',
    user_name: emailFormemails.req_name,
    body1: json.body_text.user.approved,
    body2: null,
    body3: null,
    link: json.link.base + json.link.status + json.link.query + emailFormemails.form_id,
    button: json.button_text.user.approved
  }

  // var vrsRejectedemails = {
  //   to: emailFormemails.req_email,
  //   from_name: 'VTrans Rail Section',
  //   from_email: json.recipients.mark,
  //   reply_to: json.recipients.mark,
  //   cc: json.recipients.rpm,
  //   bcc: json.recipients.gis + ', ' + json.recipients.rwa,
  //   subject: json.subject.user.test,
  //   header: json.header_text.user.rejected + ' (Req # ' + emailFormemails.form_number + ')',
  //   user_name: emailFormemails.req_name,
  //   body1: json.body_text.user.rejected.l1,
  //   body2: json.body_text.user.rejected.l2,
  //   body3: json.body_text.user.rejected.l3,
  //   link: json.link.base + json.link.form,
  //   button: json.button_text.user.resubmit
  // }

  var emails = [] // array of emails to send

  if (emailFormemails.source === 'form') {
    if (emailFormemails.email_type === 'success') {
      emails.push(formSuccessUseremails, formSuccessRPMemails)
    } else if (emailFormemails.email_type === 'exception') {
      emails.push(formExceptionemails)
    }
  } else if (emailFormemails.source === 'vtrans') {
    if (emailFormemails.email_type === 'Approve') {
      emails.push(vtransApprovedemails)
    } else if (emailFormemails.email_type === 'Reject') {
      emails.push(vtransRejectedemails)
    }
  } else if (emailFormemails.source === 'vrs') {
    if (emailFormemails.email_type === 'Approve') {
      emails.push(vrsApprovedemails)
    } else if (emailFormemails.email_type === 'Reject') {
      emails.push(vtransRejectedemails)
    }
  }
  send(emails)

  function send (emails) {
    console.log('emails')
    // document.getElementById('emailSuccess').style.display = 'block'
    // var btns = document.getElementsByClassName('btn')
    // for (var i = 0; i < btns.length; i++) {
    //   btns[i].setAttribute('disabled', 'disabled')
    // }
    // try {
    //   for (var i = 0; i < emails.length; i++) {
    //     emailjs.send('sendgrid', 'email', emails[i])
    //   .then(function (response) {
    //     console.log('successful email' + response)
    //   }, function (err) {
    //     console.error('failed - error = ', err)
    //     // document.getElementById('emailFail').style.display = 'block'
    //   })
    //   }
    // } catch (e) {
    //   console.error(e)
    // }
  }
}

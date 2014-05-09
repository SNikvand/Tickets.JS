

exports.emailclient = function emailclient(title, description, clientEmail) {

    var nodemailer = require("nodemailer");
    var smtpTransport = nodemailer.createTransport("SMTP", {
        host: "srv53.hosting24.com",
        secureConnection: true,
        port: 465,
        auth: {
            user: "support@sudolite.com",
            pass: "UTw1LkXcpOMII0T"
        }
    });

    var mailOptions = {
        from: "Support ? <support@sudolite.com>", // sender address
        to: "" + clientEmail, // list of receivers
        subject: "Submitted Ticket", // Subject line
        text: "", // plaintext body
        html: "<b>Your submitted Ticket <br> Title:  </b>" +title + "<br> <b>description:</b> " + description // html body
    }
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
    });

}

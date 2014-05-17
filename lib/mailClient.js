/*

 created by Chris Jensen
 */
//email function that takes in and sends data through predefined email host
exports.emailclient = function emailclient(title, description, clientEmail, hash) {

    var nodemailer = require("nodemailer");
    // setup of host with username and password
    // password in plain text as this file is intended for the server side
    var smtpTransport = nodemailer.createTransport("SMTP", {
        host: "srv53.hosting24.com",
        secureConnection: true,
        port: 465,
        auth: {
            user: "support@sudolite.com",  //username of host
            pass: "UTw1LkXcpOMII0T"        //password that goes with the host
        }
    });

    // sets up the email format and inputs the desired data sent in to the function
    var mailOptions = {
        from: "IT Support  <support@sudolite.com>", // sender address
        to: "" + clientEmail, // list of receivers
        subject: "Submitted Ticket", // Subject line
        text: "", // plaintext body
        html: "<b>Your submitted Ticket <br> Title:  </b>" +title + "<br> <b>description:</b> " + description + "<br><b>URL to view ticket: </b> localhost:3000/client#/viewticket/ticket/" + hash  // html body
    }
    //takes the constructed mail and sends it out. Also checks for error when sending.
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
    });

}

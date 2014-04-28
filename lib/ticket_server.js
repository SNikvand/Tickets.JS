var socketio = require('socket.io');
var io;

exports.listen = function(server) {
    io = socketio.listen(server);
    io.sockets.on('connection', function(socket) {
        handleSetTicket(socket);
        handleGetTicket(socket);
        handleGetTickets(socket);
    });
};

/*
    purpose: this is called when either a client submits a new ticket, or an admin/manager
    edits a ticket. if 'id' is not null, then this is a new ticket.

    author: Matthew Chan

    date: 04/28/2014
 */
function handleSetTicket(socket) {
    socket.on('setTicket', function(id_md5, user, dept, priority, email, title, desc) {
        if (id_md5 == null) {
            // this is a new ticket

            // call database function to store parameters into new ticket

            var newid = ''; // a new md5 id has to be randomly generated here
            socket.emit('newTicket', newid); // lets the client know that a new ticket has been created
        } else {
            // this is an existing ticket

            // ERROR HANDLING: check if ticket exists in database
            /* if (checkTicketExists(id_md5) == false) {
                   break from this function, and do nothing
               }
            */

            // call database function to store parameters into existing ticket
        }
    });
}

/*
    purpose: this is called when a specific ticket is requested from the database for
    viewing by the client (for admin, manager or IT user).

    author: Matthew Chan

    date: 04/28/2014
 */
function handleGetTicket(socket) {
    socket.on('getTicket', function(id_md5) {
        // ERROR HANDLING: check if ticket exists in database
        /* if (checkTicketExists(id_md5) == false) {
               break from this function, and do nothing
           }
        */

        // call database function to retrieve data for the ticket marked 'id_md5'

        socket.emit('displayTicket', user, dept, priority, email, title, desc);
    });
}
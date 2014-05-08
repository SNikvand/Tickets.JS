var socketio = require( 'socket.io' );
var pg = require( 'pg' );
var config = require( './config' );
var md5 = require( 'MD5' );
var io;
var dbConfig = config.db;

exports.listen = function ( server ) {
  io = socketio.listen( server );
  io.sockets.on( 'connection', function ( socket ) {
    handleSetTicket( socket );
    handleGetTicket( socket );
    handleGetTickets( socket );

    handleSetUser( socket );
    handleGetUser( socket );
    handleGetUsers( socket );

    handleSetDept( socket );
    handleGetDepts( socket );

    handleSetReply( socket );
    handleGetReplies( socket );
  } );
};

/**
 purpose: called when either a client submits a new ticket, or an admin/manager
 edits a ticket. if 'id' is null, then this is a new ticket.

 @author Matthew Chan
 @date 04/29/2014

 Edit: John Welker
 Date: 05/05/2014
 */
function handleSetTicket( socket ) {
  socket.on( 'setTicket', function ( id, title, dept, description, priority, submittedBy, clientEmail, assignedTo, alteredBy, dateCreated, dateDue, dateAltered, dateCompleted, isArchive ) {
    // conversions from string to id
    if ( alteredBy != null ) {
      alteredBy = getUserId( alteredBy );
    }
    if ( assignedTo != null ) {
      assignedTo = getUserId( assignedTo );
    }
    if ( dept != null ) {
      dept = getDeptId( dept );
    }

    if ( id == null ) {
      // DATABASE FUNCTION: store parameters into new ticket
      // dateCreated and dateDue are automatically generated
      // assignedTo, alteredBy, dateAltered and dateCompleted are null

      // Database Connection
      pg.connect( dbConfig, function ( err, client, done ) {
        if ( err ) {
          return console.error( 'error fetching client from pool', err );
        }

        // Gets a string to use to query the database to get the highest id number
        var q = getMaxIdQuery();

        // query the database
        client.query( q, function ( err, result ) {
          // return the client to the pool
          done();
          if ( err ) {
            return console.error( 'error running query', err );
          }
          var hash = md5( result.rows[0].id + 1 );
          // set up jSON object
          var jTicket = { id : id, hash : hash, title : title, author : submittedBy, email : clientEmail, department : dept, description : description, level : priority };
          // create new ticket
          newTicket( socket, jTicket );
        } );
      } );

      // var newid = ''; // a new md5 id to be retrieved from the database
      // socket.emit( 'newTicket', newid ); // lets the client know that a new ticket has been created
    } else {
      // this is an existing ticket

      // ERROR HANDLING: check if ticket exists in database
      /* if (checkTicketExists(ticketId) == false) {
       break from this function, and do nothing
       }
       */
      // DATABASE FUNCTION: store parameters into existing ticket
      // dateAltered is automatically generated
      // submittedBy, clientEmail, and dateCreated are unchanged
      var rows;
      pg.connect( dbConfig, function ( err, client, done ) {
        if ( err ) {
          return console.error( 'error fetching client from pool', err );
        }

        // database query check that there is a row with that hash
        var query = "SELECT id FROM tickets WHERE hash='" + id + "';";
        client.query( query, function ( err, result ) {
          done();
          if ( err ) {
            return console.error( 'error running query', err );
          }

          // if there are no matching rows, error handle
          if ( result.rowCount() == 0 ) {
            return console.error( 'No rows with that hash' );
          }

          // get the id from the results
          var resultId = result.rows[0].id;

          /* json object representing a ticket
           { id, hash, title, author, email, department, description, level }
           * { id, level, altered_by, assigned_to, due_date, complete[true/false] }*/
          // ( id, title, dept, description, priority, submittedBy, clientEmail, assignedTo, alteredBy, dateCreated, dateDue, dateAltered, dateCompleted
          var ticket = { id : resultId, level : priority, altered_by : alteredBy, assigned_to : assignedTo, due_date : dateDue  };
          if ( dateCompleted != null ) {
            ticket.complete = true;
          }
          modifyTicket( ticket, isArchive );

        } );
      } );
    }
  } );
}

/*
 purpose: called when a specific ticket is requested from the database for
 viewing by the client (for admin, manager or IT user).

 author: Matthew Chan

 date: 04/28/2014
 */
function handleGetTicket( socket ) {
  socket.on( 'getTicket', function ( id, isArchive ) {
    pg.connect( dbConfig, function ( err, client, done ) {
      if ( err ) {
        return console.error( 'error fetching client from pool', err );
      }

      var table = (isArchive == true ? "tickets_archive" : "tickets");

      var query = "SELECT t.hash, t.title, t.author, t.author_email, t.create_date, d.name AS department, t.description" +
        " t.priority, t.due_date, a.name AS assigned_to, t.altered_date, b.name AS altered_by, t.complete_date from " + table + " t JOIN" +
        " departments d ON (t.department = d.id) JOIN users a ON (t.altered_by = a.id) JOIN users b ON" +
        " (t.assigned_to = b.id) WHERE hash = '" + id + "';";

      client.query( query, function ( err, result ) {
        done();
        if ( err ) {
          return console.error( 'error running query', err );
        }

        // if there are no matching rows, error handle
        if ( result.rowCount() == 0 ) {
          return console.error( 'No rows with that hash' );
        }

        socket.emit( 'displayTicket', result.rows[0].title, result.rows[0].department, result.rows[0].description,
          result.rows[0].priority, result.rows[0].author, result.rows[0].author_email, result.rows[0].assigned_to,
          result.rows[0].altered_by, result.rows[0].create_date, result.rows[0].due_date, result.rows[0].altered_date,
          result.rows[0].complete_date
        );
      } );
    } );
  } );
}

/*
 purpose: when the client requests a list of tickets to display, this function
 factors in the selected filtering options and search parameters to retrieve
 and return the desired rows from the database.

 author: Matthew Chan

 date: 04/29/2014
 */
function handleGetTickets( socket ) {
  socket.on( 'getTicketsAdmin1', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, amount, socket, "admin1" )
  } );
  socket.on( 'getTicketsAdmin2', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, amount, socket, "admin2" )
  } );
  socket.on( 'getTicketsAdmin3', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, amount, socket, "admin3" )
  } );

  socket.on( 'getTicketsManager1', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, amount, socket, "manager1" )
  } );
  socket.on( 'getTicketsManager2', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, amount, socket, "manager2" )
  } );
  socket.on( 'getTicketsManager3', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, amount, socket, "manager3" )
  } );

  socket.on( 'getTicketsITUser1', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, amount, socket, "ituser1" )
  } );
  socket.on( 'getTicketsITUser2', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, amount, socket, "ituser2" )
  } );
  socket.on( 'getTicketsITUser3', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, amount, socket, "ituser3" )
  } );

  socket.on( 'getTicketsView', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, amount, socket, "view" )
  } );
}

function emitTicketList( filters, searchParams, includeCompleted, includeExpired, amount, socket, type ) {
  if ( filters.length < 1 ) {
    console.log( 'error: invalid filter parameters' );
  } else {
    // can't request only completed tickets and include expired tickets in the query
    // by definition, completed tickets cannot be expired
    // vice versa
    if ( includeCompleted == "only" ) {
      includeExpired = "exclude";
    } else if ( includeExpired == "only" ) {
      includeCompleted = "exclude";
    }

    // DATABASE FUNCTION: get list of tickets based on filter options/search params
    // var ticketList = getTickets(filters, searchParams, includeExpired);
    // also sends back md5-hashed ticket ids (to use in retrieval of individual tickets)

    // placeholder data to be sent
    var ticketList = [
      {id           : 1, title : "Test Ticket 1", dept : "Finance", priority : 5, assignedTo : "Mike",
        dateCreated : "04/30/2014, 12:31 pm", dateAltered : null},
      {id           : 2, title : "Test Ticket 2", dept : "Records", priority : 4, assignedTo : "Willow",
        dateCreated : "04/28/2014, 11:22 am", dateAltered : "04/29/2014, 3:00 pm"},
      {id           : 3, title : "Test Ticket 3", dept : "Sales & Marketing", priority : 3, assignedTo : "Jesus",
        dateCreated : "04/26/2014, 8:14 am", dateAltered : "04/27/2014, 1:23 pm"},
      {id           : 4, title : "Test Ticket 4", dept : "Technical Support", priority : 2, assignedTo : "Katy",
        dateCreated : "04/25/2014, 5:44 pm", dateAltered : null},
      {id           : 5, title : "Test Ticket 5", dept : "Management", priority : 1, assignedTo : "Nathan",
        dateCreated : "04/30/2014, 6:17 pm", dateAltered : null}
    ]

    switch ( type ) {
      case "admin1":
        socket.emit( 'displayTicketsAdmin1', ticketList );
        break;
      case "admin2":
        socket.emit( 'displayTicketsAdmin2', ticketList );
        break;
      case "admin3":
        socket.emit( 'displayTicketsAdmin3', ticketList );
        break;
      case "manager1":
        socket.emit( 'displayTicketsManager1', ticketList );
        break;
      case "manager2":
        socket.emit( 'displayTicketsManager2', ticketList );
        break;
      case "manager3":
        socket.emit( 'displayTicketsManager3', ticketList );
        break;
      case "ituser1":
        socket.emit( 'displayTicketsITUser1', ticketList );
        break;
      case "ituser2":
        socket.emit( 'displayTicketsITUser2', ticketList );
        break;
      case "ituser3":
        socket.emit( 'displayTicketsITUser3', ticketList );
        break;
      case "view":
        socket.emit( 'displayTicketsView', ticketList );
        break;
      default:
        console.log( "error: no 'get tickets' message type specified" );
    }
  }
  if ( filters.assignedTo != null ) {
    filters.assignedTo = getUserId( filters.assignedTo );
  }
  if ( filters.dept != null ) {
    filters.dept = getDeptId( filters.dept );
  }

  if ( filters.length < 1 ) {
    console.log( 'error: invalid filter parameters' );
  } else {
    if ( includeCompleted == "onlyCompleted" ) {
      includeExpired = "excludeExpired";
    } else if ( includeExpired == "onlyExpired" ) {
      includeCompleted = "excludeCompleted";
      includeArchived = "excludeArchived";
    } else if ( includeArchived == "onlyArchived" ) {
      includeExpired = "excludeExpired";
    }

    pg.connect( dbConfig, function ( err, client, done ) {
      if ( err ) {
        return console.error( 'error fetching client from pool', err );
      }

      if ( includeArchived != "onlyArchived" ) {
        var query1 = searchForTicketsQuery( "tickets", filters, searchParams, includeCompleted, includeExpired, amount );
        client.query( query1, function ( err, result ) {
          done();
          if ( err ) {
            return console.error( 'error running query', err );
          }

          for ( var i = 0; i < result.rows.length; i++ ) {
            result.rows[i].isArchive = false;
          }

          ticketList.push.apply( ticketList, result.rows );
        } );
      }
      if ( includeArchived != "excludeArchived" ) {
        var query2 = searchForTicketsQuery( "tickets_archive", filters, searchParams, includeCompleted, includeExpired, amount );
        client.query( query2, function ( err, result ) {
          done();
          if ( err ) {
            return console.error( 'error running query', err );
          }

          for ( var i = 0; i < result.rows.length; i++ ) {
            result.rows[i].isArchive = true;
          }

          ticketList.push.apply( ticketList, result.rows );
        } );
      }

      switch ( type ) {
        case "admin1":
          socket.emit( 'displayTicketsAdmin1', ticketList );
          break;
        case "admin2":
          socket.emit( 'displayTicketsAdmin2', ticketList );
          break;
        case "admin3":
          socket.emit( 'displayTicketsAdmin3', ticketList );
          break;
        case "manager1":
          socket.emit( 'displayTicketsManager1', ticketList );
          break;
        case "manager2":
          socket.emit( 'displayTicketsManager2', ticketList );
          break;
        case "manager3":
          socket.emit( 'displayTicketsManager3', ticketList );
          break;
        case "ituser1":
          socket.emit( 'displayTicketsITUser1', ticketList );
          break;
        case "ituser2":
          socket.emit( 'displayTicketsITUser2', ticketList );
          break;
        case "ituser3":
          socket.emit( 'displayTicketsITUser3', ticketList );
          break;
        case "view":
          socket.emit( 'displayTicketsView', ticketList );
          break;
        default:
          console.log( "error: no 'get tickets' message type specified" );
      }
    } );

    // placeholder data to be sent
    /*var ticketList = [
     {title        : "Test Ticket 1", dept : "Finance", priority : 5, assignedTo : "Mike",
     dateCreated : "04/30/2014, 12:31 pm", dateAltered : null},
     {title        : "Test Ticket 2", dept : "Records", priority : 4, assignedTo : "Willow",
     dateCreated : "04/28/2014, 11:22 am", dateAltered : "04/29/2014, 3:00 pm"},
     {title        : "Test Ticket 3", dept : "Sales & Marketing", priority : 3, assignedTo : "Jesus",
     dateCreated : "04/26/2014, 8:14 am", dateAltered : "04/27/2014, 1:23 pm"},
     {title        : "Test Ticket 4", dept : "Technical Support", priority : 2, assignedTo : "Katy",
     dateCreated : "04/25/2014, 5:44 pm", dateAltered : null},
     {title        : "Test Ticket 5", dept : "Management", priority : 1, assignedTo : "Nathan",
     dateCreated : "04/30/2014, 6:17 pm", dateAltered : null}
     ];*/
  }
}
/*
 purpose: sorts a json object of tickets based on given parameters, then emits the sorted
 list back to the client through the "displayTickets" message

 EDIT: should be moved to client side instead, because client side should do the sorting.

 author: Matthew Chan

 date: 04/29/2014
 */
/*
 function handleSortTickets(socket) {
 socket.on('sortTickets', function(ticketList, type, order) {
 if (type == "user" || type == "dept" || type == "email" || type == "title") {
 ticketList.sort(function (a, b) {
 if (order == "ascending") {
 if (a[type] < b[type])
 return -1;
 if (a[type] > b[type])
 return 1;
 return 0;
 } else if (order == "descending") {
 if (b[type] < a[type])
 return -1;
 if (b[type] > a[type])
 return 1;
 return 0;
 }
 });
 } else if (type == "priority") {
 ticketList.sort(function (a, b) {
 if (order == "ascending") {
 return a[type] - b[type];
 } else if (order == "descending") {
 return b[type] - a[type];
 }
 });
 } else if (type == "date") {
 // handle sorting date
 } else {
 console.log("error: invalid sort type");
 }

 socket.emit('displayTickets', ticketList);
 });
 }
 */
/*
 purpose: called when the admin edits or makes a new user with a particular role
 and password.

 author: Matthew Chan

 date: 04/29/2014
 */
function handleSetUser( socket ) {
  socket.on( 'setUser', function ( id, name, email, pass, role ) {
    pg.connect( dbConfig, function ( err, client, done ) {
      if ( err ) {
        return console.error( 'error connecting to the database', err );
      }

      if ( id == null ) {
        // new user

        // check if user already exists
        var testquery1 = "SELECT * FROM users WHERE name = '" + name + "';";
        client.query( testquery1, function ( err, result ) {
          done();
          if ( err ) {
            return console.error( 'error running query', err );
          }
          if ( result.rowCount() > 0 ) {
            return console.error( "A user already exists by that name" );
          }
        } );

        var testquery2 = "SELECT * FROM users WHERE email = '" + email + "';";
        client.query( testquery2, function ( err, result ) {
          done();
          if ( err ) {
            return console.error( 'error running query', err );
          }
          if ( result.rowCount() > 0 ) {
            return console.error( "That email address is already in use" );
          }
        } );

        var jUser = {id : id, name : name, email : email, pass : md5( pass ), role : role};
        var query = newUserQuery( jUser );

        client.query( query, function ( err, result ) {
          // return the client to the pool
          done();
          if ( err ) {
            console.error( 'Error querying database', err );
          }

        } );

      } else {
        // modify user

        var testquery = "SELECT id FROM users WHERE id = '" + id + "';";
        client.query( testquery, function ( err, result ) {
          // return the client to the pool
          done();
          if ( err ) {
            return console.error( 'error querying database', err );
          }

          // if there are no matching rows, error handle
          if ( result.rowCount() == 0 ) {
            return console.error( 'No rows with that hash' );
          }

          var jUser = {id : id, name : name, email : email, pass : md5( pass ), role : role};
          var query = modifyUserQuery( jUser );

          client.query( query, function ( err, result ) {
            // return the client to the pool
            done();
            if ( err ) {
              console.error( 'Error querying database', err );
            }

          } )
        } );
      }
    } );
  } );
}

/*
 purpose: called when a specific user is requested from the database for viewing by
 the client (for admins only).

 author: Matthew Chan

 date: 04/29/2014
 */
function handleGetUser( socket ) {
  socket.on( 'getUser', function ( id ) {
    pg.connect( dbConfig, function ( err, client, done ) {
      if ( err ) {
        return console.error( 'error fetching client from pool', err );
      }

      var query = "SELECT * FROM users WHERE id = " + id + ";";

      client.query( query, function ( err, result ) {
        done();
        if ( err ) {
          return console.error( 'error running query', err );
        }

        // if there are no matching rows, error handle
        if ( result.rowCount() == 0 ) {
          return console.error( 'No users exist with that id' );
        }

        socket.emit( 'displayUser', result.rows[0].name, result.rows[0].email, result.rows[0].password, result.rows[0].type );
      } );
    } );
  } );
}

/*
 purpose: called when the admin requests a list of users of a particular role to
 be displayed.

 author: Matthew Chan

 date: 04/29/2014
 */
function handleGetUsers( socket ) {
  socket.on( 'getUsers', function ( role ) {
    // DATABASE FUNCTION: get list of users based on role
    // var userList = getUsers(role);
    // if role is null, get all users
    // also sends back user ids to use in requesting individual user data

    pg.connect( dbConfig, function ( err, client, done ) {
      if ( err ) {
        return console.error( 'error fetching client from pool', err );
      }

      var query = "SELECT * FROM users";

      if ( role != null ) {
        query += " WHERE role = '" + role + "';";
      } else {
        query += ";";
      }

      client.query( query, function ( err, result ) {
        done();
        if ( err ) {
          return console.error( 'error running query', err );
        }
        socket.emit( 'displayUsers', result );
      } );
    } );
  } );
}

function handleSetDept( socket ) {
  socket.on( 'setDept', function ( deptid, deptname, usernames ) {
    if ( deptid == null ) {
      // new department

      var testquery1 = "SELECT * FROM departments WHERE name = '" + deptname + "';";
      client.query( testquery1, function ( err, result ) {
        done();
        if ( err ) {
          return console.error( 'error running query', err );
        }
        if ( result.rowCount() > 0 ) {
          return console.error( "A department already exists by that name" );
        }
      } );

      var query1 = "INSERT INTO departments (name) VALUES ( '" + deptname + "' );";
      client.query( query1, function ( err, result ) {
        done();
        if ( err ) {
          return console.error( 'error running query', err );
        }
      } );
    } else {
      // modifying existing department

      var testquery2 = "SELECT * FROM departments WHERE name = '" + deptname + "';";
      client.query( testquery2, function ( err, result ) {
        done();
        if ( err ) {
          return console.error( 'error running query', err );
        }
        if ( result.rowCount() == 0 ) {
          return console.error( "Department by that name does not exist" );
        }
      } );

      var query2 = "UPDATE departments SET name = '" + deptname + "' WHERE id = '" + deptid + "';";
      client.query( query2, function ( err, result ) {
        if ( err ) {
          return console.error( 'error running query', err );
        }
      } );
    }

    // assign users to departments, if usernames provided
    if ( usernames != null ) {
      var userArray = usernames.split( " " );

      for ( var u in userArray ) {
        var userid = getUserId( userArray[u] );
        var testquery3 = "SELECT * FROM users a JOIN user_dept b ON (b.user_id = a.id) WHERE a.id = " + userid + " AND (a.type = 'Manager' OR" +
          " b.dept_id != " + deptid + ";";
        client.query( testquery3, function ( err, result ) {
          done();
          if ( err ) {
            return console.error( 'error running query', err );
          }
          if ( result.rowCount() == 0 ) {
            return console.error( "User does not exist or have manager-level permission, or already is assigned to the department" );
          }
        } );

        var query3 = newUserDeptQuery( deptid, userid );
        client.query( query3, function ( err, result ) {
          done();
          if ( err ) {
            return console.error( 'error running query', err );
          }
        } );
      }
    }
  } );
}

function handleGetDepts( socket ) {
  socket.on( 'getDepts', function () {
    // DATABASE FUNCTION: return an array of all department names and supervisors
    // var deptList = getDepts();

    var query = getUserDepts();
    client.query( query, function ( err, result ) {
      done();
      if ( err ) {
        return console.error( 'error running query', err );
      }
      socket.emit( 'displayDepts', result );
    } );
  } );
}

/*
 purpose: called when a user posts a reply to a ticket

 author: Matthew Chan

 date: 04/29/2014
 */
function handleSetReply( socket ) {
  socket.on( 'setReply', function ( replyid, ticketid, user, desc ) {
    // possible want: to make it so that users can edit their own replies
    // not a necessity right now
    // if "replyid" is null, make a new reply, otherwise ...

    // ERROR HANDLING: check if ticket exists in database
    /* if (checkTicketExists(ticketid) == false) {
     break from this function, and do nothing
     }
     */

    // DATABASE FUNCTION: store parameters into new reply

    socket.emit( 'newReply', ticketid, desc, user );
  } );
}

/*
 purpose: called when the ticket page loads and all replies for that ticket are
 pulled from the database, then sent to client to be displayed

 author: Matthew Chan

 date: 04/29/2014
 */
function handleGetReplies( socket ) {
  socket.on( 'getReplies', function ( ticketid ) {
    // ERROR HANDLING: check if ticket exists in database
    /* if (checkTicketExists(ticketid) == false) {
     break from this function, and do nothing
     }
     */

    // DATABASE FUNCTION: get an array of all replies for this particular ticket
    // marked "ticketid", in descending order by datetime
    // var replyList = getReplies(ticketid)

    socket.emit( 'displayReplies', replyList );
  } );
}

/**
 * Purpose: queries the datatbase to add a new ticket.
 * @param socket socket to send the hash of the new ticket to.
 * @param jTicket json object ticket information
 * @author John Welker
 * @date 05/05/2014
 */

function newTicket( socket, jTicket ) {
  // construct the database query
  var query = newTicketQuery( jTicket );
  // connect to the database
  pg.connect( dbConfig, function ( err, client, done ) {
    if ( err ) {
      return console.error( 'error fetching client from pool', err );
    }
    // query the database to modify a ticket
    client.query( query, function ( err, result ) {
      // return the client to the pool
      done();
      if ( err ) {
        return console.error( 'error running query', err );
      }
      // log the result hash
      console.log( result.rows[0].hash );

      socket.emit( 'newTicket', result.rows[0].hash ); // lets the client know that a new ticket has been created
    } );
  } );
}


/**
 * Purpose: update a ticket in the database
 * @param jTicket json object representing a ticket
 * @author John Welker
 * @date 06/05/2014
 * @version 0.1
 */
function modifyTicket( jTicket, isArchive ) {
  // get a query string to modify the database based on the jTicket
  var q = modifyTicketQuery( jTicket, isArchive );

  // grab a client from the connection pool
  pg.connect( dbConfig, function ( err, client, done ) {
    if ( err ) {
      return console.error( 'error fetching client from pool', err );
    }
    // query the database to modify the ticket
    client.query( q, function ( err, result ) {
      // return the client to the pool
      done();
      if ( err ) {
        return console.error( 'error running query', err );
      }
      // log the hash of the updated ticket
      console.log( result.rows[0].hash );
    } );
  } );
}

// helper functions to return ids based on strings //

function getUserId( username ) {
  // get userid based on username from users table
  var userquery = "SELECT id FROM users WHERE name = '" + username + "';";
  client.query( userquery, function ( err, result ) {
    done();
    if ( err ) {
      return console.error( 'error running query', err );
    }
    if ( result.rowCount() == 0 ) {
      return console.error( "No user exists by that name" );
    }

    return result.rows[0].id;
  } );
}

function getDeptId( deptname ) {
  // get userid based on username from users table
  var userquery = "SELECT id FROM departments WHERE name = '" + deptname + "';";
  client.query( userquery, function ( err, result ) {
    done();
    if ( err ) {
      return console.error( 'error running query', err );
    }
    if ( result.rowCount() == 0 ) {
      return console.error( "No department exists by that name" );
    }

    return result.rows[0].id;
  } );
}


var socketio = require( 'socket.io' );
var pg = require( 'pg' );
var config = require( './config' );
var dbhelper = require( './database' );
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
    var queries = [ dbhelper.getUserId(assignedTo), dbhelper.getUserId(alteredBy), dbhelper.getDeptId(dept) ];

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
        var q = dbhelper.getMaxIdQuery();

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
          if ( result.rows.length() == 0 ) {
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


/**
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

      var query = "SELECT t.hash, t.title, t.author, t.author_email, t.create_date, d.name AS department, t.description," +
        " t.priority, t.due_date, a.name AS assigned_to, t.altered_date, b.name AS altered_by, t.complete_date from " + table + " t JOIN" +
        " departments d ON (t.department = d.id) JOIN users a ON (t.altered_by = a.id) JOIN users b ON" +
        " (t.assigned_to = b.id) WHERE hash = '" + id + "';";

      client.query( query, function ( err, result ) {
        done();
        if ( err ) {
          return console.error( 'error running query', err );
        }

        // if there are no matching rows, error handle
        if ( result.rows.length() == 0 ) {
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


/**
 purpose: when the client requests a list of tickets to display, this function
 factors in the selected filtering options and search parameters to retrieve
 and return the desired rows from the database.

 author: Matthew Chan

 date: 04/29/2014
 */
function handleGetTickets( socket ) {
  socket.on( 'getTicketsAdmin1', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "admin1" )
  } );
  socket.on( 'getTicketsAdmin2', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "admin2" )
  } );
  socket.on( 'getTicketsAdmin3', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "admin3" )
  } );

  socket.on( 'getTicketsManager1', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "manager1" )
  } );
  socket.on( 'getTicketsManager2', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "manager2" )
  } );
  socket.on( 'getTicketsManager3', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "manager3" )
  } );

  socket.on( 'getTicketsITUser1', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "ituser1" )
  } );
  socket.on( 'getTicketsITUser2', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "ituser2" )
  } );
  socket.on( 'getTicketsITUser3', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "ituser3" )
  } );

  socket.on( 'getTicketsView', function ( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount ) {
    emitTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, "view" )
  } );
}


/**
 *
 * @param filters
 * @param searchParams
 * @param includeCompleted
 * @param includeExpired
 * @param includeArchived
 * @param amount
 * @param socket
 * @param type
 */
function emitTicketList( filters, searchParams, includeCompleted, includeExpired, includeArchived, amount, socket, type ) {
  var ticketList = [];

  if ( filters.alteredBy != null ) {
    filters.alteredBy = getUserId( filters.alteredBy );
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

      console.log( "CHECK INCLUDE ARCHIVED: " + includeArchived );
      if ( includeArchived != "onlyArchived" ) {
        var query1 = dbhelper.searchForTicketsQuery( "tickets", filters, searchParams, includeCompleted, includeExpired, amount );
        client.query( query1, function ( err, result ) {
          done();
          if ( err ) {
            console.log( "query 1: " + query1 );
            return console.error( 'error running query', err );

          }

          console.log( query1 );

          for ( var i = 0; i < result.rows.length; i++ ) {
            result.rows[i].isArchive = false;
          }

          ticketList.push.apply( ticketList, result.rows );
        } );
      }
      if ( includeArchived != "excludeArchived" ) {
        var query2 = dbhelper.searchForTicketsQuery( "tickets_archive", filters, searchParams, includeCompleted, includeExpired, amount );
        client.query( query2, function ( err, result ) {
          done();
          if ( err ) {
            console.log( "query 2: " + query2 );
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


/**
 @purpose Saves changes to, or create a new user.

 @param socket server socket to listen for messages
 @author Matthew Chan
 @date 04/29/2014
 @editedBy John Welker
 @editDate 09/05/2014
 */
function handleSetUser( socket ) {
  socket.on( 'setUser', function ( id, name, email, pass, role ) {
    // connect to the database
    pg.connect( dbConfig, function ( err, client, done ) {
      // error connecting to the database
      if ( err ) {
        socket.emit( 'error', "Error connecting to the database" );
        return console.error( 'error connecting to the database', err );
      }

      if ( id == null ) {
        // new user

        // check if user already exists
        var testQuery = "SELECT * FROM users WHERE name = '" + name + "';";
        client.query( testQuery, function ( err, result ) {
          // return client to the pool
          done();
          if ( err ) {
            socket.emit( 'error', "Error running query.", err );
            return console.error( 'Error running query', err );
          }
          // If any results are returned then that user is already in the database.
          if ( result.rows.length() > 0 ) {
            socket.emit( 'error', "A user already exists with that name." );
            return console.error( 'User already exists' );
          }

          // construct query to create new user.
          var jUser = { name : name, email : email, pass : md5( pass ), role : role};
          var query = dbhelper.newUserQuery( jUser );

          // add the new user to the database
          client.query( query, function ( err, result ) {
            // return the client to the pool
            done();
            if ( err ) {
              socket.emit( 'error', 'Error querying database', err );
              return console.error( 'Error querying database', err );
            }
            socket.emit( 'success', 'user successfully saved.' );
          } );
        } );
      } else {
        // modify user

        var testQuery = "SELECT id FROM users WHERE id = '" + id + "';";
        client.query( testQuery, function ( err, result ) {
          // return the client to the pool
          done();
          if ( err ) {
            socket.emit( 'error', 'error querying database', err );
            return console.error( 'error querying database', err );
          }

          // if the user does not exist, send error message
          if ( result.rows.length() == 0 ) {
            socket.emit( 'error', 'No users with that id' );
            return console.error( 'No rows with that hash' );
          }

          // Construct the modify user query
          var jUser = { id : id, name : name, email : email, pass : md5( pass ), role : role };
          var query = dbhelper.modifyUserQuery( jUser );

          client.query( query, function ( err, result ) {
            // return the client to the pool
            done();
            if ( err ) {
              socket.emit( 'error', 'Error querying database', err );
              return console.error( 'Error querying database', err );
            }
            socket.emit( 'success', 'User successfully changed.' );
          } );
        } );
      }
    } );
  } );
}


/**
 @purpose called when a specific user is requested from the database for viewing by
 the client (for admins only).

 @param socket server socket to listen for messages
 @author: Matthew Chan
 @date 04/29/2014
 @editedBy John Welker
 @editDate 09/05/2014
 */
function handleGetUser( socket ) {
  socket.on( 'getUser', function ( id ) {
    // connect to the database
    pg.connect( dbConfig, function ( err, client, done ) {
      if ( err ) {
        socket.emit( 'error', 'error connecting to the database', err );
        return console.error( 'error connecting to the database', err );
      }

      // Get the requested user.
      var query = "SELECT * FROM users WHERE id = " + id + ";";
      client.query( query, function ( err, result ) {
        // return the client to the pool
        done();
        if ( err ) {
          socket.emit( 'error', 'error running query', err );
          return console.error( 'error running query', err );
        }

        // if there are no matching rows, error handle
        if ( result.rows.length() == 0 ) {
          socket.emit( 'error', 'No users exist with that id' );
          return console.error( 'No users exist with that id' );
        }

        socket.emit( 'displayUser', result.rows[0].name, result.rows[0].email, result.rows[0].password, result.rows[0].type );
      } );
    } );
  } );
}


/**
 @purpose called when the admin requests a list of users of a particular role to
 be displayed.

 @param socket server socket to listen for messages
 @author Matthew Chan
 @date 04/29/2014
 @editedBy John Welker
 @editDate 09/05/2014
 */
function handleGetUsers( socket ) {
  socket.on( 'getUsers', function ( role ) {
    // DATABASE FUNCTION: get list of users based on role
    // var userList = getUsers(role);
    // if role is null, get all users
    // also sends back user ids to use in requesting individual user data

    pg.connect( dbConfig, function ( err, client, done ) {
      if ( err ) {
        socket.emit( 'error', 'error fetching client from pool', err );
        return console.error( 'error fetching client from pool', err );
      }

      var query = "SELECT * FROM users";

      // If a role is given, restrict the query to users of that role
      if ( role != null ) {
        query += " WHERE role = '" + role + "';";
      } else {
        query += ";";
      }

      client.query( query, function ( err, result ) {
        // return the client to the pool
        done();
        if ( err ) {
          socket.emit( 'error', 'error running query', err );
          return console.error( 'error running query', err );
        }
        socket.emit( 'displayUsers', result );
      } );
    } );
  } );
}


/**
 * @purpose Handles set department requests by querying the database to create, modify, or add users to departments.
 * @param socket server socket to listen for messages
 * @author John Welker
 * @date 09/05/2014
 */
function handleSetDept( socket ) {
  socket.on( 'setDept', function ( deptid, deptname, usernames ) {
    if ( deptid == null ) {
      // new department

      var query1 = "SELECT * FROM departments WHERE name = '" + deptname + "';";
      client.query( query1, function ( err, result ) {
        // return client to the pool
        done();
        if ( err ) {
          socket.emit( 'error', 'error running query', err );
          return console.error( 'error running query', err );
        }
        if ( result.rows.length() > 0 ) {
          socket.emit( 'error', 'A department already exists by that name' );
          return console.error( "A department already exists by that name" );
        }

        // query the database to create a new department
        var query2 = "INSERT INTO departments (name) VALUES ( '" + deptname + "' );";
        client.query( query2, function ( err, result ) {
          // return client to pool
          done();
          if ( err ) {
            socket.emit( 'error', 'error running query', err );
            return console.error( 'error running query', err );
          }
          socket.emit( 'successful', 'Successfully added department' );
        } );
      } );
    } else {
      // modifying existing department

      // query the database to check that the department exists.
      var query1 = "SELECT * FROM departments WHERE name = '" + deptname + "';";
      client.query( query1, function ( err, result ) {
        // return client to the pool
        done();
        if ( err ) {
          socket.emit( 'error', 'error running query', err );
          return console.error( 'error running query', err );
        }
        if ( result.rows.length() == 0 ) {
          socket.emit( 'error', 'Department by that name does not exist' );
          return console.error( "Department by that name does not exist" );
        }

        // query the database to change the department name
        var query2 = "UPDATE departments SET name = '" + deptname + "' WHERE id = '" + deptid + "';";
        client.query( query2, function ( err, result ) {
          if ( err ) {
            socket.emit( 'error', 'error running query', err );
            return console.error( 'error running query', err );
          }
          socket.emit( 'successful', 'Successfully changed department.' );
        } );
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
          // return the client to the pool
          done();
          if ( err ) {
            return console.error( 'error running query', err );
          }
          if ( result.rows.length() == 0 ) {
            return console.error( "User does not exist or have manager-level permission, or already is assigned to the department" );
          }
        } );

        var query3 = dbhelper.newUserDeptQuery( deptid, userid );
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


/**
 *
 * @param socket
 */
function handleGetDepts( socket ) {
  socket.on( 'getDepts', function () {
    // DATABASE FUNCTION: return an array of all department names and supervisors
    // var deptList = getDepts();

    var query = dbhelper.getUserDeptQuery();
    client.query( query, function ( err, result ) {
      done();
      if ( err ) {
        return console.error( 'error running query', err );
      }
      socket.emit( 'displayDepts', result );
    } );
  } );
}


/**
 purpose: called when a user posts a reply to a ticket

 author: Matthew Chan

 date: 04/29/2014
 */
function handleSetReply( socket ) {
  socket.on( 'setReply', function ( replyId, ticketId, user, desc ) {
    // possible want: to make it so that users can edit their own replies
    // not a necessity right now
    // if "replyid" is null, make a new reply, otherwise ...

    // ERROR HANDLING: check if ticket exists in database
    /* if (checkTicketExists(ticketid) == false) {
     break from this function, and do nothing
     }
     */

    // DATABASE FUNCTION: store parameters into new reply

    pg.connect( dbConfig, function ( err, client, done ) {
      if ( err ) {
        socket.emit( 'error', 'Error connecting to the database', err );
        return console.error( 'Error connecting to the database', err );
      }

      if ( replyId == null ) {
        var query = dbhelper.newReplyQuery( ticketId, user, desc );
        client.query( query, function ( err, result ) {
          // return client to the pool
          done();
          if ( err ) {
            socket.emit( 'error', 'Error querying database', err );
            return console.error( 'Error querying database', err );
          }
          socket.emit( 'successful', 'Successfully inserted reply' );
        } );
      }
    } );
    socket.emit( 'newReply', ticketId, desc, user );
  } );
}


/**
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
 * Purpose: queries the database to add a new ticket.
 * @param socket socket to send the hash of the new ticket to.
 * @param jTicket json object ticket information
 * @author John Welker
 * @date 05/05/2014
 */
function newTicket( socket, jTicket ) {
  // construct the database query
  var query = dbhelper.newTicketQuery( jTicket );
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
  var q = dbhelper.modifyTicketQuery( jTicket, isArchive );

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
/**
 *
 * @param username
 */
function getUserId( username ) {
  // get userid based on username from users table
  var userquery = "SELECT id FROM users WHERE name = '" + username + "';";
  client.query( userquery, function ( err, result ) {
    done();
    if ( err ) {
      return console.error( 'error running query', err );
    }
    if ( result.rows.length() == 0 ) {
      return console.error( "No user exists by that name" );
    }

    return result.rows[0].id;
  } );
}


/**
 *
 * @param deptName
 */
function getDeptId( deptName ) {
  // get userId based on username from users table
  var userQuery = "SELECT id FROM departments WHERE name = '" + deptName + "';";
  client.query( userQuery, function ( err, result ) {
    done();
    if ( err ) {
      return console.error( 'error running query', err );
    }
    if ( result.rows.length() == 0 ) {
      return console.error( "No department exists by that name" );
    }

    return result.rows[0].id;
  } );
}

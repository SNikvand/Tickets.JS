/**
 * Purpose: Helper functions to create database queries
 *
 * Created by John
 * Date Modified: 10/05/2014
 * Version 0.1
 */

var config = require( './config' );
var pg = require( 'pg' );
var dbConfig = config.db;

/**
 * Purpose: Get the highest ID number in the tickets table
 *
 * @return database query string to get the largest ticket number
 */
function getMaxIdQuery() {
  return "SELECT MAX(id) AS id FROM tickets;";
}
exports.getMaxIdQuery = getMaxIdQuery;

/**
 * Purpose makes an insert database query string from a user json object
 *
 * @param jTicket  json object representing a ticket { id, hash, title, author, email, department, description, level, due_date }
 * All fields required
 *
 * @return database query string
 * @author John Welker
 * @date 10/05/2014
 */
function newTicketQuery( jTicket ) {
  var query = "INSERT INTO tickets (hash, title, author, author_email, create_date, department, description, priority, due_date) VALUES ( '" + jTicket.hash + "', '" + jTicket.title + "', '" + jTicket.submittedBy + "', '"
    + jTicket.clientEmail + "', CURRENT_TIMESTAMP, " + jTicket.dept + ", '" + jTicket.description + "', " + jTicket.priority + ", CURRENT_DATE+" + jTicket.priority * 2 + " ) RETURNING *;";
  return query;
}
exports.newTicketQuery = newTicketQuery;
/**
 * Purpose makes a modify database query from a ticket json object
 *
 * @param jTicket  json object representing a ticket
 * { id, level, altered_by, assigned_to, due_date, complete[true/false] }
 * Id is required
 * others are optional
 *
 * @return database query string
 */
function modifyTicketQuery( jTicket ) {
  var table = (jTicket.isArchive == true ? "tickets_archive" : "tickets");

  var query = "UPDATE " + table + " SET ";
  var qParts = new Array();

  if ( jTicket.dept != undefined ) {
    qParts.push( " department=" + jTicket.dept );
  }

  if ( jTicket.priority != undefined ) {
    qParts.push( " priority=" + jTicket.priority );
  }

  if ( jTicket.alteredBy != undefined ) {
    qParts.push( " altered_by='" + jTicket.alteredBy + "'" );
  }

  if ( jTicket.assignedTo != undefined ) {
    qParts.push( " assigned_to='" + jTicket.assignedTo + "'" );
  }

  if ( jTicket.dateDue != undefined ) {
    qParts.push( " due_date=DATE '" + jTicket.dateDue + "'" );
  }

  if ( jTicket.isCompleted == true ) {
    qParts.push( " complete_date=CURRENT_TIMESTAMP" );
  } else {
    qParts.push( " complete_date=NULL");
  }

  qParts.push( " altered_date=CURRENT_DATE" );

  for ( var i = 0; i < qParts.length; i++ ) {
    query += qParts[i];
    if ( i < qParts.length - 1 ) {
      query += ", "
    }
  }

  query += " WHERE id='" + jTicket.id + "' RETURNING * ;";
  return query;
}
exports.modifyTicketQuery = modifyTicketQuery;


/**
 * Purpose makes a insert database query from a user json object
 *
 * @param jUser json object representing a user
 *
 * @return database query string
 */
function newUserQuery( jUser ) {
  var query = "INSERT INTO users (name, email, password, type) VALUES ( '" + jUser.name + "', '" + jUser.email + "', '" + jUser.pass + "', '"
    + jUser.role + "' );";
  return query;
}
exports.newUserQuery = newUserQuery;


/**
 * Purpose modifies the entry in the users database
 *
 * @param jUser json object representing a user
 *
 * @return database query string
 */
function modifyUserQuery( jUser ) {
  var query = "UPDATE users SET ";
  var qParts = new Array();

  if ( jUser.name != undefined ) {
    qParts.push( " name='" + jUser.name + "'" );
  }

  if ( jUser.email != undefined ) {
    qParts.push( " email='" + jUser.email + "'" );
  }

  if ( jUser.pass != undefined ) {
    qParts.push( " password='" + jUser.pass + "'" );
  }

  if ( jUser.role != undefined ) {
    qParts.push( " type='" + jUser.role + "'" );
  }

  for ( var i = 0; i < qParts.length; i++ ) {
    query += qParts[i];
    if ( i < qParts.length - 1 ) {
      query += ", "
    }
  }

  query += " WHERE id='" + jUser.id + "' RETURNING * ;";
  return query;
}
exports.modifyUserQuery = modifyUserQuery;


/**
 * Purpose makes an insert query for a department in the database
 *
 * @param deptid name and user (manager) id if provided
 *
 * @return database query string
 */
function newUserDeptQuery( deptid, userid ) {

  var query = "INSERT INTO user_dept VALUES dept_id = " + deptid + ", user_id = " + userid + ";";

  return query;
}
exports.newUserDeptQuery = newUserDeptQuery;


/**
 * Purpose retrieves the query for getting all users along with their assigned departments
 *
 * @param department name and user (manager) id if provided
 *
 * @return database query string
 */
function getUserDeptQuery() {
  var query = "SELECT d.name AS name, u.name AS manager FROM user_dept a JOIN departments d ON (d.id = a.dept_id) JOIN users u ON (u.id = a.user_id);";

  return query;
}
exports.getUserDeptQuery = getUserDeptQuery;


/**
 * Purpose searches for and returns a query for a collection of tickets based on parameters
 *
 * @param search and filter parameters
 *
 * @return database query string
 */

function searchForTicketsQuery( table, filters, searchParams, includeCompleted, includeExpired, amount, orderBy, direction, type ) {
    if (includeCompleted == "onlyCompleted") {
        includeExpired = "excludeExpired";
    } else if (includeExpired == "onlyExpired") {
        includeCompleted = "excludeCompleted";
    }

    var query = "SELECT t.hash, t.title, t.author, t.author_email, t.create_date, d.name as department, t.description," +
        " t.priority, t.due_date, a.name as assigned_to, t.altered_date, b.name as altered_by, t.complete_date from " + table + " t JOIN" +
        " departments d on (t.department = d.id) LEFT JOIN users a on (t.assigned_to = a.id) LEFT JOIN users b on" +
        " (t.altered_by = b.id) WHERE";

    if (type == "logout" && filters.lastLogout != null) {
        query += " create_date >= '" + filters.lastLogout + "' AND";
    }

    if (filters.dept != null) {
        query += " (";
        filters.dept.forEach(function(id) {
            query += " department = " + id + " OR";
        });
        query += ") AND";
        query = query.replace("OR) AND", ") AND");
    }

    if (filters.priority != null) {
        query += " priority = '" + filters.priority + "' AND";
    }

    if (filters.assignedTo != null) {
        query += " assigned_to = '" + filters.assignedTo + "' AND";
    }


    if (filters.alteredBy != null) {
        query += " altered_by = '" + filters.alteredBy + "' AND";
    }


    if (filters.submittedBy != null) {
        query += " author = '" + filters.submittedBy + "' AND";
    }


    if (filters.clientEmail != null) {
        query += " author_email = '" + filters.clientEmail + "' AND";
    }

    // search based on keywords
    var searchWithin = false;
    if (searchParams.inTitle || searchParams.inBody) {
        searchWithin = true;
    }

    var bothFields = false;
    if (searchParams.inTitle && searchParams.inBody) {
        bothFields = true;
    }

    if (searchWithin) {
        if (bothFields) {
            query += "(";
        }

        var keywords = searchParams.keywords.split(" ");
        if (searchParams.inTitle) {
            query += " title ~* ('";

            for (var i = 0; i < keywords.length; i++) {
                query += keywords[i];
                if (i != keywords.length - 1) {
                    query += "'|'";
                }
            }
            query += "') " + (searchParams.inBody ? " OR" : " AND");
        }

        if (searchParams.inBody) {
            query += " description ~* ('";

            for (var j = 0; j < keywords.length; j++) {
                query += keywords[j];
                if (j != keywords.length - 1) {
                    query += "'|'";
                }
            }
            query += "')" + (bothFields ? ")" : "") + " AND";
        }
    }

    // filter out by completed or expired
    // if "include", nothing about the query changes because it's already inclusive
    switch (includeCompleted) {
        case "excludeCompleted":
            if (includeExpired != "onlyExpired") {
                query += " complete_date IS NULL";

                if (includeExpired != "includeExpired") {
                    query += " AND";
                }
            }
            break;
        case "onlyCompleted":
            query += " complete_date IS NOT NULL";
            break;
    }

    switch (includeExpired) {
        case "excludeExpired":
            if (includeCompleted == "excludeCompleted") {
                query += " CURRENT_DATE <= due_date";
            }

            if (includeCompleted == "includeCompleted") {
                // call recursive here with onlyExpired
                query += " EXCEPT " + searchForTicketsQuery(table, filters, searchParams, null, "onlyExpired", null);
            }
            break;
        case "onlyExpired":
            query += " CURRENT_DATE > due_date AND complete_date IS NULL";
            break;
    }

    if (orderBy) {
        query += " ORDER BY " + orderBy + " " + direction;
    }

    if (amount) {
        query += " LIMIT " + amount;
    }

    query = query.replace("WHERE EXCEPT", "EXCEPT");
    query = query.replace("WHERE ORDER", "ORDER");
    query = query.replace("WHERE LIMIT", "LIMIT");
    query = query.replace("AND EXCEPT", "EXCEPT");
    query = query.replace("AND ORDER", "ORDER");
    query = query.replace("AND LIMIT", "LIMIT");

    return query;
}
exports.searchForTicketsQuery = searchForTicketsQuery;


/**
 * creates a query to insert a reply into the database
 *
 * @param ticketId the id of the ticket for the reply to be attached to
 * @param user the user posting the reply
 * @param desc the body of the reply
 * @returns {string} a query inserting a new reply into the database.
 */
function newReplyQuery( ticketId, isArchive, userId, desc ) {
  var table = (isArchive == true ? "comments_archive" : "comments");

  var query = "INSERT INTO " + table +
      " (ticket_id, user_id, create_date, description) " +
      " VALUES ('" + ticketId + "', " + userId + ", CURRENT_DATE, '" + desc + "');";
  return query;
}
exports.newReplyQuery = newReplyQuery;


/**
 * Creates a query to get the id of a user from it's name
 *
 * @param name name of the user to get the id of
 * @returns {string} a database query to get the user id from it's name
 * @author John Welker
 * @date 09/05/2014
 */
function getUserIdQuery( name ) {
  return "SELECT id FROM users WHERE name='" + name + "';";
}
exports.getUserIdQuery = getUserIdQuery;


/**
 * Creates a query to get the id of a department from it's name
 *
 * @param name name of the department to get the id of
 * @returns {string} a database query to get the department id from it's name
 * @author John Welker
 * @date 09/05/2014
 */
function getDeptIdQuery( name ) {
  return "SELECT id FROM departments WHERE name='" + name + "';";
}
exports.getDeptIdQuery = getDeptIdQuery;

/**
 * Queries the database
 * @param arg query to send to the database
 * @param callback function to call that receives the result
 * @author John Welker
 * @date 10/05/2014
 */
function queryDatabase( arg, callback ) {
  pg.connect( dbConfig, function ( err, client, done ) {
    if ( err ) {
      console.error( 'Error connecting to database', err );
    }
    client.query( arg, function ( err, result ) {
      done();
      if ( err ) {
        console.error( 'Error querying database', err );
      }
      callback( err, result );
    } );
  } );
}
exports.queryDatabase = queryDatabase;
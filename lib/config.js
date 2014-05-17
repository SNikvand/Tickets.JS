var config = {
  // database connection configuration
  db             : {
    user     : 'team22',
    password : 'T1ck3t404',
    database : 'team22',
    host     : 'void.bcit.ca',
    port     : 5433
  },
  // phrase to encode ticket hashes
  secret         : 'The Wei',
  // # of days to add as the default due date, based on the priority of a ticket
  priorityOffset : [
    "+ INTERVAL '1 DAY'",
    "+ INTERVAL '3 DAY'",
    "+ INTERVAL '7 DAYS'",
    "+ INTERVAL '14 DAYS'",
    "+ INTERVAL '30 DAYS'",
    "+ INTERVAL '90 DAYS'" ]
};
module.exports = config;
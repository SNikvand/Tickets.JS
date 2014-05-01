var adminPriv = ["admin", "home", "viewtickets", "newticket", "searchtickets", "newuser", "viewusers", "newdept",
    "viewdepts", "mailsettings", "othersettings"];
var managerPriv = ["admin", "home", "viewtickets", "newticket", "searchtickets", "mailsettings", "othersettings"];
var ituserPriv = ["admin", "home", "viewtickets", "searchtickets", "mailsettings", "othersettings"];

/*
    purpose: whenever a page is accessed, the application checks the current role (via session)
    against the pageid attempting to be accessed. the function returns false if access is denied,
    and true if granted. consequences or redirection is up to the caller of the function.

    author: Matthew Chan
    date: 04/30/2014
 */
exports.checkRestriction = function(pageid, role) {
    if (role != "Admin" && role != "Manager" && role != "IT User") {
        console.log("error: not logged in");
        window.location.replace('/');
        return false;
    }

    if (pageid == "ticket") {
        switch (role) {
            case "Admin":
                return true;
            case "Manager":
                // check if this ticket falls into one of manager's departments
                // if it does, return true. otherwise return false
            case "IT User":
                // check if this has been assigned to IT user
                // if it has pageid.toString()), return true. otherwise return false
        }
    } else {
        switch (role) {
            case "Admin":
                if (adminPriv.indexOf(pageid) == -1) {
                    return false;
                }
                return true;
            case "Manager":
                if (managerPriv.indexOf(pageid) == -1) {
                    return false;
                }
                return true;
            case "IT User":
                if (ituserPriv.indexOf(pageid) == -1) {
                    return false;
                }
                return true;
        }
    }
};
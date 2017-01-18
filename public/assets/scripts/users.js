/**
 * Created by George on 2016-07-10.
 */
//User Object
var userFunctions = function(username, password, privilege){
    var object = new Object();
    object.username = username;
    object.password = password;
    object.privilege = privilege;
    return object;
};

// var userFunctions = function(){
//     var self = this;
//
//     self.createUser = function(username, password, privilege){
//         this.username = username;
//         this.password = password;
//         this.privilege = privilege;
//         return this;
//     };
// };
module.exports = userFunctions;
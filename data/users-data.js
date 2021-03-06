 function usersData(models) {
     let User = models.User;
     return {
         findUserByUsername: function(name) {
             return new Promise((resolve, reject) => {

                 User.findOne({ username: name }, function(err, user) {
                     if (err) {
                         reject(err);
                     } else {
                         resolve(user);
                     }
                 });
             })
         },
         findUserByFacebookAuthToken: function(facebookAuthToken) {
             return new Promise((resolve, reject) => {
                 if (!facebookAuthToken) {
                     reject('Doesnt match');
                 }

                 User.findOne({ facebookAuthToken }, function(err, user) {
                     if (err) {
                         reject(err);
                     } else {
                         resolve(user);
                     }
                 });
             })
         },
         createUser: function(obj) {
             //console.log(`Username: ${username}, Password: ${password}`);
             const user = new User({
                 username: obj.username,
                 password: obj.password,
                 firstName: obj.firstName,
                 lastName: obj.lastName,
                 isManager: obj.manager,
                 flatNumber: obj.flatNumber,
                 apartmentNumber: obj.apartmentNumber,
                 exitNumber: obj.exitNumber,
                 city: obj.city,
                 neighborhood: obj.neighborhood,
                 imgUrl: obj.imgUrl || '',
                 facebookAuthToken: obj.facebookAuthToken || '',
                 tasks: []
             });

             return new Promise((resolve, reject) => {
                 usersData(models).findUserByUsername(obj.username)
                     .then(u => {
                         if (!u) {
                             resolve(user.save());
                         } else {
                             reject('User doesnt exists');
                         }
                     })
                     .catch(err => {
                         reject(err);
                     })
             })
         },
         getAllUsers: function() {
             return new Promise((resolve, reject) => {
                 User.find((err, users) => {
                     if (err) {
                         return reject(err)
                     }

                     return resolve(users);
                 })
             });
         },
         changeUserImage: function(username, password, imgUrl) {
             return new Promise((resolve, reject) => {
                 User.findOneAndUpdate({
                     username,
                     password
                 }, {
                     $set: {
                         imgUrl: imgUrl
                     }
                 }, (err, user) => {
                     if (err) {
                         return reject(err);
                     }
                     user.imgUrl = imgUrl;
                     return resolve(user);
                 });
             });
         },
         addTask: function(username, task) {
             console.log('adding task');
             return new Promise((resolve, reject) => {
                 User.findOneAndUpdate({
                     username
                 }, {
                     $push: { tasks: task }
                 }, (err, user) => {
                     if (err) {
                         console.log('task added failed');
                         return reject(err);
                     } else {
                         console.log('task added');
                         return resolve(user);
                     }
                 });
             });
         },
         removeTask: function(username, task) {
             console.log('removing task');
             return new Promise((resolve, reject) => {
                 User.findOneAndUpdate({
                     username
                 }, {
                     $pull: { tasks: task }
                 }, (err, user) => {
                     if (err) {
                         return reject(err);
                     }
                     console.log('task removed');
                     return resolve(user);
                 });
             });
         }
     };
 };

 module.exports = usersData;
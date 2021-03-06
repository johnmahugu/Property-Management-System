module.exports = (models) => {
    let TownshipMessage = models.TownshipMessage;
    return {
        findTownshipMessageByUser: function(properties) {
            return new Promise((resolve, reject) => {
                TownshipMessage.find((err, msgs) => {
                    if (err) {
                        return reject(err)
                    }
                    let userMsgs = [];
                    for (let i = 0; i < msgs.length; i++) {
                        console.log(msgs[i].from.username + " - " + properties.username);
                        if (msgs[i].from.username === properties.username) {
                            userMsgs.push(msgs[i]);
                        }
                    }
                    resolve(userMsgs);
                })
            });
        },
        setAnswerToTownshipMessage: function(properties, content) {
            console.log(properties);
            console.log(content);
            return new Promise((resolve, reject) => {
                TownshipMessage.findOne({
                    content: properties.content,
                    title: properties.title
                }, function(err, msg) {
                    if (err) {
                        reject(err);
                    } else {
                        msg.answer = content;
                        resolve(msg.save());
                    }
                });
            });
        },
        createTownshipMessage: function(obj) {
            //console.log(`Username: ${username}, Password: ${password}`);
            const msg = new TownshipMessage({
                title: obj.title,
                from: obj.from,
                content: obj.content
            });

            return Promise.resolve(msg.save());
        },
        getAllTownshipMessages: function() {
            return new Promise((resolve, reject) => {
                TownshipMessage.find((err, msgs) => {
                    if (err) {
                        return reject(err)
                    }

                    return resolve(msgs);
                })
            });
        }
    };
};
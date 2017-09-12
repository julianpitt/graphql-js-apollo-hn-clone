module.exports = {
  Query: {
    allLinks: (root, data, {mongo: {Links}}) => { // 1
      return Links.find({}).toArray(); // 2
    },
  },

  Mutation: {

    createLink: (root, data, {mongo: {Links}, user}) => {
        const newLink = Object.assign({postedById: user && user._id}, data);
        return Links.insert(newLink).then((response) => {
            return Object.assign({id: response.insertedIds[0]}, newLink); // 4
        });
    
    },

    createUser: (root, data, {mongo: {Users}}) => {
        // You need to convert the given arguments into the format for the
        // `User` type, grabbing email and password from the "authProvider".
        const newUser = {
            name: data.name,
            email: data.authProvider.credentials.email,
            password: data.authProvider.credentials.password,
        };

        return Users.insert(newUser).then((response) => {
            return Object.assign({id: response.insertedIds[0]}, newUser);
        });
    },

    signinUser: (root, data, {mongo: {Users}}) => {
        return Users.findOne({email: data.credentials.email}).then((user) => {
            if (data.credentials.password === user.password) {
                return {token: `token-${user.email}`, user};
            }
        });
    },

    createVote: (root, data, {mongo: {Votes}, user}) => {
        const newVote = {
            userId: user && user._id,
            linkId: new ObjectID(data.linkId),
        };
        return Votes.insert(newVote).then((response) => {
            return Object.assign({id: response.insertedIds[0]}, newVote);
        });
    },

    removeAllVotes: (root, data, {mongo: {Votes,Users,Links}}) => {
        return Votes.remove().then(() => Users.remove()).then(() => Links.remove());
    }

},

    Link: {
        id: root => root._id || root.id, // 5
        postedBy: ({postedById}, data, {mongo: {Users}}) => {
            return Users.findOne({_id: postedById});
        },
        votes: ({_id}, data, {mongo: {Votes}}) => {
            return Votes.find({linkId: _id}).toArray();
        },
    },
    User: {
        // Convert the "_id" field from MongoDB to "id" from the schema.
        id: root => root._id || root.id,
        votes: ({_id}, data, {mongo: {Votes}}) => {
            return Votes.find({userId: _id}).toArray();
        },
    },
    Vote: {
        id: root => root._id || root.id,

        user: ({userId}, data, {mongo: {Users}}) => {
            return Users.findOne({_id: userId});
        },

        link: ({linkId}, data, {mongo: {Links}}) => {
            return Links.findOne({_id: linkId});
        },
    },
};
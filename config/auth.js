module.exports = {
    'googleAuth' : {
        'clientID': process.env.AUTH_CLIENTID,
        'clientSecret': process.env.AUTH_CLIENTSECRET,
        'callbackURL': 'http://localhost:4000/users/auth/google/callback',
    }
}
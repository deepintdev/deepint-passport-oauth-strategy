# passport-deepint

[Passport](http://passportjs.org/) strategy for authenticating with [Deep Intelligence](https://deepint.net/)
using the OAuth 2.0 API.

This module lets you authenticate using Deep Intelligence in your Node.js applications.
By plugging into Passport, Deep Intelligence authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).


## Install

```bash
$ npm install passport-deepint
```

## Usage

#### Create an Application

Before using `passport-deepint`, you must register an application with
Deep Intelligence.  If you have not already done so, a new application can be created in the
[Deepint Panel](https://app.deepint.net/).
Your application will be issued a client ID and client secret, which need to be
provided to the strategy.  You will also need to configure a redirect URI which
matches the route in your application.

#### Configure Strategy

The Deep Intelligence authentication strategy authenticates users using a Deep Intelligence account
and OAuth 2.0 tokens.  The client ID and secret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token as well as `profile` which contains the authenticated user's
Deep Intelligence profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```javascript
var DeepintStrategy = require('passport-deepint').Strategy;

Passport.use(new DeepintStrategy({
    clientID: EXAMPLE_CLIENT_ID,
    clientSecret:  EXAMPLE_CLIENT_SECRET,
    },
    function(accessToken, profile, cb) {
        User.findOrCreate({ deepintId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'deepint'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get('/auth/deepint',
  passport.authenticate('deepint'));

app.get('/auth/deepint/callback', 
  passport.authenticate('deepint', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  ```


## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2021 Deep Intelligence <[http://deepint.net/](http://deepint.net/)>
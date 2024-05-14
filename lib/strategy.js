/**
 * Module dependencies.
 */
 var passport = require('passport-strategy'),
 util = require('util');
 const superagent = require('superagent');
 /**
 * `Strategy` constructor.
 *
 * The Deepint authentication strategy authenticates requests based on a function callback.
 * Applications must supply a `verify` callback which executes custom authentication logic, and then calls the `done` callback supplying a `user`, which should be set to `false` if the credentials are not valid. If an exception occured, `err` should be set.
 *
 * @param {Function} verify Verifies the user.
 * @api public
 */
 function Strategy(options,verify) {
  if (!verify) {
      throw new TypeError('DeepintStrategy requires a verify callback');
  }
  if(!options.hasOwnProperty('clientID')) {
      throw new TypeError('DeepintStrategy requires a Client ID in options object');
  }
  if(!options.hasOwnProperty('clientSecret')) {
      throw new TypeError('DeepintStrategy requires a Client Secret in options object');
  }
  passport.Strategy.call(this);
  this.name = 'deepint';
  this._authorizationurl = 'https://app.air-core.io/oauth/authorize?client_id='+options.clientID;
  this._clientid = options.clientID;
  this._clientsecret = options.clientSecret;
  this._verify = verify;
 }
 
 /**
 * Inherit from `passport.Strategy`.
 */
 util.inherits(Strategy, passport.Strategy);
 
 /**
 * Authenticate request based on the contents of a form submission.
 * @param {Object} req HTTP request object.
 * @api protected
 */
 Strategy.prototype.authenticate = async function (req, options) {
  var self = this;
 
  function verified(err, user, info) {
      if (err) {
          return self.error(err);
      }
      if (!user) {
          return self.fail(info);
      }
      self.success(user, info);
  }
 
  if(req.query && req.query.bearer) {
     let response;
      try {
         response = await superagent.post('https://app.air-core.io/api/oauth/login').send({
              "client_id": this._clientid,
              "client_secret": this._clientsecret,
              "bearer": req.query.bearer,
              "expiration": "never"
          });
      } catch (error) {
          //console.log("Error in Token Autentication: "+error);
          this._verify(null,null,verified);
      }
      if(response && response.body && response.body.result == 'success') {
         let userInfoRequest;
         let userProfileRequest 
         try {
             userInfoRequest = await superagent.get('https://app.air-core.io/api/v1/who').set('x-auth-token', response.body.auth_token);
             userProfileRequest = await superagent.get('https://app.air-core.io/api/v1/profile').set('x-auth-token', response.body.auth_token);
          } catch (error) {
              //console.log("Error in Profile Information: " + error);
              this._verify(null,null,verified);
          }
          if(userInfoRequest.statusCode == 200) {
              const user = {
                  deepint_id: userInfoRequest.body.user_id,
                  user_name: userInfoRequest.body.user_name,
                  user_email: userInfoRequest.body.user_email,
                  user_picture: userProfileRequest.body.picture,
                  user_full_name: userProfileRequest.body.full_name
              }
              this._verify(response.body.auth_token,user,verified);
          }
      }
  } else {
      this.redirect(this._authorizationurl);
  }
 };
 
 /**
 * Expose `Strategy`.
 */
 module.exports = Strategy;

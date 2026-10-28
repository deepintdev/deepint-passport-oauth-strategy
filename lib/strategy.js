/**
 * Module dependencies.
 */
 var passport = require('passport-strategy'),
 util = require('util');
 const superagent = require('superagent');

 /**
 * Default AIR-Core instance (formerly Deep Intelligence, https://app.deepint.net).
 */
 var DEFAULT_BASE_URL = 'https://app.air-core.io';

 function trimTrailingSlash(url) {
  return String(url).replace(/\/+$/, '');
 }

 /**
 * `Strategy` constructor.
 *
 * The AIR-Core (formerly Deep Intelligence) authentication strategy authenticates requests based on a function callback.
 * Applications must supply a `verify` callback which executes custom authentication logic, and then calls the `done` callback supplying a `user`, which should be set to `false` if the credentials are not valid. If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`          (required) OAuth client ID.
 *   - `clientSecret`      (required) OAuth client secret.
 *   - `baseURL`           Instance URL, defaults to `https://app.air-core.io`.
 *                         Set it to `https://app.deepint.net` to keep using the legacy host.
 *   - `authorizationURL`  Defaults to `<baseURL>/oauth/authorize`.
 *   - `tokenURL`          Defaults to `<baseURL>/api/oauth/login`.
 *   - `userInfoURL`       Defaults to `<baseURL>/api/v1/who`.
 *   - `profileURL`        Defaults to `<baseURL>/api/v1/profile`.
 *
 * @param {Object} options
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
  var baseURL = trimTrailingSlash(options.baseURL || DEFAULT_BASE_URL);
  var authorizationURL = options.authorizationURL || (baseURL + '/oauth/authorize');
  this._authorizationurl = authorizationURL + (authorizationURL.indexOf('?') === -1 ? '?' : '&') + 'client_id=' + encodeURIComponent(options.clientID);
  this._tokenurl = options.tokenURL || (baseURL + '/api/oauth/login');
  this._userinfourl = options.userInfoURL || (baseURL + '/api/v1/who');
  this._profileurl = options.profileURL || (baseURL + '/api/v1/profile');
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
         response = await superagent.post(this._tokenurl).send({
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
             userInfoRequest = await superagent.get(this._userinfourl).set('x-auth-token', response.body.auth_token);
             userProfileRequest = await superagent.get(this._profileurl).set('x-auth-token', response.body.auth_token);
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

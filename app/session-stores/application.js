import Cookie from 'ember-simple-auth/session-stores/cookie';

const fiveYears = (5 * 365 * 24 * 60 * 60);

export default Cookie.extend({
  cookieExpirationTime: fiveYears
});

import DeviseAuth from 'simple-auth-devise/authorizers/devise';

export default DeviseAuth.extend({
  authorize(jqXHR, requestOptions) {
    jqXHR.setRequestHeader('Consumer-App-Uri', 'http://stage-consumer.subtext.org');

    this._super(jqXHR, requestOptions);
  }
});

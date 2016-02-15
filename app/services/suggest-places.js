import Ember from 'ember';

const { get } = Ember;

export default Ember.Service.extend({
  mapsService: Ember.inject.service('google-maps'),

  suggest(val) {
    const mapsService = get(this, 'mapsService');
    const returnSet = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

    return returnSet.create({
      promise: new Ember.RSVP.Promise(function(resolve, reject) {
        mapsService.geocode({
          address: val,
          componentRestrictions: {
            country: 'US'
          }
        }, function(results, status) {
          if(status !== "OK") {
            reject(status);
          } else {
            let resultset = results || [];

            if( resultset.length > 10 ) {
              resultset = resultset.slice(0, 10);
            }
            resolve(resultset.map(item => {
              return mapsService.cityStateFormat(item);
            }));
          }
        });
      })
    });
  }
});

import Ember from 'ember';

const { inject, get, on } = Ember;

export default Ember.Mixin.create({
  ads: inject.service(),
  setupAdContext: on('activate', function() {
    const ads = get(this, 'ads');
    const routeName = get(this, 'routeName');

    ads.createContext(routeName);
  }),
  teardownAdContext: on('deactivate', function() {
    const ads = get(this, 'ads');
    const routeName = get(this, 'routeName');

    ads.clearContext(routeName);
  })
});

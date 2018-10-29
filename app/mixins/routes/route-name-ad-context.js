import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import { on } from '@ember/object/evented';

export default Mixin.create({
  ads: service(),
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

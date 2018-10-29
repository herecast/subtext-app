import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { set, get, setProperties } from '@ember/object';

export default Component.extend({
  store: service(),
  userLocation: service(),

  init() {
    this._super(...arguments);

    setProperties(this, {
      news: []
    });

    get(this, 'userLocation.userLocation').then((location) => {
      const query = {
        'category': 'sponsored_content',
        'content_type' : 'posts',
        'page': 1,
        'per_page': 3,
        radius: 10,
        location_id: location.id
      };

      get(this, 'store').query('feed-item', query).then((items) => {
        if (!get(this, 'isDestroyed')) {
          set(this, 'news',
            items.filter((item) => {
              return get(item, 'modelType') === 'content';
            }).map((item)=>{
              return get(item, 'content');
            })
          );
        }
      });
    });
  }
});

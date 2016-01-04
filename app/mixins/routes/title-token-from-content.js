import Ember from 'ember';

const { set, get } = Ember;

export default Ember.Mixin.create({
  afterModel(model) {
    const title = model.get('title');
    const additionalToken = get(this, 'additionalToken');
    const titleToken = (additionalToken) ? `${additionalToken} "${title}"` : title;

    set(this, 'titleToken', titleToken);
  }
});

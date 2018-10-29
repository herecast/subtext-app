import Mixin from '@ember/object/mixin';
import { get, set } from '@ember/object';

export default Mixin.create({
  afterModel(model) {
    this._super(...arguments);

    const title = model.get('title');
    const additionalToken = get(this, 'additionalToken');
    const titleToken = (additionalToken) ? `${additionalToken} "${title}"` : title;

    set(this, 'titleToken', titleToken);
  }
});

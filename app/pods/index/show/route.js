import Ember from 'ember';
import Linkable from 'ember-cli-link-tags/mixins/linkable';
import normalizeContentType from 'subtext-ui/utils/normalize-content-type';

const { get, set } = Ember;

function canonicalUrlFor(type, id) {
  let ctype = normalizeContentType(type);

  if (ctype === 'event-instance') {
    ctype = 'events';
  } else if (ctype === 'market-post') {
    ctype = 'market';
  }

  return `${location.protocol}//${location.host}/${ctype}/${id}`;
}

export default Ember.Route.extend(Linkable, {
  links() {
    const type = this.currentModel._internalModel.modelName;
    const id = this.currentModel.id;

    return {
      canonical: canonicalUrlFor(type, id)
    };
  },

  model(params, transition) {
    const type = normalizeContentType(params.ctype) || null;

    if (type) {
      return this.store.findRecord(type, params.id).catch(() => {
        this.replaceWith('error-404');
      });
    } else {
      transition.abort();
    }
  },

  afterModel(model) {
    const titleToken = get(model, 'title');

    set(this, 'titleToken', titleToken);
  }
});

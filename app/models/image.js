import Ember from 'ember';
import DS from 'ember-data';

const {
  get,
  inject
} = Ember;

export default DS.Model.extend({
  api: inject.service('api'),
  contentId: DS.attr('number'),
  imageUrl: DS.attr('string'),
  primary: DS.attr('number'),
  caption: DS.attr('string'),
  _delete: DS.attr('boolean'),

  save() {
    if (get(this, 'isNew')) {
      return this._create();
    } else {
      // Use ember data's save() function to update an existing record
      return this._super();
    }
  },

  // We have to manually send a FormData object so that the file is properly
  // uploaded to the API. This requires us to tell Ember Data that the model
  // has been updated with adapterWillCommit() and adapterDidCommit() so that
  // the record is not in the "isNew" state after saving.
  _create() {
    const api = get(this, 'api');
    const data = new FormData();
    const internalModel = this._internalModel;

    data.append('image[primary]', get(this, 'primary'));
    data.append('image[image]', get(this, 'file'));
    data.append('image[content_id]', get(this, 'contentId'));

    internalModel.adapterWillCommit();

    return api.createImage(data).then((response) => {
      const id = get(response, 'image.id');
      internalModel.setId(id);
      internalModel.adapterDidCommit();
    });
  }
});

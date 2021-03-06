import { inject as service } from '@ember/service';
import { set, get } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  api: service('api'),

  contentId: DS.attr('number'),
  imageUrl: DS.attr('string'),
  primary: DS.attr('boolean'),
  caption: DS.attr('string'),
  width: DS.attr('number'),
  height: DS.attr('number'),
  position: DS.attr('number'),

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
    data.append('image[position]', get(this, 'position'));
    data.append('image[caption]', get(this, 'caption'));

    internalModel.adapterWillCommit();

    return api.createImage(data).then((response) => {
      const { image } = response;
      const id = get(image, 'id');

      set(this, 'file', null);

      set(this, 'contentId', parseInt(get(this, 'contentId')));

      if (get(image, 'url')) {
        set(this, 'imageUrl', get(image, 'url'));
      }
      if (get(image, 'height')) {
        set(this, 'height', get(image, 'height'));
      }
      if (get(image, 'width')) {
        set(this, 'width', get(image, 'width'));
      }

      set(this, 'hasDirtyAttributes', false);
      internalModel.setId(id.toString());
      internalModel.adapterDidCommit();
    });
  }
});

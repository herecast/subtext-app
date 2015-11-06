import Ember from 'ember';
import DS from 'ember-data';
import ajax from 'ic-ajax';
import config from 'subtext-ui/config/environment';

const {
  get
} = Ember;

export default DS.Model.extend({
  contentId: DS.attr('number'),
  imageUrl: DS.attr('string'),
  primary: DS.attr('number'),

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
    const url = `${config.API_NAMESPACE}/images`;
    const data = new FormData();
    const internalModel = this._internalModel;

    data.append('image[primary]', get(this, 'primary'));
    data.append('image[image]', get(this, 'file'));
    data.append('image[content_id]', get(this, 'contentId'));

    internalModel.adapterWillCommit();

    return ajax(url, {
      data: data,
      type: 'POST',
      contentType: false,
      processData: false
    }).then((response) => {
      const id = get(response, 'image.id');
      internalModel.setId(id);
      internalModel.adapterDidCommit();
    });
  }
});

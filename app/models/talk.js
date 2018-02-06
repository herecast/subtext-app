import Ember from 'ember';
import DS from 'ember-data';
import Content from 'subtext-ui/mixins/models/content';

const { computed, get, inject:{service}, RSVP } = Ember;

export default DS.Model.extend(Content, {
  api: service(),
  contentId: DS.attr('number'), //TAG:NOTE overridden from the Content model mixin
  listservId: DS.attr('number'), //TAG:NOTE the concept of listservId is applied inconsistently ie., listservId vs listservIds
  listEnabled: computed.notEmpty('listservId'), //TAG:NOTE: make into an array in the serializer? // NOTE this can possibly be replaced with a helper

  // NOTE:this model does not have 'authorId'
  // NOTE:this model does not have 'comments'
  // NOTE:this model does not have 'updatedAt'
  // parentContentRoute: '' //TAG:DELETED
  // initialCommentAuthor: DS.attr('string'), //TAG:DELETED
  // initialCommentAuthorImageUrl: DS.attr('string'), //TAG:DELETED
  // authorName: DS.attr('string'), // TAG:MOVED
  // commentCount: DS.attr('number'), //TAG:MOVED
  // content: DS.attr('string'), //TAG:MOVED
  // imageUrl: DS.attr('string'), //TAG:MOVED
  // NOTE:this model does not have 'listservIds'
  // publishedAt: DS.attr('moment-date', {defaultValue: moment()}), //TAG:MOVED
  // title: DS.attr('string'), //TAG:MOVED
  // organization: DS.belongsTo('organization'), //TAG:MOVED
  // ugcJob: DS.attr('string'), //TAG:MOVED
  // viewCount: DS.attr('number'), //TAG:MOVED
  // parentContentId: DS.attr('number'), //TAG:MOVED
  // parentContentType: DS.attr('string'), //TAG:MOVED
  // parentEventInstanceId: DS.attr('number'), //TAG:MOVED
  // imageWidth: DS.attr('string'), //TAG:MOVED
  // imageHeight: DS.attr('string'), //TAG:MOVED

  uploadImage() {
    if (get(this, 'image')) {
      const api = get(this, 'api');
      const data = new FormData();

      data.append('talk[image]', get(this, 'image'));

      return api.updateTalkImage(get(this, 'id'), data);
    }
  },

  save() {
    return this._super().then((saved) => {
      return new RSVP.Promise((resolve, reject) => {
        if (saved.get('image')) {
          saved.uploadImage().then(()=>{
            resolve(saved);
          }, reject);
        } else {
          resolve(saved);
        }
      });
    });
  }
});

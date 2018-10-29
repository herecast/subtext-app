import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';

export default Mixin.create({
  actions: {
    reloadComments(newComment) {
      get(this, 'model').incrementProperty('commentCount');
      get(this, 'model.comments').insertAt(0, newComment);
    }
  }
});

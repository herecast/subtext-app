import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  isDisabled: Ember.computed.empty('newComment'),

  actions: {
    postComment(content) {
      const comment = this.store.createRecord('comment', {
        eventInstanceId: this.get('eventInstanceId'),
        content: content
      });

      comment.save().then((comment) => {
        const nestedComment = Ember.Object.create({
          id: comment.get('id'),
          posted_at: moment().toISOString(),
          content: content,

          // TODO: This will be replaced by the current user's first name
          // when we have authentication added.
          user_name: faker.name.findName()
        });

        if (!this.get('comments')) {
          this.set('comments', []);
        }

        this.get('comments').pushObject(nestedComment);

        this.set('newComment', null);
        this.sendAction('afterPost');
      });
    }
  }
});

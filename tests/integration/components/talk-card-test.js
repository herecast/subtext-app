import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('talk-card', 'Integration | Component | Talk Card', {
  integration: true
});


test('When Talk comments has comments, it has a stacked state class. Otherwise it does not', function(assert){
  assert.expect(2);
  let talk = Ember.Object.create({
    commentCount: 1
  });
  
  this.set('talk',talk);
  
  this.render(hbs`{{component 'talk-card' class='TalkCard' talk=talk}}`);
  
  let $TalkCard = this.$('.TalkCard');
  
  assert.equal($TalkCard.hasClass('TalkCard--stacked'), true, 'Has stacked modifier class');
  
  // Part two
  this.set('talk.commentCount',0);
  assert.equal($TalkCard.hasClass('TalkCard--stacked'), false, 'Does not have stacked modifier class');
  
});

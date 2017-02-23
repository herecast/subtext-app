import Ember from 'ember';
import { moduleForComponent, test, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('talk-details-inline-edit', 'Integration | Component | talk details inline edit', {
  integration: true
});

test('title', function(assert) {

  const talk = Ember.Object.create({
    title: 'A fine talk title'
  });
  this.set('talk', talk);

  this.render(hbs`{{talk-details-inline-edit model=talk}}`);

  const $title = this.$('[data-test-component="talk-title"]');
  assert.ok(
    $title.text().indexOf( talk.get('title') ) > -1,
    "Displays title"
  );

  $title.find('[data-test-action="toggle-edit"]').click();

  $title.find('input').val('Title 2').trigger('change');

  assert.equal(talk.get('title'), 'Title 2',
    "editing title field persists to model"
  );

});

test('description-display', function(assert) {
  const talk = Ember.Object.create({
    content: '<b>A fine talk description</b>'
  });
  this.set('talk', talk);

  this.render(hbs`{{talk-details-inline-edit model=talk}}`);

  const $desc = this.$('[data-test-component="talk-content"]');
  assert.ok(
    $desc.html().indexOf( talk.get('content') ) > -1,
    "Displays content"
  );

});
// Can't test summernote
skip('description-editing');

test('image', function(assert) {
  const talk = Ember.Object.create({
    imageUrl: 'http://test.it/jpg'
  });
  this.set('talk', talk);

  this.render(hbs`{{talk-details-inline-edit model=talk}}`);

  const $imgComponent = this.$('[data-test-component="image-upload-tile"]');

  assert.equal(
    $imgComponent.length, 1,
    "embeds image-upload-tile component"
  );

  assert.ok(
    $imgComponent.find(`img[src="${talk.get('imageUrl')}"]`).length > 0,
    "image is properly bound"
  );
});

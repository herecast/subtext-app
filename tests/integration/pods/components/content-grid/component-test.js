import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForComponent('content-grid', 'Integration | Component | content grid', {
  integration: true
});

/**
 * The intention is for this to be expanded to encompass multiple content types using
 * content-card.  However, MVP is news only for its primary use case.
 *
 * @TODO: update component to render appropriate content cards.
 */

test('Given news items, it renders matching news-cards', function(assert) {
  assert.expect(4);

  let news = [
    {id: 1, title: 'article 1'},
    {id: 2, title: 'article 2'},
    {id: 3, title: 'article 3'}
  ];

  this.set('news', news);

  this.render(hbs`{{content-grid model=news}}`);

  let $newsCards = this.$(testSelector('news-card'));
  assert.ok($newsCards.length > 0, "News Cards exist");

  news.forEach((item)=>{
    var $card = $newsCards.filter(testSelector('news-card', item.title));
    assert.ok($card.length > 0, "News card for item exists");
  });
});

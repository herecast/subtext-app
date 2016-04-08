import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | market/show');

test('visiting /market/:id', function(assert) {
  const marketPost = server.create('market-post');
  const url = '/market/' + marketPost.id;

  visit(url);

  andThen(function() {
    assert.equal(currentURL(), url);
    assert.equal(find(testSelector('market-title')).text(), marketPost.title, 'it should show the title');
    assert.equal(find(testSelector('market-content')).text(), marketPost.content, 'it should show the content');
    assert.equal(find(testSelector('market-price')).first().text(), marketPost.price, 'it should show the price');
  });

  // TODO investigate why testing market contact info is failing
  //click(testSelector('market-reply-button'));
  //andThen(function() {
  //  assert.equal(find(testSelector('market-contact-email')).length, 1, 'it should show the contact email');
  //  assert.equal(find(testSelector('market-contact-phone')).length, 1, 'it should show the contact phone');
  //});
});

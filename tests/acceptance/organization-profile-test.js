import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | organization profile');

test('Displays organization info', function(assert) {
  const organization = server.create('organization', {
    logo: 'http://placehold.it/200x200',
    name: 'Foo Blog',
    description: 'A blog about foo, and bar; and how they came to be.'
  });
  visit(`/organizations/${organization.id}`);

  andThen(function() {
    let element;

    // Logo/Image
    element = find(testSelector('organization-image'));
    assert.equal(
      element.attr('src'),
      organization.logo,
      "Organization Logo");

    // Name
    element = find(testSelector('organization-name'));
    assert.equal(
      element.text().trim(),
      organization.name,
      "Organization Name");

    // Description
    element = find(testSelector('organization-description'));
    assert.equal(
      element.html().trim(),
      organization.description.trim(),
      "Organization Description");
  });
});

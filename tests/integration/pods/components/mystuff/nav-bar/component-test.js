import { moduleForComponent, test } from 'ember-qunit';
import testSelector from 'ember-test-selectors';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('mystuff/nav-bar', 'Integration | Component | mystuff/nav bar', {
  integration: true
});

test('it renders', function(assert) {
  const activeRoute = {
    order: 0,
    routeName: 'mystuff.contents.index',
    title: 'Contents',
    iconActive: 'window-maximize',
    iconInactive: 'window-maximize'
  };

  const routeObjects = [
    activeRoute,
    {
      order: 1,
      routeName: 'mystuff.comments.index',
      title: 'Comments',
      iconActive: 'comments',
      iconInactive: 'comments-o'
    }
  ];

  this.set('routeObjects', routeObjects);
  this.set('activeRoute', activeRoute);

  this.render(hbs`{{mystuff/nav-bar
    routes=routeObjects
    activeRoute=activeRoute
  }}`);

  assert.equal(this.$(testSelector('button')).length, 2, 'Should show the correct number of route objects in nav bar');
  assert.ok(this.$(testSelector('button', 'Contents')).hasClass('active'), 'Active Route should have active class');
});

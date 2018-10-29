import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';

module('Integration | Component | mystuff/nav bar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
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

    await render(hbs`{{mystuff/nav-bar
      routes=routeObjects
      activeRoute=activeRoute
    }}`);

    assert.equal(this.element.querySelectorAll('[data-test-button]').length, 2, 'Should show the correct number of route objects in nav bar');
    assert.ok($(this.element).find('[data-test-button="Contents"]').hasClass('active'), 'Active Route should have active class');
  });
});

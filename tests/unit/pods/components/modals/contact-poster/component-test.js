import sinon from 'sinon';
import Service from '@ember/service';

import { module, test } from 'qunit';

import { setupTest } from 'ember-qunit';

module('Unit | Component | modals/contact poster', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    const mockTrackingService = Service.extend({ push: sinon.spy()});

    this.owner.register('service:tracking', mockTrackingService );
    this.tracking = this.owner.lookup('service:tracking');
  });

  test('it renders', function(assert) {
    assert.expect(3);

    const model = {
      publishedAt: {
        format() {
          return `Some date in the not so distant future`;
        }
      },
      authorName: `Billie-Joe Nelson`,
      content: `Some nonsense goes here`,
      contactEmail:`Billie@OKCoral.com`,
      title: `This is NO JOKE`,
      contactPhone: `555-555-5555`
    };

    // Creates the component instance
    let component = this.owner.factoryFor('component:modals/contact-poster').create({ model });

    assert.ok(component.mailToParts.subject.includes(encodeURI(model.title)), 'Email has model title.');
    assert.ok(component.mailToParts.to.includes(model.contactEmail), 'Email is going to the right person');
    assert.ok(component.mailToParts.body.includes(encodeURI(model.content)), 'Email contains the right subject.');

  });
});

/* global sinon */
import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

const { Service } = Ember;

moduleForComponent('modals/contact-poster', 'Unit | Component | modals/contact poster', {
  // Specify the other units that are required for this test
  needs: ['component:modal-wrapper'],
  unit: true,

  beforeEach() {
    const mockTrackingService = Service.extend({ push: sinon.spy()});

    this.register('service:tracking', mockTrackingService );
    this.inject.service('tracking');
  }
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
  let component = this.subject({ model });

  assert.ok(component.mailToParts.subject.includes(encodeURI(model.title)), 'Email has model title.');
  assert.ok(component.mailToParts.to.includes(model.contactEmail), 'Email is going to the right person');
  assert.ok(component.mailToParts.body.includes(encodeURI(model.content)), 'Email contains the right subject.');

});

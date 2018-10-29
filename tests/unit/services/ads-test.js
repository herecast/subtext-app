import EmberObject from '@ember/object';
import RSVP from 'rsvp';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | ads', function(hooks) {
  setupTest(hooks);

  test('getAd - called once', function(assert) {
    let done = assert.async();
    assert.expect(1);

    let apiMock = EmberObject.create({
      getContentPromotions() {
        return RSVP.resolve({
          promotions: [
            {
              id: 1
            }
          ]
        });
      }
    });

    let service = this.owner.factoryFor('service:ads').create({
      api: apiMock
    });

    service.getAd('test.test').then((promo)=>{
      assert.equal(promo.id, 1,
        "Gets promotion from api index endpoint"
      );
      done();
    });
  });

  test('getAd - called multiple times, same context', function(assert) {
    let apiCalls = 0;

    assert.expect(4);

    let apiMock = EmberObject.create({
      getContentPromotions(options) {
        assert.equal(options.limit, 2,
          "It specifies limit in the api request equal to number of getAd requests"
        );

        apiCalls++;

        return RSVP.resolve({
          promotions: [
            {
              id: 1
            },
            {
              id: 2
            }
          ]
        });
      }
    });

    let service = this.owner.factoryFor('service:ads').create({
      api: apiMock
    });

    service.createContext('test1');

    return RSVP.all([
      service.getAd('test1').then((promo)=>{
        assert.equal(promo.id, 1,
          "First call, results in first returned ad"
        );
        return promo;
      }),

      service.getAd('test1').then((promo)=>{
        assert.equal(promo.id, 2,
          "Second call, results in second returned ad"
        );
        assert.equal(apiCalls, 1, "It coalesces the api requests");
        return promo;
      })
    ]);
  });

  test('getAd - additional calls, after initial api request. Same context', function(assert) {
    let done = assert.async();

    let apiCalls = 0;

    const returnData = [
      [
        // First api request
        {id: 1},
        {id: 2}
      ],
      [
        // 2nd api request
        {id: 3}
      ]
    ];

    assert.expect(8);

    let apiMock = EmberObject.create({
      getContentPromotions(options) {
        let data = returnData[apiCalls];
        apiCalls++;

        if(apiCalls === 2) {
          // 2nd api request
          assert.deepEqual(options.exclude, [1,2],
            "Sends exclude parameter for previously fetched ads"
          );
          assert.equal(options.limit, 1,
            "Sends proper limit parameter"
          );
        } else {
          assert.equal(options.limit, 2,
            "Sends proper limit parameter"
          );
        }

        return RSVP.resolve({
          promotions: data
        });
      }
    });

    let service = this.owner.factoryFor('service:ads').create({
      api: apiMock
    });

    service.createContext('test2');

    return RSVP.all([
      service.getAd('test2').then((promo)=>{
        assert.equal(promo.id, 1,
          "First call, results in first returned ad"
        );
      }),

      service.getAd('test2').then((promo)=>{
        assert.equal(promo.id, 2,
          "Second call, results in second returned ad"
        );
        assert.equal(apiCalls, 1, "It coalesces the api requests");
        return promo;
      })
    ]).then( () => {
      service.getAd('test2').then((promo) => {
        assert.equal(apiCalls, 2);
        assert.equal(promo.id, 3);

        done();
        return promo;
      });
    });
  });
});

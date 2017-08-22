import Ember from 'ember';
import DS from 'ember-data';

const {
  get,
  set,
  computed,
  setProperties,
  Mixin
} = Ember;

export default Mixin.create({
  contentLocations: DS.hasMany(),
  baseLocations: computed.filterBy('contentLocations', 'locationType', 'base'),
  baseLocationNames: computed.mapBy('baseLocations', 'locationName'),

  // First base location detected
  baseLocation: computed('_changedContentLocations.@each.locationType', 'contentLocations.@each.locationType', function() {
    const changes = get(this, '_changedContentLocations');
    let base;

    if(get(changes, 'length')) {
       base = changes.findBy('locationType', 'base');
    } else {
      base = get(this, 'contentLocations').findBy('locationType', 'base');
    }

    return (base ? get(base, 'location') : null);
  }),

  promotedLocations: computed('_changedContentLocations.[]', 'contentLocations.[]', function() {
    const changes = get(this, '_changedContentLocations');

    if(get(changes, 'length')) {
      return changes.mapBy('location');
    } else {
      return get(this, 'contentLocations').mapBy('location');
    }
  }),

  _changedContentLocations: [],
  changeContentLocations(newContentLocations) {
    this.resetContentLocationChanges();
    set(this, '_changedContentLocations', newContentLocations);
  },

  resetContentLocationChanges() {
    // Remove duplicate records from store, we don't need them anymore.
    get(this, '_changedContentLocations').forEach((cl) => {
      cl.unloadRecord();
    });

    setProperties(this, {
      _changedContentLocations: []
    });
  },

  persistContentLocationChanges() {
    const newContentLocations = get(this, '_changedContentLocations');

    return get(this, 'contentLocations').then((existingContentLocations) => {
      const toRemove = [];
      let grouped = {};

      existingContentLocations.forEach((existing) => {
        if(!newContentLocations.mapBy('location.id').includes(get(existing, 'location.id'))) {
          // lets queue this for removal, not in new content location list
          toRemove.pushObject(existing);
        } else {
          // Lets build up a grouped structure to check for duplicates
          const locationId = get(existing, 'location.id');
          grouped[ locationId ] = grouped[ locationId ] || [];
          grouped[ locationId ].pushObject(existing);
        }
      });

      // Check for duplicate locations
      Object.keys(grouped).forEach((key) => {
        if(grouped[key].length > 1) {
          // Duplicates, lets remove all but first.
          grouped[key].forEach((duplicate, index) => {
            if(index > 0) {
              toRemove.pushObject(duplicate);
              existingContentLocations.removeObject(duplicate);
            }
          });
        }
      });

      newContentLocations.map((cl) => {
        const existing = existingContentLocations.findBy('location.id', get(cl, 'location.id'));

        if(existing) {
          setProperties(existing, {
            locationType: get(cl, 'locationType')
          });
        } else {
          existingContentLocations.pushObject(cl);
        }
      });

      if(toRemove.length) {
        get(this, 'contentLocations').removeObjects(toRemove);

        toRemove.invoke('destroyRecord');
      }
    });
  },

  save() {
    // need to create a closure reference for the 
    // async behavior following.
    const superSave = this._super.bind(this);

    return this.persistContentLocationChanges().then(() => {
      return superSave().then((model) => {

        this.resetContentLocationChanges();

        return model;
      });
    });
  }
});

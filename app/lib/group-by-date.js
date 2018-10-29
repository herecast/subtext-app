import { A } from '@ember/array';
import { copy } from '@ember/object/internals';
import EmberObject, { get, set } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';
import moment from 'moment';

// Used to generate a collection of records that is grouped by a specified
// date attribute.
function buildGroup(records, storedGroups, dateAttr, displayFormat, convertDate) {
  const groups = !isEmpty(storedGroups) ? copy(storedGroups) : new A();

  if (!isEmpty(records)) {

    records.forEach((record, index) => {
      const recordNotYetGrouped = isEmpty(storedGroups) || isEmpty(get(record, 'indexInFullSetOfRecords'));

      if (recordNotYetGrouped) {
        const date = record.get(dateAttr);
        const value = convertDate(date);
        let group = groups.findBy('value', value);

        set(record, 'indexInFullSetOfRecords', index);

        if (isPresent(group)) {
          get(group, 'items').pushObject(record);
        } else {
          // When viewing a single day, the value will be the hour of the day.
          // When viewing events across multiple days, the value is the date.
          const sortValue = parseInt(value) === value ? value : moment(value).unix();

          group = EmberObject.create({
            value: value,
            sortValue: sortValue,
            displayValue: date.format(displayFormat),
            paramValue: date.format('YYYY-MM-DD'),
            items: [record]
          });

          groups.push(group);
        }
      }
    });
  }

  return groups.sortBy('sortValue');
}

export {
  buildGroup
};

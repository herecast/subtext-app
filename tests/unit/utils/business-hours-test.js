import businessHours from '../../../utils/business-hours';
import { module, test } from 'qunit';

module('Unit | Utility | business hours');

/***********************************
 * Deserialize
 */

/*** deserialized format:
 * {
 *   Monday: {
 *     open: '9:00',
 *     close: '17:00'
 *   },
 *   Tuesday: {
 *     open: '9:00',
 *     close: '17:00'
 *   }
 * }
 */
test('deserialize [Mo|9:00-17:00, Tu|8:00-16:00]', function(assert) {
  const result = businessHours.deserialize(['Mo|9:00-17:00', 'Tu|8:00-16:00']);

  assert.equal(result['Monday']['open'], '9:00');
  assert.equal(result['Monday']['close'], '17:00');

  assert.equal(result['Tuesday']['open'], '8:00');
  assert.equal(result['Tuesday']['close'], '16:00');
});

test('deserialize [Mo-Fr|9:00-17:00]', function(assert) {
  const result = businessHours.deserialize(['Mo-Fr|9:00-17:00']);
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const open = '9:00';
  const close = '17:00';

  assert.expect(dayNames.length * 2);

  dayNames.forEach( (day)=> {
    assert.equal(result[day]['open'], open);
    assert.equal(result[day]['close'], close);
  });
});

test('deserialize [Mo-Fr|9:00-17:00, Sa|10:30-14:30, Su|11:00-13:00]', function(assert) {
  const result = businessHours.deserialize([
    'Mo-Fr|9:00-17:00',
    'Sa|10:30-14:30',
    'Su|11:00-13:00'
  ]);
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const open = '9:00';
  const close = '17:00';
  assert.expect(dayNames.length * 2 + 4);

  dayNames.forEach( (day)=> {
    assert.equal(result[day]['open'], open);
    assert.equal(result[day]['close'], close);
  });

  assert.equal(result['Sunday']['open'], '11:00');
  assert.equal(result['Sunday']['close'], '13:00');

  assert.equal(result['Saturday']['open'], '10:30');
  assert.equal(result['Saturday']['close'], '14:30');
});

test('deserialize [Mo-Fr|9:00-17:00, Sa-Su|10:30-14:30]', function(assert) {
  const result = businessHours.deserialize([
    'Mo-Fr|9:00-17:00',
    'Sa-Su|10:30-14:30'
  ]);
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const open = '9:00';
  const close = '17:00';
  assert.expect(dayNames.length * 2 + 4);

  dayNames.forEach( (day)=> {
    assert.equal(result[day]['open'], open);
    assert.equal(result[day]['close'], close);
  });

  assert.equal(result['Saturday']['open'], '10:30');
  assert.equal(result['Saturday']['close'], '14:30');

  assert.equal(result['Sunday']['open'], '10:30');
  assert.equal(result['Sunday']['close'], '14:30');
});

/***********************************
 * Serialize
 */

test('serialize Monday - Wednesday, 8:00-17:30', function(assert) {
  const data = {
    Monday: {
      open: '8:00',
      close: '17:30'
    },
    Tuesday: {
      open: '8:00',
      close: '17:30'
    },
    Wednesday: {
      open: '8:00',
      close: '17:30'
    }
  };
  const result = businessHours.serialize(data);
  assert.deepEqual(result, ['Mo-We|8:00-17:30']);
});

test('serialize Monday - Friday, 9:00 - 17:00; Saturday 9:00 - 15:00', function(assert) {
  const data = {
    Monday: {
      open: '9:00',
      close: '17:00'
    },
    Tuesday: {
      open: '9:00',
      close: '17:00'
    },
    Wednesday: {
      open: '9:00',
      close: '17:00'
    },
    Thursday: {
      open: '9:00',
      close: '17:00'
    },
    Friday: {
      open: '9:00',
      close: '17:00'
    },
    Saturday: {
      open: '9:00',
      close: '15:00'
    }
  };

  const result = businessHours.serialize(data);
  assert.deepEqual(result, ['Mo-Fr|9:00-17:00','Sa|9:00-15:00']);

});

test('serialize Monday - Friday, 9:00 - 17:00; Saturday - Sunday 9:00 - 15:00', function(assert) {
  const data = {
    Monday: {
      open: '9:00',
      close: '17:00'
    },
    Tuesday: {
      open: '9:00',
      close: '17:00'
    },
    Wednesday: {
      open: '9:00',
      close: '17:00'
    },
    Thursday: {
      open: '9:00',
      close: '17:00'
    },
    Friday: {
      open: '9:00',
      close: '17:00'
    },
    Saturday: {
      open: '9:00',
      close: '15:00'
    },
    Sunday: {
      open: '9:00',
      close: '15:00'
    }
  };

  const result = businessHours.serialize(data);
  assert.deepEqual(result, ['Mo-Fr|9:00-17:00','Sa-Su|9:00-15:00']);
});

test('serialize Monday - Wednesday, 9:00 - 17:00; Thursday 9:00 - 12:00; Friday - Saturday 9:00 - 17:00', function(assert) {
  const data = {
    Monday: {
      open: '9:00',
      close: '17:00'
    },
    Tuesday: {
      open: '9:00',
      close: '17:00'
    },
    Wednesday: {
      open: '9:00',
      close: '17:00'
    },
    Thursday: {
      open: '9:00',
      close: '12:00'
    },
    Friday: {
      open: '9:00',
      close: '17:00'
    },
    Saturday: {
      open: '9:00',
      close: '17:00'
    }
  };

  const result = businessHours.serialize(data);
  assert.deepEqual(result, ['Mo-We|9:00-17:00','Th|9:00-12:00','Fr-Sa|9:00-17:00']);
});

test('serialize Sunday - Wednesday, 8:00-17:30; Friday, 9:00-12:00; Saturday, 8:00-12:00', function(assert) {
  const data = {
    Sunday: {
      open: '8:00',
      close: '17:30'
    },
    Monday: {
      open: '8:00',
      close: '17:30'
    },
    Tuesday: {
      open: '8:00',
      close: '17:30'
    },
    Wednesday: {
      open: '8:00',
      close: '17:30'
    },
    Friday: {
      open: '9:00',
      close: '12:00'
    },
    Saturday: {
      open: '8:00',
      close: '12:00'
    }
  };
  const result = businessHours.serialize(data);
  assert.deepEqual(result, ['Su-We|8:00-17:30','Fr|9:00-12:00','Sa|8:00-12:00']);
});

test('serialize Sunday, 8:00-17:30; Monday - Wednesday, 9:00-12:00; Friday, 9:00-12:00; Saturday, 8:00-12:00', function(assert) {
  const data = {
    Sunday: {
      open: '8:00',
      close: '17:30'
    },
    Monday: {
      open: '9:00',
      close: '12:00'
    },
    Tuesday: {
      open: '9:00',
      close: '12:00'
    },
    Wednesday: {
      open: '9:00',
      close: '12:00'
    },
    Friday: {
      open: '9:00',
      close: '12:00'
    },
    Saturday: {
      open: '8:00',
      close: '12:00'
    }
  };
  const result = businessHours.serialize(data);
  assert.deepEqual(result, ['Su|8:00-17:30','Mo-We|9:00-12:00','Fr|9:00-12:00','Sa|8:00-12:00']);
});

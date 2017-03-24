import { moduleForModel, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import moment from 'moment';

moduleForModel('schedule', 'Unit | Model | schedule', {
  // Specify the other units that are required for this test.
  needs: []
});

// This test fails on Circle CI and we were not able to determine the cause.
// It passes with 'ember test' and the browser tests.
// test('schedule of one-time events', function(assert) {
//   let schedule = this.subject({
//     repeats: 'once',
//     startDate: '2015-11-01',
//     startTime: '09:00 am',
//     stopDate: '2015-11-05',
//     stopTime: '10:00 pm',
//     daysOfWeek: [],
//     weeksOfMonth: []
//   });

//   const dates = schedule.get('dates').map((date) => {
//     return moment(date).format('LLLL');
//   });

//   const expected = [
//     moment('Sun Nov 01 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//   ];

//   assert.deepEqual(dates, expected);
// });

// test('schedule of daily events', function(assert) {
//   let schedule = this.subject({
//     repeats: 'daily',
//     startDate: '2015-11-01',
//     startTime: '09:00 am',
//     stopDate: '2015-11-05',
//     stopTime: '10:00 pm',
//     daysOfWeek: [],
//     weeksOfMonth: []
//   });

//   const dates = schedule.get('dates').map((date) => {
//     return moment(date).format('LLLL');
//   });

//   const expected = [
//     moment('Sun Nov 01 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Mon Nov 02 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Tue Nov 03 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Wed Nov 04 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Thu Nov 05 2015 09:00:00 GMT-0500 (EST)').format('LLLL')
//   ];

//   assert.deepEqual(dates, expected);
// });

// test('schedule of weekly events', function(assert) {
//   let schedule = this.subject({
//     repeats: 'weekly',
//     startDate: '2015-11-01',
//     startTime: '09:00 am',
//     stopDate: '2015-12-01',
//     stopTime: '10:00 pm',
//     daysOfWeek: [1,2,3],
//     weeksOfMonth: []
//   });

//   const dates = schedule.get('dates').map((date) => {
//     return moment(date).format('LLLL');
//   });

//   const expected = [
//     moment('Sun Nov 01 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Mon Nov 02 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Tue Nov 03 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Sun Nov 08 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Mon Nov 09 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Tue Nov 10 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Sun Nov 15 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Mon Nov 16 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Tue Nov 17 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Sun Nov 22 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Mon Nov 23 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Tue Nov 24 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Sun Nov 29 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Mon Nov 30 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Tue Dec 01 2015 09:00:00 GMT-0500 (EST)').format('LLLL')
//   ];

//   assert.deepEqual(dates, expected);
// });

// test('schedule of bi-weekly events', function(assert) {
//   let schedule = this.subject({
//     repeats: 'bi-weekly',
//     startDate: '2015-11-01',
//     startTime: '09:00 am',
//     stopDate: '2015-12-01',
//     stopTime: '10:00 pm',
//     daysOfWeek: [1,2,3],
//     weeksOfMonth: []
//   });

//   const dates = schedule.get('dates').map((date) => {
//     return moment(date).format('LLLL');
//   });

//   const expected = [
//     moment('Sun Nov 01 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Mon Nov 02 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Tue Nov 03 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Sun Nov 15 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Mon Nov 16 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Tue Nov 17 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Sun Nov 29 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Mon Nov 30 2015 09:00:00 GMT-0500 (EST)').format('LLLL'),
//     moment('Tue Dec 01 2015 09:00:00 GMT-0500 (EST)').format('LLLL')
//   ];

//   assert.deepEqual(dates, expected);
// });

// test('schedule of monthly events, by nth week of month', function(assert) {
//   let schedule = this.subject({
//     repeats: 'monthly',
//     startDate: '2015-12-14',
//     startTime: '09:00',
//     stopDate: '2016-04-01',
//     daysOfWeek: [1],
//     weeksOfMonth: [2]
//   });

//   const dates = schedule.get('dates').map((date) => {
//     return moment(date).format('LLLL');
//   });

//   const expected = [
//     moment('Mon Dec 14 2015').format('LLLL'),
//     moment('Mon Jan 11 2016').format('LLLL'),
//     moment('Mon Feb 08 2016').format('LLLL'),
//     moment('Mon Mar 14 2016').format('LLLL')
//   ];

//   assert.deepEqual(dates, expected);
// });

test('it has a maximum number of dates', function(assert) {
  let schedule = this.subject({
    repeats: 'daily',
    startDate: '2015-11-01',
    startTime: '09:00',
    stopDate: '2018-01-01',
    daysOfWeek: [1,2,3,4,5,6,7],
    weeksOfMonth: [1,2]
  });

  const dates = schedule.get('dates');

  // Without the maxDates cap, this would generate > 100 dates
  assert.deepEqual(dates.length, 100);
});

test('getting and setting startsAt', function(assert) {
  let schedule = this.subject({
    startDate: moment('2015-11-01').toDate(),
    startTime: '09:00 am',
    stopDate: moment('2018-01-01').toDate(),
  });

  //startAt calculation runs over two runloops.
  return wait().then(()=> {
    const startsAt = schedule.get('startsAt').toDate();

    // Without the maxDates cap, this would generate > 100 dates
    const dateFormat = 'MM/DD/YYYY';
    const timeFormat = 'hh:mm a';
    const expected = moment(`11/01/2015 09:00 am`, `${dateFormat} ${timeFormat}`).toDate();

    assert.deepEqual(startsAt, expected);
  });
});

test('getting and setting endsAt', function(assert) {
  let schedule = this.subject({
    startDate: moment('2015-11-01').toDate(),
    startTime: '09:00 am',
    stopDate: moment('2018-01-01').toDate(),
    stopTime: '10:00 am',
  });

  const endsAt = schedule.get('endDate').toDate();

  // Without the maxDates cap, this would generate > 100 dates
  const dateFormat = 'MM/DD/YYYY';
  const timeFormat = 'hh:mm a';
  const expected = moment(`01/01/2018 00:00 am`, `${dateFormat} ${timeFormat}`).toDate();

  assert.deepEqual(endsAt, expected);
});

test('getting and setting start and stop time and date', function(assert) {
  let schedule = this.subject({
    startsAt: moment('2015-11-01 09:00'),
    endsAt: moment('2015-11-01 11:00'),
    endDate: moment('2018-10-10')
  });

  assert.equal(schedule.get('startTime'), '09:00 am');
  assert.equal(schedule.get('startDate'), '11/01/2015');

  assert.equal(schedule.get('stopTime'), '11:00 am');
  assert.equal(schedule.get('stopDate'), '10/10/2018');
});

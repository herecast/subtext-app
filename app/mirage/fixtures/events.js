/*
  This is an example. This data will be added to the db
  under the `contacts` key.

  Create more files in this directory to add more data.
*/
export default [
  {
    id: 1,
    title: 'Northern Stage presents: Songs for a New World, by Jason Robert Brown, co-directed by Carol Dunne and Lillian King',
    subtitle: 'Running April 8-May 3',
    description: 'Join Northern Stage for our final production in the Briggs Opera House - Songs for a New World: A stunning song cycle/musical revue by Broadway wonder Jason Robert Brown (The Bridges of Madison County, Parade) that loosely tells the story of people searching for a new beginning. Brown transports his audience from the deck of a Spanish sailing ship to a ledge 57 stories above Fifth Avenue to meet a startling array of characters. With a small, powerhouse cast and an exquisitely crafted score, Songs for a New World is a perfect way to bring the next generation into the theater.',
    ticket_type: 'paid',
    cost: '$15-$55',
    contact_name: '', // blank for this event ?
    contact_phone: '802-296-7000',
    contact_email: 'boxoffice@northernstage.org',
    url: 'http://northernstage.org/',
    venue_name: 'Briggs Opera House',
    address: '5 South Main Street',
    city: 'White River Junction',
    state: 'VT',
    zip: '05001',
    starts_at: "2014-11-11T08:00:00.000Z",
    ends_at: "2014-11-11T12:00:00.000Z",
    photo_url_small: "https://aws.api/small-photo.jpg",
    other_dates: [
      {
      starts_at: "2014-11-11T08:00:00.000Z",
      ends_at: "2014-11-11T12:00:00.000Z"
    },
    {
      starts_at: "2014-11-11T08:00:00.000Z",
      ends_at: "2014-11-11T12:00:00.000Z"
    }
    ]
  }
];

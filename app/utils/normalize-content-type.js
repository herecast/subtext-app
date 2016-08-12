export default function normalizeContentType(originalType) {
  let normalizedType;

  if (originalType === 'market-post' || originalType === 'market' || originalType === 'market_post') {
    normalizedType = 'market-post';
  } else if (originalType === 'event' || originalType === 'event-instance' || originalType === 'event_instance') {
    normalizedType = 'event-instance';
  } else if (originalType === 'talk' || originalType === 'talk_of_the_town') {
    normalizedType = 'talk';
  } else if (originalType === 'news') {
    normalizedType = 'news';
  } else {
    normalizedType = originalType;
  }

  return normalizedType;
}

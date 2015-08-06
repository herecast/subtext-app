function generateData(count, template) {
  const records = [];

  for (let i = 1; i < count; i += 1) {
    records.push(template(i));
  }

  return records;
}

function titleize(words) {
  return words.split(' ').map((word) => {
    return word.capitalize();
  }).join(' ');
}

export {
  generateData,
  titleize
};

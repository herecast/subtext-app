// taken from Stack Overflow answer here: http://stackoverflow.com/a/3426956/2802660
import { isPresent } from '@ember/utils';

function hashCode(str) {
  let hash = 0;

  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return hash;
}

function intToRGB(i){
  const c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

export default function hexColorFromString(str) {
  return isPresent(str) ? `#${intToRGB(hashCode(str))}` : '#FFA382';// talk channel brand color
}

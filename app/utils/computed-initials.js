export default function computedInitials(str='') {
  const initials = str.match(/\b\w/g) || [];

  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
}

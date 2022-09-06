export default function _debounce(
  fn,
  delay,
  immediate = false,
  context = this
) {
  let timer;
  return function (...args) {
    immediate && !timer && fn.apply(context, args);
    clearTimeout(timer);
    timer = setTimeout(() => {
      !immediate && fn.apply(context, args);
      timer = null;
    }, delay);
  };
}

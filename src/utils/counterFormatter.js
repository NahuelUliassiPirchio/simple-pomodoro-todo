export default function formatCounter (counter) {
  return counter < 10 ? `0${counter}` : counter
}

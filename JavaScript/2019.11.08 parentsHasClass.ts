export default className => node => {
  if (typeof className === 'string' && className.indexOf(' ') === -1) {
    while (node) {
      if (node.classList && node.classList.contains(className)) {
        return true
      }
      node = node.parentNode
    }
  }
  return false
}
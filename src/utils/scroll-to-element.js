const offsetY = 100

export const scrollToElement = el => {
  if (el) {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop
    const clientTop =
      document.documentElement.clientTop || document.body.clientTop || 0
    return el.getBoundingClientRect().top + scrollTop - clientTop - offsetY
  }
}

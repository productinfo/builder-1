import vcCake from 'vc-cake'
const API = {
  createKey: () => {
    let uuid = ''

    for (let i = 0; i < 8; i++) {
      let random = Math.random() * 16 | 0
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-'
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
        .toString(16)
    }

    return uuid
  },
  getRealWidth: ($el, $container) => {
    let $tempEl
    let realWidth = 0

    $tempEl = $el.cloneNode(true)
    $tempEl.style.position = 'fixed'

    $container.appendChild($tempEl)

    realWidth = $tempEl.offsetWidth
    if (realWidth === 0) {
      $tempEl.remove()
      return 0
    }
    let style = window.getComputedStyle($tempEl, null)
    realWidth += parseInt(style.marginLeft) + parseInt(style.marginRight)
    $tempEl.remove()
    return realWidth
  },
  addResizeListener: (element, fn) => {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    let obj = element.__resizeTrigger__ = document.createElement('object')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;')
    obj.__resizeElement__ = element
    obj.onload = (e) => {
      obj.contentDocument.defaultView.addEventListener('resize', fn)
    }
    obj.type = 'text/html'
    if (isIE) {
      element.appendChild(obj)
    }
    obj.data = 'about:blank'
    if (!isIE) {
      element.appendChild(obj)
    }
  },
  removeResizeListener: (element, fn) => {
    element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', fn)
    element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__)
  }
}
vcCake.addService('utils', API)

import {addStorage, getService} from 'vc-cake'

import CssBuilder from './lib/cssBuilder'

addStorage('assets', (storage) => {
  const documentManager = getService('document')
  // const assetsManager = getService('assetsManager')
  const stylesManager = getService('stylesManager')
  const assetsManager = getService('assetsManager')
  const assetsStorage = getService('assetsStorage')
  const globalAssetsStorage = assetsStorage.getGlobalInstance()
  const assetsWindow = window.document.querySelector('.vcv-layout-iframe').contentWindow
  const builder = new CssBuilder(globalAssetsStorage, assetsManager, stylesManager, assetsWindow)
  const data = {elements: {}}

  storage.on('addElement', (id) => {
    let ids = Array.isArray(id) ? id : [id]
    ids.forEach((id) => {
      const element = documentManager.get(id)
      data.elements[id] = element
      builder.add(element)
    })
  })
  storage.on('updateElement', (id) => {
    let ids = Array.isArray(id) ? id : [id]
    ids.forEach((id) => {
      const element = documentManager.get(id)
      data.elements[id] = element
      builder.update(element)
    })
  })
  storage.on('removeElement', (id) => {
    let ids = Array.isArray(id) ? id : [id]
    ids.forEach((id) => {
      delete data.elements[id]
      builder.destroy(id)
    })
  })
  storage.on('resetElements', () => {
    globalAssetsStorage.resetElements(Object.keys(documentManager.all()))
  })
})

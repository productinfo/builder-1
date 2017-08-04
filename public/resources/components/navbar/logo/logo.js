import React from 'react'
export default class Logo extends React.Component {
  static propTypes = {
    editor: React.PropTypes.string
  }

  render () {
    let url = 'https://visualcomposer.io/?utm_campaign=vcwb&utm_source=vc-wb-navbar&utm_medium=vc-wb-backend'
    if (this.props.editor === 'frontend') {
      url = 'https://visualcomposer.io/?utm_campaign=vcwb&utm_source=vc-wb-navbar&utm_medium=vc-wb-frontend'
    }

    return (
      <a href={url} className='vcv-ui-navbar-logo' title='Visual Composer Website Builder'>
        <span className='vcv-ui-navbar-logo-title'>Visual Composer Website Builder</span>
      </a>
    )
  }
}

var vcCake = require('vc-cake')
vcCake.add('content-layout', function (api) {
  var $ = require('jquery')
  var domContainer = vcCake.env('platform') === 'wordpress'
  ? $('#vcv-editor', $('#vcv-editor-iframe').get(0).contentWindow.document).get(0)
  : document.getElementById('vcv-editor')
  var React = require('react')
  var ReactDOM = require('react-dom')
  var DataChanged = {
    componentDidMount: function () {
      api.reply('data:changed', function (data) {
        this.setState({ data: data })
      }.bind(this))
    },
    getInitialState: function () {
      return {
        data: []
      }
    }
  }
  var Editor = React.createClass({
    mixins: [ DataChanged ],
    render: function () {
      var data = this.state.data
      return (
        <div className="vc-editor-here">
          <HtmlLayout data={data} api={api}/>
        </div>
      )
    }
  })
  ReactDOM.render(
    <Editor />,
    domContainer
  )
})

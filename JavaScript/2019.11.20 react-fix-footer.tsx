import * as React from 'react'
import * as ReactDOM from 'react-dom'
import classnames from 'classnames'

export default class extends React.Component {
  state = {
    fixFooter: false,
  }

  offsetTop: number
  offsetHeight: number

  componentDidMount() {
    const foundDom = ReactDOM.findDOMNode(this)
    this.offsetTop = foundDom.offsetTop
    this.offsetHeight = foundDom.offsetHeight
    this.handleFooterPosition()
    window.addEventListener('resize', this.handleFooterPosition)
  }

  handleFooterPosition = () => {
    this.setState({ fixFooter: this.offsetHeight + this.offsetTop < window.innerHeight })
  }

  render() {
    const { fixFooter } = this.state
    return <div className={classnames(fixFooter ? 'fixed-footer' : '')}></div>
  }
}
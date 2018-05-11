import * as React from 'react'
// import * as PropTypes from 'prop-types'
import '../styles/Music.scss'

class Music extends React.Component {
  componentDidMount() {

    console.log(this.props)
  }

  render() {
    return (
      <div className="Music">
        Music
      </div>
    )
  }
}

export default Music

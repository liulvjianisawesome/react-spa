import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import List from './List'

class Author extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { match } = this.props

    return (
      <div>
        <Route
          exact
          path={match.url}
          render={() => <List fetch="/authorlist.json" />}
        />
      </div>
    )
  }
}

export default Author

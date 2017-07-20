import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getGenreList } from '_/actions/genre'
import { Route, Switch } from 'react-router-dom'
import Loading from '_/components/comm/Loading'
import List from './List'
import Edit from './Edit'

class Genre extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.renderEdit = this.renderEdit.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(getGenreList())
  }

  renderEdit({ history, match }) {
    const { genre } = this.props

    // 这里没有从服务端获取，而是从list里面获取的单条数据
    const data = genre.data.find(d => d.id == match.params.id)
    return <Edit history={history} data={data} />
  }

  render() {
    const { genre, history, match } = this.props
    const { url } = match

    if (genre.status === 0) {
      return <Loading height={300} />
    }

    if (genre.status === 2) {
      return <div>{genre.message}</div>
    }

    return (
      <Switch>
        <Route path={`${url}/new`} component={Edit} />
        <Route path={`${url}/edit/:id`} render={this.renderEdit} />
        <Route
          path={url}
          render={() => <List history={history} data={genre.data} />}
        />
      </Switch>
    )
  }
}

Genre.propTypes = {
  dispatch: PropTypes.func.isRequired,
  genre: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  const { genre } = state
  return { genre }
}

export default connect(mapStateToProps)(Genre)

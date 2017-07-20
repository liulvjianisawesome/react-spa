import { GENRE_LIST } from '_/actions/genre'

const defaultState = {
  status: 0,
  data: undefined,
}
export default function (state = defaultState, action) {
  switch (action.type) {
    case GENRE_LIST:
      return Object.assign({}, state, {
        status: action.status,
        data: action.data,
        message: action.message,
      })
    default:
      return state
  }
}

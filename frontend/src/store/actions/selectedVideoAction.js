export const SET_SELECTEDVIDEO = 'SET_SELECTEDVIDEO'

export const setSelectedVideoAction = (peerId) => ({
  type: SET_SELECTEDVIDEO,
  payload: peerId,
})
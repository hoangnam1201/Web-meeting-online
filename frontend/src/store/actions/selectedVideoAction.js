export const SELECTEDVIDEO_SET = 'SELECTEDVIDEO_SET'
export const SELECTEDVIDEO_REMOVE = 'SELECTEDVIDEO_REMOVE'

export const setSelectedVideoAction = (peerId) => ({
  type: SELECTEDVIDEO_SET,
  payload: peerId,
})

export const removeSelectedVideoAction = (peerId) => ({
  type: SELECTEDVIDEO_REMOVE,
  payload: peerId,
})
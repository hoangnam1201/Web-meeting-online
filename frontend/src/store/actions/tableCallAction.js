export const TABLE_USERLEAVE = 'TABLE_USERLEAVE';
export const TABLE_USERJOIN = 'TABLE_USERJOIN';
export const TABLE_USERCLEAER = 'TABLE_USERCLEAR';
export const TABLE_CHANGEMEDIA = 'TABLE_CHANGEMEDIA';

export const tableUserLeaveAction = (userId) => {
    return {
        type: TABLE_USERLEAVE,
        payload: userId
    }
}

export const tableUserJoinAction = (streamData) => {
    return {
        type: TABLE_USERJOIN,
        payload: streamData
    }
}

export const tableCallClear = () => {
    return {
        type: TABLE_USERCLEAER
    }
}

export const tableCallChangeMedia = () => {
    return {
        type: TABLE_CHANGEMEDIA
    }
}
export const TABLE_USERLEAVE = 'TABLE_USERLEAVE';
export const TABLE_USERJOIN = 'TABLE_USERJOIN';
export const TABLE_USERCLEAER = 'TABLE_USERCLEAR';
export const TABLE_CHANGEMEDIA = 'TABLE_CHANGEMEDIA';
export const TABLE_PINSTREAM = 'TABLE_PINSTREAM';

export const tableUserLeaveAction = (userId) => {
    return {
        type: TABLE_USERLEAVE,
        payload: userId
    }
}

export const tableSetPinStream = (streamData) => {
    return {
        type: TABLE_PINSTREAM,
        payload: streamData
    }
};

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

export const tableCallChangeMedia = (data) => {
    return {
        type: TABLE_CHANGEMEDIA,
        payload: data
    }
}
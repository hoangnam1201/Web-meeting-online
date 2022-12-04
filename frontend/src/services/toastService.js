import { toast } from "react-toastify";

export const toastText = (text, theme = 'colored') => {
  toast(text, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: theme,
  })
};

export const toastRequest = (name) => {
  toast(`🔔 ${name} requests to join room !`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  })
};

export const toastJoinLeaveRoom = (users, type) => {
  users.forEach(u => {
    toast(`👋 ${u} just ${type === "join" ? 'joined' : 'left'} this room !`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: type === 'join' ? 'colored' : 'dark',
    })
  });
}

export const toastJoinTable = (name) => {
  toast(`🦄 ${name} just joined this table !`, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  })
}

export const toastInfo = (text) => {
  toast.info(`${text}!`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  })
}

export const toastError = (text) => {
  toast.error(text, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  })
}

export const toastWarning = (text) => {
  toast.warning(text, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  })
}

export const toastSuccess = (text) => {
  toast.success(text, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  })
}
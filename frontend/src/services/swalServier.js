import Swal from "sweetalert2";

export const countTime = (title, html, time, callback) => {
    let timerInterval;
    Swal.fire({
        title: title,
        html: html,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timer: time * 1000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            b.textContent = time - 1;
            timerInterval = setInterval(() => {
                b.textContent = Math.trunc(Swal.getTimerLeft() / 1000);
            }, 1000)
        },
        willClose: () => {
            clearInterval(timerInterval);
            callback && callback();
        }
    })
}

export const confirmPresent = (callback) => {
    Swal.fire({
        title: 'Present',
        text: 'Your presentation will start in 8s',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'yes, present'
    }).then((result) => {
        if (result.isConfirmed) {
            callback && callback();
        }
    })
}

export const disconnectSwal = (callback) => {
    Swal.fire({
        title: 'you are disconnected',
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).then((result) => {
        callback && callback();
    })
}


export const confirmSwal = (title, text = '', callback) => {
    Swal.fire({
        title: title,
        text: text,
        showCancelButton: true,
        confirmButtonText: 'yes'
    }).then((result) => {
        if (result.isConfirmed)
            callback && callback();
    })
}
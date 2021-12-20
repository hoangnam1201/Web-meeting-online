import Swal from "sweetalert2";

export const countTime = (time, callback) => {
    let timerInterval;
    Swal.fire({
        title: 'participate presentation',
        html: 'You will participate in presentation <b></b> seconds',
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
            callback();
        }
    })
}

export const disconnectSwal = (callback) => {
    Swal.fire({
        title: 'you are disconnected',
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).then((result) => {
        callback();
    })
}


export const confirmSwal = (title, callback) => {
    Swal.fire({
        title: title,
        showCancelButton: true,
        confirmButtonText: 'yes'
    }).then((result) => {
        if (result.isConfirmed)
            callback();
    })
}
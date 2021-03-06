export default {
    closeVideo(elemId) {
        if (document.getElementById(elemId)) {
            document.getElementById(elemId).remove();
            this.adjustVideoElemSize();
        }
    },

    userMediaAvailable() {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    },

    getUserFullMedia() {
        if (this.userMediaAvailable()) {
            return navigator.mediaDevices.getUserMedia({
                video: true,
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
        } else {
            throw new Error('User media not available');
        }
    },

    shareScreen() {
        if (this.userMediaAvailable()) {
            return navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "always"
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });
        } else {
            throw new Error('User media not available');
        }
    },

    getIceServer() {
        return {
            iceServers: [{
                urls: [
                    'stun:stun.l.google.com:19302',
                    'stun:stun1.l.google.com:19302',
                    'stun:stun2.l.google.com:19302',
                    'stun:stun.l.google.com:19302?transport=udp',
                ]
            }]
        };
    },

    addChat(data, senderType) {
        var newMessage = parseInt(document.getElementById('newMessage').innerHTML) || 0;
        let senderName = 'You';

        if (senderType === 'remote') {
            senderName = data.sender;
            newMessage = newMessage + 1;
            document.getElementById('newMessage').innerHTML = newMessage;
            this.toggleChatBadge(newMessage);
        }
        if (data.msg) {
            $("ul").append(`<li class="message"><b> ${ senderName }</b> - ${ moment().format( 'h:mm A' ) }</b><br/>${data.msg}</li>`);
        }
        if (data.file) {
            $("ul").append(`<li class="message"><b> ${ senderName }</b> - ${ moment().format( 'h:mm A' ) }</b><br/>${data.file}</li>`);
        }


        var d = $('.chat_window');
        d.scrollTop(d.prop("scrollHeight"));
    },

    toggleChatBadge(newMessage) {
        if (newMessage > 0) {
            document.getElementById("side_contents").onmouseover = (e) => {
                e.preventDefault();
                document.getElementById('newMessage').innerHTML = null;
            }
        }
    },

    alert(type, msg, position) {
        Swal.fire({
            icon: type,
            title: msg,
            toast: true,
            position: position,
            showConfirmButton: false,
            timer: 5000,
        });
    },

    replaceTrack(stream, recipientPeer) {
        let sender = recipientPeer.getSenders ? recipientPeer.getSenders().find(s => s.track && s.track.kind === stream.kind) : false;
        sender ? sender.replaceTrack(stream) : '';
    },

    setLocalStream(stream, mirrorMode = true) {
        var localVidElem = document.getElementById('local');
        localVidElem.srcObject = stream;
        localVidElem.removeAttribute('controls');
        mirrorMode ? localVidElem.classList.add('mirror-mode') : localVidElem.classList.remove('mirror-mode');
    },

    addUserProfile(useProfile) {
        var vidElem = document.getElementById('card');
        const html = `<i class="fa fa-video-slash"></i>`
    },

    adjustVideoElemSize() {
        let elem = document.getElementsByClassName('card');
        let elms = elem.length;
        let newWidth = elms == 1 ? '100%' : (
            elms == 2 ? '50%' : '33.33%'
        );
        let newHeight = elms < 4 ? '100%' : (
            elms < 7 ? '50%' : '33.33%'
        );

        if (elms > 9) {
            return elms == 9;
        }

        for (let i = 0; i < elms; i++) {
            elem[i].style.width = newWidth;
            elem[i].style.height = newHeight;
        }
    },
};
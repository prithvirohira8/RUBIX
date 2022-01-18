

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    snap(name, email);
})

function snap(name, email) {
    const webcamElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('canvas');
    const webcam = new Webcam(webcamElement, 'user', canvasElement);
    webcam.start().then(res => {
        setTimeout(() => {
            picture = webcam.snap();
            const mediaStream = webcamElement.srcObject;
            const tracks = mediaStream.getTracks();
            tracks[0].stop();
            tracks.forEach(track => track.stop())
            document.querySelector(".video").removeChild(webcamElement)
            canvasElement.className = "";
            dbStuff(name, email, picture);
        }, 5000);
    })
}

function dbStuff(name, email, picture) {
    console.log(name, email);
    console.log(picture);
}

const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement);
let picture;
webcam.start().then(res => {
  document.getElementById("snap").addEventListener('click', (e) => {
    setTimeout(() => {
      picture = webcam.snap();
      canvasElement.className = "";
      Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('../models')
      ]).then(start)

    }, 5000);

  })
})




function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

async function start() {
  alert("Function running")
  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  let image;
  let canvas;
  document.body.append('Loaded')
  console.log("Firing Event");
  // imageUpload.addEventListener('change', async () => {
  alert("Event fired ")
  if (image) image.remove()
  if (canvas) canvas.remove()

  const file = dataURLtoFile(data, "testImg");
  image = await faceapi.bufferToImage(file)
  // image = await faceapi.bufferToImage(dataURLtoFile(data, "test"))

  container.append(image)
  canvas = faceapi.createCanvasFromMedia(image)
  container.append(canvas)
  const displaySize = { width: image.width, height: image.height }
  faceapi.matchDimensions(canvas, displaySize)
  const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
  const resizedDetections = faceapi.resizeResults(detections, displaySize)
  const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
  results.forEach((result, i) => {
    const box = resizedDetections[i].detection.box
    const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
    drawBox.draw(canvas)
  })
  // });
}

function loadLabeledImages() {
  const labels = ["Abhishek Sharma"]
  // const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 1; i++) {
        // const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)

        const img = await faceapi.fetchImage(picture);
        // console.log(img);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        // console.log(detections);
        if (detections == undefined) {
          alert("Face cannot be detected !!");
          return;
        }
        // console.log(detections.length);
        descriptions.push(detections.descriptor)
      }

      // alert("Loading done")
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}

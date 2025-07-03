import { init, autoframe, AutoFramingConfig } from "rainbow-auto-framing";

// initialize library
await init("/config.json");

// DOM Setup
let originalVideo: HTMLVideoElement = document.getElementById(
  "originalVideo"
) as HTMLVideoElement;
let framedVideo: HTMLVideoElement = document.getElementById(
  "framedVideo"
) as HTMLVideoElement;
let enableWebcamButton: HTMLButtonElement;

// Check if webcam access is supported.
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia; // !! converts the result to true or false
alert(hasGetUserMedia());

if (hasGetUserMedia()) {
  enableWebcamButton = document.getElementById(
    "webcamButton"
  ) as HTMLButtonElement;
  enableWebcamButton.addEventListener("click", (event) => {
    enableCam(event);
    // Remove the button.
    enableWebcamButton.remove();
  }); // When someone clicks this button, run the enableCam function
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

/**
 * Enable live webcam view and start detection.
 * @param {event} event - event = click.
 */
async function enableCam(event: Event) {
  // getUsermedia parameters
  const constraints = {
    video: true,
  };

  // Activate the webcam stream.
  navigator.mediaDevices
    .getUserMedia(constraints) // returns a Promise — meaning it's asynchronous
    .then(function (stream) {
      originalVideo.srcObject = stream;
      console.log("og video assigned webcam stream");
      originalVideo.play().catch((e) => {
        console.warn("Video play failed:", e);
      });
      // When the video finishes loading and is ready to play, run the autoframe function.
      originalVideo.addEventListener("loadeddata", async (event) => {
        framedVideo.srcObject = await autoframe(stream);
        framedVideo.play().catch((e) => {
          console.warn("Video play failed:", e);
        });
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

import { init, enableCam, AutoFramingConfig } from "rainbow-auto-framing";

// Video Setup
let videoZoom: HTMLVideoElement = document.getElementById(
  "framedVideo"
) as HTMLVideoElement;

let enableWebcamButton: HTMLButtonElement;

// Check if webcam access is supported.
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia; // !! converts the result to true or false

// this is specific to the user's site setup...how do i generalize this
if (hasGetUserMedia()) {
  enableWebcamButton = document.getElementById(
    "webcamButton"
  ) as HTMLButtonElement;
  enableWebcamButton.addEventListener("click", (event) => {
    enableCam(event, videoZoom);
  }); // When someone clicks this button, run the enableCam function

  // Remove the button.
  enableWebcamButton.remove();
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

init("config_path goes here");

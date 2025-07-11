import {
  RainbowAutoFramingConfig,
  RainbowAutoFramingLibrary,
} from "rainbow-auto-framing";

// initialize library
const config = await loadConfig("config.json");
const library = RainbowAutoFramingLibrary.create();
library.start();

// DOM Setup
const originalVideo: HTMLVideoElement = document.getElementById(
  "originalVideo"
) as HTMLVideoElement;
let ogDiv: HTMLElement = document.getElementById("ogDiv") as HTMLVideoElement;
const framedVideo: HTMLVideoElement = document.getElementById(
  "framedVideo"
) as HTMLVideoElement;
const enableWebcamButton: HTMLButtonElement = document.getElementById(
  "webcamButton"
) as HTMLButtonElement;

// Check if webcam access is supported.
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia; // !! converts the result to true or false
if (hasGetUserMedia()) {
  enableWebcamButton.addEventListener("click", (event) => {
    enableCam(event);
    console.log("enabled cam");
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
  const constraints = { video: true };

  // Activate the webcam stream. need to flip video around 180 cuz mirrored rn
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
        const framedStream = await library.autoframe(
          stream,
          true,
          ogDiv,
          originalVideo
        );

        framedVideo.srcObject = framedStream;

        console.log(
          `framedVideo w=${framedVideo.videoWidth}, h=${framedVideo.videoHeight}`
        );
        // ctx.drawImage isn't working, params are whack

        framedVideo.play().catch((e) => {
          console.warn("Video play failed:", e);
        });
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

async function loadConfig(
  config_path: string
): Promise<RainbowAutoFramingConfig> {
  // rejig so tht it takes autoframing config object as param, so that init() can access width/heigt
  try {
    // 1. Use fetch to get the JSON file
    const response = await fetch(config_path);

    // 2. Check if the network request was successful
    if (!response.ok)
      throw new Error(
        `HTTP error! status: ${response.status} while fetching config.json`
      );

    // 3. json() parses the JSON response into a JavaScript object
    console.log("Config loaded successfully:", this.config);
    return (await response.json()) as RainbowAutoFramingConfig;
  } catch (error) {
    console.error("Error loading or parsing config.json:", error);
    // might want to initialize with default settings if the config fails to load (should i?)
  }
}

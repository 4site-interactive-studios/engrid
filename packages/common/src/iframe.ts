export const sendIframeHeight = (frameId: string) => {
  let height = document.body.offsetHeight;
  console.log("Sending iFrame height of: ", height, "px for frameId: ", frameId); // check the message is being sent correctly
  window.parent.postMessage(
    {
      frameHeight: height,
      enID: frameId
    },
    "*"
  );
};

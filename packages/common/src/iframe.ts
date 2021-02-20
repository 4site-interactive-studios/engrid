export const sendIframeHeight = () => {
  let height = document.body.offsetHeight;
  console.log("Sending iFrame height of: ", height, "px"); // check the message is being sent correctly
  window.parent.postMessage(
    {
      frameHeight: height
    },
    "*"
  );
};

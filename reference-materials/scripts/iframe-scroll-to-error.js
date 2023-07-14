window.addEventListener("message", (event) => {
  //Swap selector to match your iframe for the ENgrid page
  const iframe = document.querySelector(".en-iframe");

  if (event.data.hasOwnProperty("scrollTo")) {
    window.scrollTo({
      top:
        event.data.scrollTo +
        window.scrollY +
        iframe.getBoundingClientRect().top,
      left: 0,
      behavior: "smooth",
    });
  }
});

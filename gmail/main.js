document.addEventListener("DOMContentLoaded", (e) => {
  $('.sidebar-nav li').each ((idx, el) => {
    el.addEventListener("click", (event)=> {
      const newLoc = event.target.innerText.toLowerCase();
      window.location.hash = newLoc;
    });
  });
});
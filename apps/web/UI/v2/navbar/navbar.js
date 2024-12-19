document.addEventListener("DOMContentLoaded", function () {
  const btnMenu = document.getElementById("btnMenu");
  const popupMenu = document.getElementById("popupMenu");

  window.addEventListener("resize", function () {
    if (window.innerWidth > 580) {
      popupMenu.style.display = "none";
    }
  });

  btnMenu.addEventListener("click", function () {
    popupMenu.style.display =
      popupMenu.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", function (event) {
    if (!btnMenu.contains(event.target) && !popupMenu.contains(event.target)) {
      popupMenu.style.display = "none";
    }
  });
});

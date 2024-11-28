document.addEventListener("DOMContentLoaded", (event) => {
  const btnInputs = document.querySelectorAll(".btnInput");
  const modal = document.getElementById("containerModalSelectToken");
  const btnClose = document.getElementById("iconClose");
  btnInputs.forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  });
  
  btnClose.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Đóng modal khi nhấp bên ngoài hoặc thêm nút đóng nếu cần
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

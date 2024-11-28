document.addEventListener("DOMContentLoaded", function () {
  const btnManage = document.getElementById("btnManage");
  const btnManageActive = document.getElementById("btnManageActive"); 
  const containerDefault = document.getElementById("containerBtnManageDefault");
  const containerActive = document.getElementById("containerBtnManageActive");

  btnManage.addEventListener("click", function () {
    containerDefault.style.display = "none";
    containerActive.style.display = "block";
  });

  btnManageActive.addEventListener("click", function () {
    containerDefault.style.display = "block";
    containerActive.style.display = "none";
  });
});

// modal remove
document.addEventListener("DOMContentLoaded", function () {
  const btnReceive = document.getElementById("btnReceive");
  const containerModalReceive = document.getElementById(
    "containerModalReceive",
  );
  const btnClose = document.getElementById("btnClose");
  console.log("btnClose", btnClose)


  btnReceive.addEventListener("click", function () {
    containerModalReceive.style.display = "block";
  });
  btnClose.addEventListener("click", function () {
    console.log("btnClose clicked");
    containerModalReceive.style.display = "none";
    console.log("click")
  });
});

//modal add

document.addEventListener("DOMContentLoaded", function () {
  const btnSelectTokenActive = document.getElementById("btnSelectTokenActive");
  const btnSelectTokenDefault = document.getElementById("btnSelectTokenDefault");
  const containerModalSelectToken = document.getElementById(
    "containerModalSelectToken",
  );
  const btnCloseModalSelect = document.getElementById("btnCloseModalSelect");


  btnSelectTokenActive.addEventListener("click", function () {
    containerModalSelectToken.style.display = "block";
  });
  btnSelectTokenDefault.addEventListener("click", function () {
    containerModalSelectToken.style.display = "block";
  });
  btnCloseModalSelect.addEventListener("click", function () {
    containerModalSelectToken.style.display = "none";
  });
});

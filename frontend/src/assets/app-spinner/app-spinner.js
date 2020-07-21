
window.hideAppSpinner = function (){

  let spinner = document.querySelector(".app-spinner-container");
  if (spinner) {
    spinner.hidden = true;
    spinner.remove();
  }

  let link = window.document.querySelector("link[href^=\"/assets/app-spinner/app-spinner.css?\"]");
  if (link) {
    link.disabled = true;
    link.remove();
  }
};

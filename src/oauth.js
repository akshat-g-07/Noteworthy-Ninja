console.log("loaded1");
window.onload = function () {
  console.log("loaded2");
  document.querySelector("button").addEventListener("click", function () {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      console.log(token);
    });
  });
};

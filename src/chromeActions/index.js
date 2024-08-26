export function getAuthToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(token);
      }
    });
  });
}

export async function getUserInfo(token) {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return response.json();
}

export function revokeToken(token) {
  return new Promise((resolve, reject) => {
    chrome.identity.removeCachedAuthToken({ token: token }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        const revokeUrl =
          "https://accounts.google.com/o/oauth2/revoke?token=" + token;
        fetch(revokeUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to revoke token");
            }
            resolve();
          })
          .catch((error) => reject(error));
      }
    });
  });
}

export function checkExistingAuthToken() {
  return new Promise((resolve) => {
    chrome.identity.getAuthToken({ interactive: false }, function (token) {
      if (chrome.runtime.lastError || !token) {
        resolve(null);
      } else {
        resolve(token);
      }
    });
  });
}

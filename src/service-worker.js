function setupContextMenu() {
  chrome.contextMenus.create({
    id: "add-new",
    title: "Add to a New Note | Noteworthy Ninja",
    contexts: ["selection"],
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((data, tab) => {
  // Store the last word in chrome.storage.session.
  chrome.storage.session.set({ noteString: data.selectionText });

  // Make sure the side panel is open.
  chrome.sidePanel.open({ tabId: tab.id });
});

function updateDefinition(newNoteString) {
  if (!newNoteString) return;

  chrome.storage.sync.get("notepad", function (result) {
    let prevNotepad = result.notepad || [];
    let tempNotepad = [
      { id: prevNotepad.length + 1, title: "Untitled", description: newWord },
    ];

    console.log("tempNotepad before", prevNotepad, tempNotepad);
    prevNotepad.forEach((item) => tempNotepad.push(item));
    console.log("tempNotepad after", prevNotepad, tempNotepad);

    chrome.storage.sync.set({ notepad: tempNotepad });
    chrome.runtime.sendMessage({ type: "UPDATE_DEFINITION" });
  });
}

chrome.storage.onChanged.addListener((changes) => {
  const noteStringChange = changes["noteString"];
  if (noteStringChange) {
    updateDefinition(noteStringChange.newValue);
  }
});

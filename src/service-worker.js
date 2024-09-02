function setupContextMenu() {
  chrome.contextMenus.create(
    {
      id: "add-new",
      title: "Add to a New Note | Noteworthy Ninja",
      contexts: ["selection"],
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error("Error creating context menu:", chrome.runtime.lastError);
      } else {
        console.log("Context menu created successfully");
      }
    }
  );
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((data, tab) => {
  console.log("data==>", data.selectionText);
  // Store the last word in chrome.storage.session.
  chrome.storage.session.set({ noteString: data.selectionText }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error setting storage:", chrome.runtime.lastError);
    } else {
      console.log("Storage set successfully");
    }
  });

  // Make sure the side panel is open.
  chrome.sidePanel.open({ tabId: tab.id }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error opening side panel:", chrome.runtime.lastError);
    } else {
      console.log("Side panel opened successfully");
    }
  });
});

function updateDefinition(newWord) {
  if (!newWord) return;

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
  console.log("Changes servie workre:", changes);
  const noteStringChange = changes["noteString"];
  console.log("noteStringChange", noteStringChange);
  if (noteStringChange) {
    console.log("noteStringChange.newValue", noteStringChange.newValue);
    updateDefinition(noteStringChange.newValue);
  }
});

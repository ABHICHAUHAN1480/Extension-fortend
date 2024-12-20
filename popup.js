
document.getElementById("saveTabs").addEventListener("click", async () => {
  
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!activeTab || !activeTab.url) {
    alert("No active tab found!");
    return;
  }

  const tabName = prompt("Enter a name for this tab:", activeTab.title);

  if (!tabName) {
    alert("Tab name cannot be empty!");
    return;
  }

  const tabData = {
    name: tabName,
    url: activeTab.url,
  };

  try {
    const response = await fetch("https://abhitab-backend.onrender.com/tabs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tabData),
    });

    if (response.ok) {
      alert("Tab saved successfully!");
      await loadSavedTabs();
    } else {
      alert("Failed to save the tab!");
    }
  } catch (error) {
    console.error("Error saving tab:", error);
    alert("An error occurred while saving the tab!");
  }
});


const loadSavedTabs = async () => {
  try {
    const response = await fetch("https://abhitab-backend.onrender.com/tabs");
    const tabs = await response.json();

    const savedTabsList = document.getElementById("savedTabsList");
    savedTabsList.innerHTML = ""; 

    if (tabs.length === 0) {
      savedTabsList.innerHTML = "<li>No saved tabs found!</li>";
      return;
    }
    tabs.forEach((tab) => {
      const listItem = document.createElement("li");

      listItem.innerHTML = `
        <strong>${tab.name}</strong> <span id="divider">:</span> <a href="${tab.url}" target="_blank">${tab.url}</a>
        <span class="deleteBtn" data-id="${tab._id}">Delete</span>
      `;
      savedTabsList.appendChild(listItem);
    });

    
    const deleteButtons = document.querySelectorAll(".deleteBtn");
    deleteButtons.forEach(button => {
      button.addEventListener("click", async (event) => {
        const tabId = event.target.getAttribute("data-id");
        await deleteTab(tabId);
      });
    });
  } catch (error) {
    console.error("Error loading tabs:", error);
    alert("An error occurred while fetching saved tabs!");
  }
};
const deleteTab = async (tabId) => {
  try {
    const response = await fetch(`https://abhitab-backend.onrender.com/tabs/${tabId}`,{
      method: "DELETE",
    });

    if (response.ok) {
      alert("Tab deleted successfully!");
      await loadSavedTabs(); 
    } else {
      alert("Failed to delete the tab!");
    }
  } catch (error) {
    console.error("Error deleting tab:", error);
    alert("An error occurred while deleting the tab!");
  }
};


document.addEventListener("DOMContentLoaded", loadSavedTabs);


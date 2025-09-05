// Verse counts per chapter
const verseCounts = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78];

// Global state variables
let currentChapter = 1;
let currentVerse = 1;

// Load verse from backend with smooth fade
function loadVerse(chapter, verse) {
  const textEl = document.getElementById("scriptureText");

  // Update global state
  currentChapter = chapter;
  currentVerse = verse;

  // Fade out current text
  textEl.style.opacity = 0;

  // Make the API call after a short delay to allow for the fade-out
  setTimeout(() => {
    fetch(`https://finalproject-production-e8e4.up.railway.app/get_verse/${currentChapter}/${currentVerse}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Build the HTML content with all the details
        const verseHtml = `
          <p class="verse-info">Chapter ${data.chapter}, Verse ${data.verse}</p>
          <p class="shlok">${data.shlok}</p>
          <p class="meaning">${data.meaning}</p>
        `;

        textEl.innerHTML = verseHtml;

        // Fade in new text
        textEl.style.opacity = 1;
      })
      .catch(error => {
        console.error("Error fetching verse:", error);
        textEl.innerHTML = "<p>Failed to load verse. Please check the backend connection.</p>";
        textEl.style.opacity = 1;
      });
  }, 400);
}


function prevVerse() {
  if (currentVerse > 1) {
    loadVerse(currentChapter, currentVerse - 1);
  } else if (currentChapter > 1) {
    const prevChapter = currentChapter - 1;
    const lastVerseInPrevChapter = verseCounts[prevChapter - 1];
    loadVerse(prevChapter, lastVerseInPrevChapter);
  }
}

function nextVerse() {
  if (currentVerse < verseCounts[currentChapter - 1]) {
    loadVerse(currentChapter, currentVerse + 1);
  } else if (currentChapter < verseCounts.length) {
    loadVerse(currentChapter + 1, 1);
  }
}


function buildIndex() {
  const container = document.getElementById("gitaIndex");

  verseCounts.forEach((count, chapter) => {
    const chNum = chapter + 1;

    const accordionItem = document.createElement("div");
    accordionItem.classList.add("accordion-item");

    accordionItem.innerHTML = `
      <h2 class="accordion-header" id="ch${chNum}Heading">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ch${chNum}">
          Chapter ${chNum} (${count} verses)
        </button>
      </h2>
      <div id="ch${chNum}" class="accordion-collapse collapse" data-bs-parent="#gitaIndex">
        <div class="accordion-body">
          <ul class="verse-list" id="verseList${chNum}"></ul>
        </div>
      </div>
    `;

    container.appendChild(accordionItem);

    const verseList = accordionItem.querySelector(`#verseList${chNum}`);
    for (let i = 1; i <= count; i++) {
      const li = document.createElement("li");
      li.textContent = `Verse ${i}`;
      li.dataset.chapter = chNum;
      li.dataset.verse = i;
      li.addEventListener("click", () => {
        loadVerse(chNum, i);
        document.getElementById("sidebar").classList.remove("active");
        document.getElementById("overlay").classList.remove("active");
      });
      verseList.appendChild(li);
    }
  });
}

// Sidebar toggle logic
document.addEventListener("DOMContentLoaded", () => {
  buildIndex();
  loadVerse(1, 1); // Load Chapter 1, Verse 1 on page load

  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const toggleBtn = document.getElementById("toggleIndex");
  const closeBtn = document.getElementById("closeSidebar");
  const chatToggleBtn = document.getElementById("chatToggleBtn");
  const chatbotContainer = document.getElementById("chatbotContainer");
  const closeChat = document.getElementById("closeChat");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const chatBody = document.getElementById("chatBody");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Open chatbot on floating button click
  chatToggleBtn.addEventListener("click", () => {
    chatbotContainer.style.display = "flex";
    chatToggleBtn.style.display = "none";
  });

  // Close chatbot on close button click
  closeChat.addEventListener("click", () => {
    chatbotContainer.style.display = "none";
    chatToggleBtn.style.display = "flex";
  });

  // Sending messages
  function sendMessage() {
    const msg = chatInput.value.trim();
    if (!msg) return;

    let userMsg = document.createElement("div");
    userMsg.className = "user-message";
    userMsg.textContent = msg;
    chatBody.appendChild(userMsg);
    chatInput.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    fetch("https://finalproject-production-e8e4.up.railway.app/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: msg })
})
    .then(res => res.json())
    .then(data => {
      let botMsg = document.createElement("div");
      botMsg.className = "bot-message";
      botMsg.textContent = data.reply;
      chatBody.appendChild(botMsg);
      chatBody.scrollTop = chatBody.scrollHeight;
    })
    .catch(() => {
      let botMsg = document.createElement("div");
      botMsg.className = "bot-message";
      botMsg.textContent = "⚠️ Error connecting to Veda AI.";
      chatBody.appendChild(botMsg);
    });
  }

  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });
});
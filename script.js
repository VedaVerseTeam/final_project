// Array of 3 shlokas
const shlokas = [
  "ॐ सर्वे भवन्तु सुखिनः । सर्वे सन्तु निरामयाः ॥",
  "असतो मा सद्गमय । तमसो मा ज्योतिर्गमय ॥",
  "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ॥"
];

let index = 0;
const shlokaElement = document.getElementById("shloka");

function changeShloka() {
  // Fade out
  shlokaElement.style.opacity = 0;

  setTimeout(() => {
    // Change text after fade-out
    shlokaElement.textContent = shlokas[index];
    index = (index + 1) % shlokas.length;

    // Fade in
    shlokaElement.style.opacity = 1;
  }, 1500); // matches CSS transition duration
}

// Show first shloka and start cycle
changeShloka();
setInterval(changeShloka, 6000); // 6s = 1.5s fade out + 3s display + 1.5s fade in





window.onload = function() {
  // Create the button
  let btn = document.createElement("button");
  btn.innerText = "Start Journey";
  btn.className = "start-btn";

  // On click → go to scripture page
  btn.addEventListener("click", function() {
    window.location.href = "scripture.html"; // replace with your page/file
  });

  // Add button below tagline
  document.getElementById("button-container").appendChild(btn);
};


document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".feature-card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.transform = "translateX(0)";
      card.style.opacity = "1";
    }, index * 300); // stagger effect
  });
});

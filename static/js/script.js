function getCSRFToken() {
    return document.getElementById("csrf-token").value;
}

let speechSynthesisUtterance; // Global variable for speech control

function sendMessage() {
    let userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

    fetch("/chat/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": getCSRFToken() // CSRF Token for Django
        },
        body: `user_input=${encodeURIComponent(userInput)}`
    })
    .then(response => response.json())
    .then(data => {
        let cleanResponse = cleanText(data.response);
        chatBox.innerHTML += `<p><strong>Cyrus:</strong> ${cleanResponse}</p>`;
        speakText(cleanResponse);
        document.getElementById("user-input").value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => console.error("Error:", error));
}

function startListening() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function(event) {
        let speechText = event.results[0][0].transcript;
        document.getElementById("user-input").value = speechText;
        sendMessage();
    };

    recognition.onerror = function(event) {
        console.error("Speech recognition error:", event.error);
    };
}

function speakText(text) {
    stopSpeech(); // Stop any previous speech before starting new one

    speechSynthesisUtterance = new SpeechSynthesisUtterance();
    speechSynthesisUtterance.text = text;
    speechSynthesisUtterance.lang = "en-US";
    speechSynthesisUtterance.rate = 1;
    speechSynthesisUtterance.volume = 1;
    speechSynthesisUtterance.pitch = 1;
    window.speechSynthesis.speak(speechSynthesisUtterance);
}

function stopSpeech() {
    if (speechSynthesisUtterance) {
        window.speechSynthesis.cancel();
    }
}

function cleanText(text) {
    return text.replace(/\*\*/g, "").replace(/##/g, ""); // Remove ** and ##
}

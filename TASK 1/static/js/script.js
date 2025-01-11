document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chatBox");
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const startNewChat = document.getElementById("startNewChat");
    const seeHistory = document.getElementById("seeHistory");

    chatForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;

        addMessage("user", message);
        userInput.value = "";

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ user_input: message }),
        })
            .then((response) => response.json())
            .then((data) => {
                addMessage("chatbot", data.response);
            })
            .catch((error) => console.error("Error:", error));
    });

    startNewChat.addEventListener("click", () => {
        chatBox.innerHTML = ""; // Clear chat box
    });

    seeHistory.addEventListener("click", () => {
        window.location.href = "/history";
    });

    function addMessage(sender, message) {
        const msgDiv = document.createElement("div");
        msgDiv.className = sender === "user" ? "user-msg" : "bot-msg";
        msgDiv.textContent = message;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const historyBox = document.getElementById("historyBox");
    const clearHistory = document.getElementById("clearHistory");
    const backToChat = document.getElementById("backToChat");

    // Load chat history
    fetch("/get_history")
        .then((response) => response.json())
        .then((data) => {
            data.forEach((chat) => {
                const msgDiv = document.createElement("div");
                msgDiv.className = chat.sender === "user" ? "user-msg" : "bot-msg";
                msgDiv.textContent = chat.message;
                historyBox.appendChild(msgDiv);
                historyBox.scrollTop = historyBox.scrollHeight;
            });
        })
        .catch((error) => console.error("Error fetching history:", error));

    // Clear history
    clearHistory.addEventListener("click", () => {
        fetch("/clear_history", { method: "POST" })
            .then((response) => response.json())
            .then(() => {
                historyBox.innerHTML = ""; // Clear history box
            })
            .catch((error) => console.error("Error clearing history:", error));
    });

    // Back to chat
    backToChat.addEventListener("click", () => {
        window.location.href = "/";
    });
});

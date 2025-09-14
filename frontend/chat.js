// ----------------------------
// HumraazAI chat.js
// ----------------------------

// Get DOM elements
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');
const avatars = document.querySelectorAll('.avatar');
let selectedAvatar = 'girl1.png';

// Avatar selection
avatars.forEach(av => {
    av.addEventListener('click', () => {
        avatars.forEach(a => a.classList.remove('selected'));
        av.classList.add('selected');
        selectedAvatar = av.dataset.avatar;
    });
});

// Send message on button click or Enter key
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e => {
    if(e.key === 'Enter') sendMessage();
});

// Append message to chat box
function appendMessage(msg, sender, avatar=null){
    const div = document.createElement('div');
    div.classList.add('message', sender === 'user' ? 'user-msg' : 'bot-msg');
    div.innerHTML = avatar ? `<img src="avatars/${avatar}" class="avatar-small"> ${msg}` : msg;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to backend
async function sendMessage(){
    const message = userInput.value.trim();
    if(!message) return;

    // Append user message
    appendMessage(message, 'user', selectedAvatar);
    userInput.value = '';

    const lang = document.getElementById('languageSelect').value;

    try {
        // Update this URL when you deploy to your domain
        const backendURL = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/chat' 
            : 'https://humrazai.com/backend/chat';

        const response = await fetch(backendURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, language: lang })
        });

        const data = await response.json();

        // Use bot avatar if provided, else random
        const botAvatars = ['girl1.png','girl2.png','boy1.png','boy2.png'];
        const botAvatar = data.emotionAvatar || botAvatars[Math.floor(Math.random() * botAvatars.length)];

        appendMessage(data.reply, 'bot', botAvatar);

    } catch(err) {
        console.error(err);
        appendMessage("Bot is not responding right now. Try again later.", 'bot');
    }
}

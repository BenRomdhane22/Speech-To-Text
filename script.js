const languageSelect = document.getElementById('language');
languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang.code;
    option.textContent = `${lang.name} (${lang.native})`;
    languageSelect.appendChild(option);
});

// Initialize speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Get DOM elements
const recordBtn = document.querySelector('.record');
const recordIcon = recordBtn.querySelector('ion-icon');
const recordImg = recordBtn.querySelector('img');
const result = document.querySelector('.result');
const clearBtn = document.querySelector('.clear');
const downloadBtn = document.querySelector('.download');
const interimResult = document.querySelector('.interim');

// Set initial recognition properties
recognition.continuous = true;
recognition.interimResults = true;

// Initialize variables
let isRecording = false;
let finalTranscript = '';

// Handle language change
languageSelect.addEventListener('change', () => {
    recognition.lang = languageSelect.value;
});

// Handle recording button click
recordBtn.addEventListener('click', () => {
    if (!isRecording) {
        // Start recording
        recognition.start();
        recordBtn.classList.add('recording');
        recordBtn.querySelector('ion-icon').name = 'stop-outline';
    } else {
        // Stop recording
        recognition.stop();
        recordBtn.classList.remove('recording');
        recordBtn.querySelector('ion-icon').name = 'mic-outline';
    }
    isRecording = !isRecording;
});

// Handle speech recognition results
recognition.addEventListener('result', (e) => {
    let interimTranscript = '';

    // Loop through results
    for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
            finalTranscript += transcript + ' ';
        } else {
            interimTranscript += transcript;
        }
    }

    // Update the display
    result.textContent = finalTranscript;
    interimResult.textContent = interimTranscript;
    
    // Enable download button if there's text
    if (finalTranscript) {
        downloadBtn.disabled = false;
    }
});

// Handle errors
recognition.addEventListener('error', (e) => {
    console.error('Speech recognition error:', e.error);
    isRecording = false;
    recordBtn.classList.remove('recording');
    recordBtn.querySelector('ion-icon').name = 'mic-outline';
});

// Clear button functionality
clearBtn.addEventListener('click', () => {
    finalTranscript = '';
    result.textContent = '';
    interimResult.textContent = '';
    downloadBtn.disabled = true;
});

// Download button functionality
downloadBtn.addEventListener('click', () => {
    const text = result.textContent;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speech-to-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Handle end of recognition
recognition.addEventListener('end', () => {
    if (isRecording) {
        recognition.start();
    }
});
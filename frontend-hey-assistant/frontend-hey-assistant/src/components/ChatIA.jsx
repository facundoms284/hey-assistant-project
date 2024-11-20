import React, { useState, useRef, useEffect } from 'react';

// MUI
import {
  TextField,
  Paper,
  Typography,
  Box,
  IconButton,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';

// customHook
import useApiResponse from '../customHooks/useApiResponse';

function ChatIA() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('default');
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        // Filter all voices to get only the ones in english
        const englishVoices = allVoices.filter((voice) =>
          voice.lang.startsWith('en')
        );
        setVoices(englishVoices);
        setSelectedVoice(englishVoices[0]?.name); // Set the first voice available as the default
      }
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel previous speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Config utterance voice
      const selected = voices.find((v) => v.name === selectedVoice);
      if (selected) {
        utterance.voice = selected;
      }

      window.speechSynthesis.speak(utterance);
    } else {
      console.log('SpeechSynthesis API is not available.');
    }
  };

  const lastUserMessage = messages.findLast((msg) => msg.isUser)?.text || '';

  // Fetch the API answer using the useApiResponse custom hook.
  const { data: apiResponse, isLoading: isLoadingResponse } = useApiResponse(
    lastUserMessage,
    enabled
  );

  // Set the API answer as a message. - Speak the answer and disable the fetching of the API response.
  useEffect(() => {
    if (apiResponse) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: apiResponse, isUser: false },
      ]);
      speakText(apiResponse);
      setEnabled(false); // Reiniciamos el estado enabled después de recibir la respuesta
    }
  }, [apiResponse]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add the user message to the messages state as a user message.
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputText, isUser: true },
    ]);

    // Enable the API request.
    setEnabled(true);
    setInputText('');
  };

  // Function that recognizes the voice input and transforms it into text.
  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      recognition.start();
    } else {
      alert('The voice input is not supported in this browser.');
    }
  };

  return (
    <Box className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <Typography variant="h4" className="mb-4 font-bold">
        Chat IA
      </Typography>
      <Paper elevation={3} className="flex-grow mb-4 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <Box
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              message.isUser ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
            } max-w-[80%]`}
          >
            <Typography>{message.text}</Typography>
          </Box>
        ))}
        {isLoadingResponse && (
          <Box className="mb-2 p-2 rounded-lg bg-gray-100">
            <Typography>
              <CircularProgress size={20} />
              Waiting for response...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Paper>
      <Box className="flex gap-2">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Write your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-grow"
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          aria-label="Enviar mensaje"
        >
          <SendIcon />
        </IconButton>
        <IconButton
          color={isListening ? 'secondary' : 'default'}
          onClick={handleVoiceInput}
          aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
        >
          <MicIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ChatIA;

import React, { useState, useRef, useEffect, useMemo } from 'react';

// MUI
import {
  TextField,
  Paper,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  capitalize,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import BasicModal from './ImageModal';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
});

// customHook
import useApiResponse from '../customHooks/useApiResponse';

//helpers
import getGeneratedImageResponse from '../helpers/getGeneratedImageResponse';
import getImageResponse from '../helpers/getImageResponse';
import capitalizeFirstLetter from '../helpers/capitalizeFirstLetter';

function ChatIA() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('default');
  const [voices, setVoices] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoadingImageResponse, setIsLoadingImageResponse] = useState(false);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const messagesEndRef = useRef(null);

  const { mutate: fetchApiResponse } = useApiResponse();

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        const englishVoices = allVoices.filter((voice) =>
          voice.lang.startsWith('en')
        );
        setVoices(englishVoices);
        setSelectedVoice(englishVoices[0]?.name);
      }
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript;
        if (transcript.toLowerCase().includes('hey assistant')) {
          recognition.stop();
          setIsListening(true);
          recognition.start();
        } else if (isListening) {
          const formattedTranscript = capitalizeFirstLetter(transcript);
          setInputText(formattedTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
      };

      recognition.start();
    }
  }, [isListening]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add the user message to the chat history.
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputText, isUser: true },
    ]);

    setIsLoadingResponse(true);

    // Trigger the API call for the user's input using the mutate function.
    fetchApiResponse(inputText, {
      onLoading: () => {
        setIsLoadingResponse(true);
      },
      onSuccess: (apiResponse) => {
        // Add the AI's response to the chat history.
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: apiResponse, isUser: false },
        ]);
        speakText(apiResponse);
        setIsLoadingResponse(false);
      },
      onError: (error) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Error fetching API response', isUser: false },
        ]);
        setIsLoadingResponse(false);
      },
    });
    setInputText('');
  };

  const handleImageGeneration = async (prompt) => {
    setIsLoadingImageResponse(true);
    try {
      const response = await getGeneratedImageResponse(prompt);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response, isUser: false, isImage: true },
      ]);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsLoadingImageResponse(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const imageData = await getImageResponse(file);
    const imageUrl = imageData.url;
    setImageUrl(imageUrl);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: imageUrl, isUser: true, isImage: true },
    ]);
  };

  const recognitionEnabled = useMemo(
    () => 'webkitSpeechRecognition' in window,
    []
  );

  const handleVoiceInput = () => {
    setIsListening(!isListening);
  };

  return (
    <Box className="flex flex-col h-screen max-w-full lg:max-w[2500px] mx-auto p-4 overflow-x-hidden">
      <Typography variant="h4" className="mb-4 font-bold text-center">
        Chat IA - Hey Assistant
      </Typography>
      <Paper elevation={3} className="flex-grow mb-4 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <Box
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              message.isUser ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
            } ${
              message.isImage ? 'w-fit' : 'w-full'
            } sm:max-w-[80%] max-w-[65%] p-2 md:p-4 lg:p-6 md:max-w-{70%} lg:max-w-[60%]`}
          >
            {message.isImage ? (
              <img
                src={message.text}
                alt="Generated from prompt"
                className="mx-auto w-64 h-64 object-contain"
              />
            ) : (
              <Typography variant="h5">{message.text}</Typography>
            )}
          </Box>
        ))}
        {isLoadingResponse && (
          <Box className="mb-2 p-2 rounded-lg bg-gray-100 md:p-6">
            <Typography>
              <CircularProgress size={20} className="mr-2" />
              Waiting for response...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />

        {isLoadingImageResponse && (
          <Box className="mb-2 p-2 rounded-lg bg-gray-100 md:p-6">
            <Typography>
              <CircularProgress size={20} className="mr-2" />
              Waiting for image generation...
            </Typography>
          </Box>
        )}
      </Paper>

      <Box className="flex gap-2">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Write your message..."
          value={inputText || ''}
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
          disabled={!recognitionEnabled}
        >
          <MicIcon />
        </IconButton>
        <IconButton component="label" color="default" aria-label="Upload files">
          <CloudUploadIcon />
          <VisuallyHiddenInput
            type="file"
            onChange={handleImageUpload}
            multiple
          />
        </IconButton>
        <BasicModal handleConfirmGeneration={handleImageGeneration} />
      </Box>
    </Box>
  );
}

export default ChatIA;

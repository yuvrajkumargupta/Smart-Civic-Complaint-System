import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Camera, Calendar, CheckCircle, Smartphone } from 'lucide-react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

// --- ROBOT AVATAR COMPONENT ---
const RobotAvatar = ({ emotion, small }) => {
    // Variations for eyes based on emotion
    const eyesVariant = {
        idle: { scaleY: 1, scaleX: 1, backgroundColor: '#3b82f6' }, // Blue open
        happy: { scaleY: 0.2, scaleX: 1.2, backgroundColor: '#10b981', borderRadius: '50%' }, // Green squint (smile)
        thinking: { scaleY: 0.8, scaleX: 0.8, backgroundColor: '#f59e0b', rotate: [0, 180, 360] }, // Orange rotating
        listening: { scaleY: 1.2, scaleX: 0.9, backgroundColor: '#8b5cf6' }, // Purple attentive
        error: { scaleY: 0.1, scaleX: 1, backgroundColor: '#ef4444', rotate: 45 } // Red X-ish
    };

    return (
        <motion.div
            className={`relative flex items-center justify-center ${small ? 'w-10 h-10' : 'w-24 h-24'}`}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
            {/* Antenna */}
            <motion.div
                className={`absolute top-0 w-1 ${small ? 'h-3 -mt-2' : 'h-6 -mt-4'} bg-slate-300 rounded-full`}
                animate={emotion === 'thinking' ? { rotate: [0, 15, -15, 0] } : {}}
            >
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -mt-1 ${small ? 'w-2 h-2' : 'w-3 h-3'} rounded-full ${emotion === 'error' ? 'bg-red-500' : 'bg-blue-400'} shadow-lg shadow-blue-400/50 animate-pulse`}></div>
            </motion.div>

            {/* Head */}
            <div className={`relative ${small ? 'w-8 h-7 text-xs' : 'w-20 h-16'} bg-white border-2 border-slate-200 rounded-2xl shadow-xl flex flex-col items-center justify-center overflow-hidden z-10`}>
                {/* Face/Screen */}
                <div className={`${small ? 'w-6 h-4' : 'w-16 h-10'} bg-slate-900 rounded-lg flex items-center justify-center space-x-${small ? '1' : '2'}`}>
                    {/* Left Eye */}
                    <motion.div
                        className={`${small ? 'w-1.5 h-1.5' : 'w-3 h-3'} rounded-full`}
                        animate={eyesVariant[emotion] || eyesVariant.idle}
                    />
                    {/* Right Eye */}
                    <motion.div
                        className={`${small ? 'w-1.5 h-1.5' : 'w-3 h-3'} rounded-full`}
                        animate={eyesVariant[emotion] || eyesVariant.idle}
                    />
                </div>
                {/* Mouth/Chin area */}
                {!small && <div className="mt-1 w-8 h-1 bg-slate-100 rounded-full mb-1 opacity-50"></div>}
            </div>

            {/* Arms (Only visible when big) */}
            {!small && (
                <>
                    <motion.div
                        className="absolute left-0 -ml-4 top-1/2 w-4 h-12 bg-slate-300 rounded-full origin-top"
                        animate={emotion === 'greeting' ? { rotate: [0, -30, 0, -30, 0] } : { rotate: 10 }}
                    />
                    <motion.div
                        className="absolute right-0 -mr-4 top-1/2 w-4 h-12 bg-slate-300 rounded-full origin-top"
                        animate={emotion === 'success' ? { rotate: [0, 150, 120, 150, 0] } : { rotate: -10 }}
                    />
                </>
            )}
        </motion.div>
    );
};

// --- CHATBOT MAIN COMPONENT ---
const CivicBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [emotion, setEmotion] = useState('idle');
    const [messages, setMessages] = useState([
        { text: "Hi! I'm Civic Sam 🤖. I can help you track complaints, find info, or just chat!", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Simple Intent Matcher
    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = inputValue;
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInputValue("");
        setEmotion('thinking');

        // Simulate thinking delay
        setTimeout(async () => {
            let botResponse = "I'm not sure about that, but I'm learning!";
            const lowerMsg = userMsg.toLowerCase();
            let newEmotion = 'listening'; // default after thinking

            try {
                // --- INTENTS ---

                // 1. Complaint Count / Profile Status
                if (lowerMsg.includes('how many') || lowerMsg.includes('my complaints') || lowerMsg.includes('status')) {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        botResponse = "You need to be logged in to see your complaints. Want to log in?";
                        newEmotion = 'idle';
                    } else {
                        const { data } = await API.get('/complaints/my-complaints');
                        botResponse = `You have filed ${data.count} complaints so far. Keep up the good work! 🏙️`;
                        newEmotion = 'happy';
                    }
                }
                // 2. Upload / File Complaint
                else if (lowerMsg.includes('file') || lowerMsg.includes('report') || lowerMsg.includes('new issue') || lowerMsg.includes('upload')) {
                    botResponse = "I can take you to the dashboard to file a report. Click the button below! 👇";
                    newEmotion = 'listening';
                    // We can add a specialized action button here in a real implementation
                }
                // 3. Greeting
                else if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
                    botResponse = "Hello citizen! Ready to improve our city today? 🌟";
                    newEmotion = 'greeting';
                }
                // 4. Resolved
                else if (lowerMsg.includes('resolved') || lowerMsg.includes('fixed')) {
                    botResponse = "Checking your resolved issues... (Simulated: 'Pothole on 5th Ave' was fixed yesterday!)";
                    newEmotion = 'success';
                }
                // 5. Joke / Personality
                else if (lowerMsg.includes('who are you') || lowerMsg.includes('name')) {
                    botResponse = "I'm Civic Sam! I live in the cloud but my heart is with the city. 🤖❤️";
                    newEmotion = 'happy';
                }

                // Fallback / AI Hook (Mock)
                else {
                    const responses = [
                        "That's interesting! Tell me more about the civic issue.",
                        "I'm here to help with complaints and city info.",
                        "Could you rephrase that? I'm good at 'status', 'new complaint', and 'help'."
                    ];
                    botResponse = responses[Math.floor(Math.random() * responses.length)];
                    newEmotion = 'idle';
                }

            } catch (error) {
                console.error("Bot Error", error);
                botResponse = "Oops, I had trouble connecting to the city server. Try again later!";
                newEmotion = 'error';
            }

            setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
            setEmotion(newEmotion);

            // Return to idle after a bit
            setTimeout(() => setEmotion('idle'), 3000);

        }, 1000); // 1.5s thinking time
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    // Quick Actions
    const quickActions = [
        { label: "My Stats", action: "How many complaints have I filed?" },
        { label: "File Report", action: "I want to file a new issue" },
        { label: "Resolved?", action: "Show my resolved issues" },
    ];

    const runAction = (text) => {
        setInputValue(text);
        // Direct trigger would be better but state update is async, so we just set input for now to let user confirm
        // Or we can refactor handleSend to take an arg.
    };

    return (
        <div className="fixed bottom-6 right-6 z-[10001] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden border border-slate-100 flex flex-col mb-4 max-h-[600px]"
                    >
                        {/* Header */}
                        <div className="bg-brand-indigo p-4 flex items-center justify-between text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>
                            <div className="flex items-center space-x-3 z-10">
                                <div className="bg-white/20 p-1.5 rounded-full">
                                    <RobotAvatar emotion={emotion} small={true} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Civic Sam</h3>
                                    <div className="flex items-center space-x-1">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                        <span className="text-xs text-indigo-100">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white z-10">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Large Avatar Area (Only when messages are few? or always at top?) -> Let's keep it compact, maybe show big avatar only on welcome? 
                            Let's show the big avatar in the chat body if it's the start
                        */}
                        <div className="flex-1 bg-slate-50 p-4 overflow-y-auto h-80 space-y-4">
                            {/* Intro Animation */}
                            {messages.length === 1 && (
                                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                                    <RobotAvatar emotion={emotion} />
                                    <p className="text-xs text-slate-400">Ready to help!</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-3 text-sm rounded-xl ${msg.sender === 'user'
                                            ? 'bg-brand-indigo text-white rounded-br-none'
                                            : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {emotion === 'thinking' && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-xl rounded-bl-none shadow-sm border border-slate-100 italic text-xs text-slate-400 flex items-center space-x-1">
                                        <span>Thinking</span>
                                        <span className="animate-bounce">.</span>
                                        <span className="animate-bounce delay-100">.</span>
                                        <span className="animate-bounce delay-200">.</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef}></div>
                        </div>

                        {/* Quick Actions */}
                        <div className="px-4 py-2 bg-slate-50 flex gap-2 overflow-x-auto no-scrollbar">
                            {quickActions.map((qa, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInputValue(qa.action)} // Better UX: populate input
                                    className="whitespace-nowrap px-3 py-1 bg-white border border-slate-200 text-xs text-brand-indigo rounded-full hover:bg-indigo-50 transition-colors"
                                >
                                    {qa.label}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    if (emotion !== 'thinking') setEmotion('listening');
                                }}
                                onKeyPress={handleKeyPress}
                                onBlur={() => setEmotion('idle')}
                                placeholder="Type a message..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo/50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className="p-2 bg-brand-indigo text-white rounded-full hover:bg-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        setIsOpen(true);
                        setEmotion('greeting');
                        setTimeout(() => setEmotion('idle'), 2000);
                    }}
                    className="w-16 h-16 bg-white rounded-full shadow-2xl border-2 border-brand-indigo flex items-center justify-center relative overflow-hidden group"
                >
                    {/* Mini Robot Head always visible */}
                    <RobotAvatar emotion={emotion} small={true} />
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-bounce"></span>
                </motion.button>
            )}
        </div>
    );
};

export default CivicBot;

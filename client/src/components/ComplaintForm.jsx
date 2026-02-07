
import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { classifyImage, mapPredictionToCategory } from '../utils/aiService';
import { Send, MapPin, Tag, FileText, Loader2, AlertCircle, CheckCircle, Image as ImageIcon, Sparkles, Camera, X } from 'lucide-react';
import API from '../api/axios';
import LocationPicker from './LocationPicker';

const ComplaintForm = ({ onComplaintAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        location: '',
        coordinates: null
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    // Camera State
    const [showCamera, setShowCamera] = useState(false);
    const webcamRef = useRef(null);

    // AI State
    const [aiProcessing, setAiProcessing] = useState(false);
    const [aiResult, setAiResult] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const processImageForAI = async (file) => {
        setAiResult(null);
        setAiProcessing(true);
        try {
            const imgElement = document.createElement('img');
            imgElement.src = URL.createObjectURL(file);

            imgElement.onload = async () => {
                const predictions = await classifyImage(imgElement);
                const match = mapPredictionToCategory(predictions);

                if (match) {
                    setAiResult(match);
                    setFormData(prev => ({ ...prev, category: match.category }));
                }
                setAiProcessing(false);
            };
        } catch (error) {
            console.error("AI Error:", error);
            setAiProcessing(false);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            processImageForAI(file);
        }
    };

    // Convert Base64 (from Camera) to File object
    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    const capturePhoto = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            const file = dataURLtoFile(imageSrc, "camera_capture.jpg");
            setImage(file);
            setShowCamera(false);
            processImageForAI(file);
        }
    }, [webcamRef]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('location', formData.location);
        if (image) {
            data.append('image', image);
        }

        if (formData.coordinates) {
            data.append('latitude', formData.coordinates.lat);
            data.append('longitude', formData.coordinates.lng);
        }

        if (aiResult) {
            data.append('aiDetectedCategory', aiResult.detected);
            data.append('aiConfidence', aiResult.confidence);
        }

        try {
            await API.post('/complaints', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setMessage({ type: 'success', text: 'Complaint filed successfully!' });
            setFormData({ title: '', category: '', description: '', location: '' });
            setImage(null);
            setAiResult(null);

            if (onComplaintAdded) onComplaintAdded();
            setTimeout(() => setMessage(null), 3000);

        } catch (error) {
            console.error("Submission error:", error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to submit complaint. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-6 h-full">
            <h3 className="font-bold text-lg text-brand-slate mb-6">File a Complaint</h3>

            {message && (
                <div className={`mb-4 p-3 rounded-lg flex items-center text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'} `}>
                    {message.type === 'success' ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                    {message.text}
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1.5 ml-1">Title</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 text-brand-muted w-5 h-5" />
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-all placeholder:text-slate-400"
                            placeholder="Brief description of the issue"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1.5 ml-1">Category</label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-3 text-brand-muted w-5 h-5" />
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-all text-brand-slate appearance-none cursor-pointer"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="road">Roads & Maintenance</option>
                            <option value="garbage">Sanitation & Garbage</option>
                            <option value="electricity">Electrical & Lighting</option>
                            <option value="water">Water Supply</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {aiProcessing && (
                        <div className="mt-2 text-xs text-indigo-500 flex items-center animate-pulse">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Is this a Civic Issue? Analyzing...
                        </div>
                    )}
                    {aiResult && (
                        <div className="mt-2 text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-1 rounded inline-flex items-center">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Detected: <span className="font-semibold ml-1 capitalize">{aiResult.detected}</span>
                            <span className="opacity-75 ml-1">({aiResult.confidence}%)</span>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1.5 ml-1">Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-brand-muted w-5 h-5" />
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-all placeholder:text-slate-400"
                            placeholder="Enter location or landmark"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1.5 ml-1">Pin Location on Map</label>
                    <LocationPicker onLocationSelect={(pos) => setFormData(prev => ({ ...prev, coordinates: pos }))} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1.5 ml-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-all placeholder:text-slate-400 min-h-[100px]"
                        placeholder="Provide detailed information about the issue..."
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-brand-slate mb-1.5 ml-1">Evidence</label>

                    {!showCamera && (
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="flex items-center justify-center w-full px-4 py-2.5 bg-slate-50 border border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-100 transition-colors text-slate-500 text-sm"
                                >
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    {image ? image.name : "Upload Image"}
                                </label>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCamera(true)}
                                className="px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center"
                                title="Take Photo"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {showCamera && (
                        <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex flex-col items-center justify-center">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={capturePhoto}
                                    className="bg-white text-brand-indigo px-4 py-2 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
                                >
                                    Capture
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCamera(false)}
                                    className="bg-slate-800/80 text-white px-3 py-2 rounded-full hover:bg-slate-800 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-indigo hover:bg-brand-blue text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            <span>Submit Complaint</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ComplaintForm;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader2,
    Tag,
    User,
    ThumbsUp,
    Zap,
    Star
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import CommentSection from '../components/CommentSection';
import { format } from 'date-fns';

const ComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [upvotes, setUpvotes] = useState(0);
    const [isUpvoted, setIsUpvoted] = useState(false);

    // specialized fix: useMemo for user to prevent infinite loop in useEffect
    const user = React.useMemo(() => JSON.parse(localStorage.getItem('user')), []);

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const { data } = await API.get(`/complaints/${id}`);
                setComplaint(data.complaint);
                if (data.complaint.upvotes) {
                    setUpvotes(data.complaint.upvotes.length);
                    if (user) {
                        setIsUpvoted(data.complaint.upvotes.includes(user.id));
                    }
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Failed to load complaint details.");
            } finally {
                setLoading(false);
            }
        };
        fetchComplaint();
    }, [id, user]);

    const [feedbackRating, setFeedbackRating] = useState(5);
    const [feedbackComment, setFeedbackComment] = useState("");
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    const handleUpvote = async () => {
        try {
            const { data } = await API.put(`/complaints/${id}/upvote`);
            setUpvotes(data.count);
            setIsUpvoted(data.isUpvoted);
        } catch (error) {
            console.error("Upvote failed", error);
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setSubmittingFeedback(true);
        try {
            const { data } = await API.post(`/complaints/${id}/feedback`, {
                rating: feedbackRating,
                comment: feedbackComment
            });
            setComplaint(data.complaint); // Update with new feedback
            setFeedbackRating(5);
            setFeedbackComment("");
            alert("Thank you for your feedback!");
        } catch (error) {
            console.error("Feedback failed", error);
            alert("Failed to submit feedback");
        } finally {
            setSubmittingFeedback(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-indigo animate-spin" />
            </div>
        );
    }

    if (error || !complaint) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Error</h2>
                <p className="text-slate-500 mb-4">{error || "Complaint not found"}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-brand-indigo font-medium hover:underline"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                </button>
            </div>
        );
    }

    // Timeline Configuration
    const steps = ['pending', 'in_progress', 'resolved'];
    const currentStepIndex = steps.indexOf(complaint.status);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-brand-indigo transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in-up">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Header Card */}
                        <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-indigo-50 text-brand-indigo text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                                        #{complaint._id.slice(-6).toUpperCase()}
                                    </span>
                                    <h1 className="text-2xl font-bold text-slate-800">{complaint.title}</h1>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className={`px-4 py-2 rounded-lg text-sm font-bold capitalize flex items-center
                                        ${complaint.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' :
                                            complaint.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                                                'bg-amber-50 text-amber-600'}
                                    `}>
                                        {complaint.status === 'resolved' ? <CheckCircle className="w-4 h-4 mr-2" /> :
                                            complaint.status === 'in_progress' ? <Clock className="w-4 h-4 mr-2" /> :
                                                <AlertCircle className="w-4 h-4 mr-2" />}
                                        {complaint.status.replace('_', ' ')}
                                    </div>

                                    {/* Priority Badge */}
                                    {complaint.priority && complaint.priority !== 'medium' && (
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center
                                            ${complaint.priority === 'urgent' || complaint.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}
                                        `}>
                                            <Zap className="w-3 h-3 mr-1" />
                                            {complaint.priority} Priority
                                        </div>
                                    )}

                                    {/* Upvote Button */}
                                    <button
                                        onClick={handleUpvote}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                                            ${isUpvoted
                                                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-200'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}
                                        `}
                                    >
                                        <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'fill-current' : ''}`} />
                                        {upvotes} Support
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mt-6 border-t border-slate-100 pt-6">
                                <div className="flex items-center">
                                    <Tag className="w-4 h-4 mr-2 text-slate-400" />
                                    <span className="font-semibold mr-1">Category:</span>
                                    <span className="capitalize">{complaint.category}</span>
                                </div>
                                {complaint.aiDetectedCategory && (
                                    <div className="flex items-center col-span-2 sm:col-span-1">
                                        <div className="flex items-center px-2 py-1 bg-purple-50 rounded border border-purple-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2 animate-pulse"></div>
                                            <span className="text-xs font-bold text-purple-700 uppercase mr-1">AI Detected:</span>
                                            <span className="text-xs text-purple-600 capitalize">{complaint.aiDetectedCategory}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                    <span className="font-semibold mr-1">Location:</span>
                                    <span className="truncate max-w-[150px]" title={complaint.location}>{complaint.location}</span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                    <span className="font-semibold mr-1">Filed:</span>
                                    {format(new Date(complaint.createdAt), 'PPp')}
                                </div>
                                <div className="flex items-center">
                                    <User className="w-4 h-4 mr-2 text-slate-400" />
                                    <span className="font-semibold mr-1">Filed By:</span>
                                    {complaint.user?.name || 'Anonymous'}
                                </div>
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-8">
                            <h3 className="font-bold text-lg text-slate-800 mb-4">Description</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {complaint.description}
                            </p>
                        </div>

                        {/* Location Map Card */}
                        {complaint.coordinates && (
                            <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-8 h-[400px]">
                                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-brand-indigo" />
                                    Exact Location
                                </h3>
                                <div className="h-[300px] w-full rounded-lg overflow-hidden border border-slate-200 relative z-0">
                                    <MapContainer
                                        center={[complaint.coordinates.lat, complaint.coordinates.lng]}
                                        zoom={15}
                                        style={{ height: "100%", width: "100%" }}
                                        scrollWheelZoom={false}
                                    >
                                        <TileLayer
                                            url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=KNcj69eh2nNRFjKoavX3`}
                                            attribution="© MapTiler © OpenStreetMap contributors"
                                        />
                                        <Marker position={[complaint.coordinates.lat, complaint.coordinates.lng]} />
                                    </MapContainer>
                                </div>
                            </div>
                        )}

                        {/* Image Evidence Card */}
                        {complaint.image && (
                            <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-8">
                                <h3 className="font-bold text-lg text-slate-800 mb-4">Evidence</h3>
                                <div className="rounded-lg overflow-hidden border border-slate-100">
                                    <img
                                        src={`http://localhost:5000/${complaint.image}`}
                                        alt="Complaint Evidence"
                                        className="w-full h-auto object-cover max-h-[500px]"
                                        onError={(e) => { e.target.style.display = 'none' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Governance: Resolution Feedback */}
                        {complaint.status === 'resolved' && (
                            <div className="bg-gradient-to-r from-indigo-50 to-white rounded-xl shadow-soft border border-indigo-100 p-8">
                                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center">
                                    <Star className="w-5 h-5 mr-2 text-yellow-500 fill-current" />
                                    Resolution Feedback
                                </h3>

                                {complaint.feedback?.rating ? (
                                    <div className="bg-white p-6 rounded-lg border border-slate-200">
                                        <div className="flex items-center mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < complaint.feedback.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
                                                />
                                            ))}
                                            <span className="ml-2 font-bold text-slate-700">Rated {complaint.feedback.rating}/5</span>
                                        </div>
                                        {complaint.feedback.comment && (
                                            <p className="text-slate-600 italic">"{complaint.feedback.comment}"</p>
                                        )}
                                        <p className="text-xs text-slate-400 mt-2">Feedback submitted.</p>
                                    </div>
                                ) : (
                                    user && complaint.user?._id === user.id ? (
                                        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                                            <p className="text-slate-600 text-sm">How satisfied are you with the resolution of this issue?</p>

                                            <div className="flex items-center space-x-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setFeedbackRating(star)}
                                                        className={`p-1 transition-transform hover:scale-110 focus:outline-none`}
                                                    >
                                                        <Star
                                                            className={`w-8 h-8 ${star <= feedbackRating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>

                                            <textarea
                                                className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
                                                rows="3"
                                                placeholder="Any additional comments? (Optional)"
                                                value={feedbackComment}
                                                onChange={(e) => setFeedbackComment(e.target.value)}
                                            ></textarea>

                                            <button
                                                type="submit"
                                                disabled={submittingFeedback}
                                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50"
                                            >
                                                {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="bg-slate-50 p-4 rounded-lg text-slate-500 text-sm text-center">
                                            Waiting for citizen feedback.
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        {/* Comments Section */}
                        <CommentSection complaintId={complaint._id} />

                    </div>

                    {/* Sidebar (Right) - Timeline */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-6">
                            <h3 className="font-bold text-lg text-slate-800 mb-6">Status Timeline</h3>

                            <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
                                {steps.map((step, index) => {
                                    const isCompleted = index <= currentStepIndex;
                                    const isCurrent = index === currentStepIndex;

                                    return (
                                        <div key={step} className="relative">
                                            {/* Dot */}
                                            <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 
                                                ${isCompleted ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}
                                                ${isCurrent ? 'ring-4 ring-indigo-100' : ''}
                                            `}></div>

                                            <div className={`${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                                                <h4 className="font-bold capitalize text-sm">{step.replace('_', ' ')}</h4>
                                                <p className="text-xs mt-1">
                                                    {isCurrent ? 'Current Status' :
                                                        isCompleted ? 'Completed' : 'Pending'}
                                                </p>
                                                {step === 'resolved' && complaint.resolvedAt && (
                                                    <p className="text-xs text-emerald-600 mt-1 font-medium">
                                                        {format(new Date(complaint.resolvedAt), 'PP')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>

                        {/* SLA Info Card */}
                        <div className="bg-indigo-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Clock className="w-24 h-24" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 relative z-10">Expected Time</h3>
                            <div className="text-3xl font-bold mb-1 relative z-10">{complaint.expectedResolutionTime}H</div>
                            <p className="text-indigo-200 text-sm relative z-10">Standard Resolution SLA</p>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
};

export default ComplaintDetails;

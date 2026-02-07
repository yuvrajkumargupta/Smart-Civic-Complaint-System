import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import API from '../api/axios';
import { formatDistanceToNow } from 'date-fns';

const CommentSection = ({ complaintId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = React.useCallback(async () => {
        try {
            const { data } = await API.get(`/comments/${complaintId}`);
            setComments(data.comments);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setLoading(false);
        }
    }, [complaintId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await API.post(`/comments/${complaintId}`, { text: newComment });
            setNewComment('');
            fetchComments(); // Refresh list
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-6">
            <h3 className="font-bold text-lg text-brand-slate mb-6 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Comments & Updates
            </h3>

            {/* Comments List */}
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="text-center py-8 text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Loading discussion...
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg text-slate-500 text-sm">
                        No comments yet. Start a discussion.
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex space-x-3">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                                ${comment.user.role === 'admin' ? 'bg-brand-indigo text-white' : 'bg-slate-200 text-slate-600'}
                            `}>
                                {comment.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="bg-slate-50 p-3 rounded-lg rounded-tl-none">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-xs font-bold ${comment.user.role === 'admin' ? 'text-brand-indigo' : 'text-slate-700'}`}>
                                            {comment.user.name}
                                            {comment.user.role === 'admin' && <span className="ml-1 text-[10px] bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded">ADMIN</span>}
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{comment.text}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-all placeholder:text-slate-400 text-sm"
                    disabled={submitting}
                />
                <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="absolute right-2 top-2 p-1.5 text-brand-indigo hover:bg-indigo-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
            </form>
        </div>
    );
};

export default CommentSection;

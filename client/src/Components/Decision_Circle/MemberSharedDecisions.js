// import React, { useEffect, useState } from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { getMemberSharedDecisions, mailToDecisionCirclePostComment, postComment, getComments, deleteComment } from './Networkk_Call';
// import { Card, CardContent, Typography, Grid, Avatar, CircularProgress, Box } from '@mui/material';
// import { AiFillEdit } from "react-icons/ai";
// import { MdOutlineDeleteForever } from "react-icons/md";
// import './MemberSharedDecisions.css';
// import { formatDistanceToNow, parseISO } from 'date-fns';
// import axios from 'axios';

// const MemberSharedDecisions = () => {
//     const [groups, setGroups] = useState(null);
//     const [decisions, setDecisions] = useState([]);
//     const [members, setMembers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [comments, setComments] = useState({});
//     const [newComments, setNewComments] = useState({});
//     const [buttonLoading, setButtonLoading] = useState({});

//     const { groupId } = useParams();
//     const location = useLocation();
//     const params = new URLSearchParams(location.search);
//     const groupName = params.get('group_name');

//     useEffect(() => {
//         if (groupId) {
//             fetchGroupDetails();
//             fetchSharedDecisions();
//         }
//     }, [groupId]);

//     const fetchGroupDetails = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get(`${process.env.REACT_APP_API_URL}/group/getUsersForGroup/${groupId}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             if (response.data.error) {
//                 toast.error(response.data.error);
//             } else {
//                 setGroups(response.data.group);
//                 setMembers(response.data.members);
//             }
//         } catch (err) {
//             toast.error('An error occurred while fetching the group details.');
//             console.error(err);
//         }
//     };

//     const fetchSharedDecisions = async () => {
//         try {
//             const data = await getMemberSharedDecisions(groupId);
//             setDecisions(data || []);
//             data.forEach((decision) => fetchComments(groupId, decision.decision_id));
//         } catch (error) {
//             setError('Failed to fetch shared decisions.');
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handlePostComment = async (decisionId, groupMemberId) => {
//         const comment = newComments[decisionId]?.trim();
//         if (!comment) {
//             return toast.error('Comment cannot be empty');
//         }
//         setButtonLoading((prevState) => ({ ...prevState, [decisionId]: true }));

//         try {
//             await postComment(groupId, groupMemberId, comment, decisionId);
//             setNewComments((prevState) => ({ ...prevState, [decisionId]: '' }));
//             toast.success('Comment posted successfully');
//             fetchComments(groupId, decisionId);
//         } catch (error) {
//             toast.error('Error posting comment');
//             console.error('Error posting comment:', error);
//         } finally {
//             setButtonLoading((prevState) => ({ ...prevState, [decisionId]: false }));
//         }
//     };

//     const handleMailToPostComment = async (decisionId, groupMemberIds, email) => {
//         const comment = newComments[decisionId]?.trim();
//         if (!comment) {
//             return toast.error('Comment cannot be empty');
//         }
//         setButtonLoading((prevState) => ({ ...prevState, [decisionId + '_email']: true }));
//         try {
//             await postComment(groupId, groupMemberIds, comment, decisionId);
//             const decision = decisions.find(d => d.decision_id === decisionId);
//             if (!decision) {
//                 throw new Error(`Decision with ID ${decisionId} not found`);
//             }
//             const responseToPostEmailComment = await mailToDecisionCirclePostComment(
//                 decision, groupMemberIds, comment, email
//             );
//             toast.success('Comment posted and email sent successfully');
//             console.log('Response to post email comment:', responseToPostEmailComment);
//             fetchComments(groupId, decisionId);
//         } catch (error) {
//             toast.error('Error sending email');
//             console.error('Error sending email:', error);
//         } finally {
//             setButtonLoading((prevState) => ({ ...prevState, [decisionId + '_email']: false }));
//         }
//     };


//     const fetchComments = async (groupId, decisionId) => {
//         try {
//             const response = await getComments(groupId, decisionId);
//             setComments((prevComments) => ({
//                 ...prevComments,
//                 [decisionId]: response || [],
//             }));
//         } catch (error) {
//             console.error('Error fetching comments:', error);
//         }
//     };

//     const handleDeleteComment = async (commentId, decisionId) => {
//         try {
//             await deleteComment(commentId);
//             setComments((prevComments) => ({
//                 ...prevComments,
//                 [decisionId]: prevComments[decisionId].filter((comment) => comment.id !== commentId),
//             }));
//             toast.success('Comment deleted successfully');
//         } catch (error) {
//             console.error("Error deleting comment:", error.response?.data);
//             toast.error('Error deleting comment');
//         }
//     };

//     const handleCommentChange = (decisionId, value) => {
//         setNewComments((prevState) => ({
//             ...prevState,
//             [decisionId]: value,
//         }));
//     };

//     if (loading) {
//         return <p>Loading...</p>;
//     }

//     if (error) {
//         return <p>{error}</p>;
//     }

//     return (
//         <div className='getGroup'>
//             {groups && (
//                 <div className="group-details">
//                     <h4>{groupName || groups.group_name}</h4>
//                     {members.length > 0 ? (
//                         <ul className="group-members">
//                             {members.map((member) => (
//                                 <li key={member.user_id}>
//                                     {member.displayname} ({member.email})
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p>No members found in this group.</p>
//                     )}
//                 </div>
//             )}

//             <h6>Shared with Decisions</h6>
//             <Grid container spacing={3}>
//                 {decisions.length > 0 ? (
//                     decisions.map((decision) => {
//                         const groupMemberIds = members.map((member) => member.user_id);
//                         return (
//                             <Grid item xs={12} key={decision.decision_id}>
//                                 <Card>
//                                     <CardContent>
//                                         <Typography variant="h6">{decision.decision_name}</Typography>
//                                         <Typography variant="body2"><b>Due Date:</b> {decision.decision_due_date ? new Date(decision.decision_due_date).toLocaleDateString() : ''}</Typography>
//                                         <Typography variant="body2"><b>Taken Date:</b> {decision.decision_taken_date ? new Date(decision.decision_taken_date).toLocaleDateString() : ''}</Typography>
//                                         <Typography variant="body2"><b>Decision Details:</b> {decision.user_statement}</Typography>
//                                         <Typography variant="body2"><b>Decision Reasons:</b> {decision.reasons ? decision.reasons.join(', ') : 'No reasons provided'}</Typography>
//                                         <Typography variant="body2">
//                                             <b>Selected Tags:</b> {decision.tags && decision.tags.map((tag) => tag.tag_name).join(', ')}
//                                         </Typography>
//                                         <Typography variant='h6'><b>Shared With: {decision.shared_by}</b></Typography>
//                                         <div className="comments-section">
//                                             <h6>Comments:</h6>
//                                             {comments[decision.decision_id]?.length > 0 ? (
//                                                 comments[decision.decision_id].filter(comment => comment.type_of_member === 'author').map((comment) => (
//                                                     <div key={comment.id} className={`comment-bubble ${comment.type_of_member === 'author' ? 'author-comment' : 'member-comment'}`}>
//                                                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                                             <Typography variant="body1" className="comment-text" style={{ fontWeight: 'bold', flex: 1 }}>
//                                                                 {comment.comment}
//                                                             </Typography>
//                                                             {comment.type_of_member === 'author' && (
//                                                                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                                                                     <AiFillEdit style={{ marginRight: '8px', cursor: 'pointer' }} />
//                                                                     <MdOutlineDeleteForever
//                                                                         style={{ cursor: 'pointer' }}
//                                                                         onClick={() => handleDeleteComment(comment.id, decision.decision_id)}
//                                                                     />
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                         <Box className="comment-content" style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
//                                                             <Avatar sx={{ textAlign:'end', bgcolor: "#526D82", color: "white", marginRight: 2 }}>
//                                                                 {comment.displayname[0]}
//                                                             </Avatar>
//                                                             <div style={{ flex: 1 }}>
//                                                                 <Typography variant='caption'>
//                                                                     {comment.displayname} | {comment.email} |
//                                                                     {comment.created_at === comment.updated_at
//                                                                         ? <span> {formatDistanceToNow(parseISO(comment.created_at), { addSuffix: true })}</span>
//                                                                         : <span>Edited {formatDistanceToNow(parseISO(comment.updated_at), { addSuffix: true })}</span>
//                                                                     }
//                                                                 </Typography>
//                                                             </div>
//                                                         </Box>
//                                                     </div>
//                                                 ))
//                                             ) : (
//                                                 <p>No comments available for this decision.</p>
//                                             )}
//                                             {/* {comments[decision.decision_id]?.length > 0 ? (
//                                                 comments[decision.decision_id].map((comment) => (
//                                                     <div
//                                                         key={comment.id}
//                                                         className={`comment-bubble author-comment`}
//                                                     >
//                                                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                                             <Typography variant="body1" className="comment-text" style={{ fontWeight: 'bold', flex: 1 }}>
//                                                                 {comment.comment}
//                                                             </Typography>
//                                                             {comment.type_of_member === 'author' && (
//                                                                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                                                                     <AiFillEdit style={{ marginRight: '8px', cursor: 'pointer' }} />
//                                                                     <MdOutlineDeleteForever
//                                                                         style={{ cursor: 'pointer' }}
//                                                                         onClick={() => handleDeleteComment(comment.id, decision.decision_id)}
//                                                                     />
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                         <Box className="comment-content" style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
//                                                             <Avatar sx={{ textAlign: 'end', bgcolor: "#526D82", color: "white", marginRight: 2 }}>
//                                                                 {comment.displayname[0]}
//                                                             </Avatar>
//                                                             <div style={{ flex: 1 }}>
//                                                                 <Typography variant='caption'>
//                                                                     {comment.displayname} | {comment.email} |
//                                                                     {comment.created_at === comment.updated_at
//                                                                         ? <span> {formatDistanceToNow(parseISO(comment.created_at), { addSuffix: true })}</span>
//                                                                         : <span>Edited {formatDistanceToNow(parseISO(comment.updated_at), { addSuffix: true })}</span>
//                                                                     }
//                                                                 </Typography>
//                                                             </div>
//                                                         </Box>
//                                                     </div>
//                                                 ))
//                                             ) : (
//                                                 <p>No comments available for this decision.</p>
//                                             )} */}
//                                             <textarea
//                                                 value={newComments[decision.decision_id] || ''}
//                                                 onChange={(e) => handleCommentChange(decision.decision_id, e.target.value)}
//                                                 placeholder="Add your comment..."
//                                             />
//                                             <button
//                                                 onClick={() => handlePostComment(decision.decision_id, groupMemberIds)}
//                                                 disabled={buttonLoading[decision.decision_id]}
//                                             >
//                                                 {buttonLoading[decision.decision_id] ? <CircularProgress size={24} /> : 'Post Comment'}
//                                             </button>
//                                             <button
//                                                 onClick={() => handleMailToPostComment(decision.decision_id, groupMemberIds)}
//                                                 disabled={buttonLoading[decision.decision_id + '_email']}
//                                             >
//                                                 {buttonLoading[decision.decision_id + '_email'] ? <CircularProgress size={24} /> : 'Send Email'}
//                                             </button>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             </Grid>
//                         );
//                     })
//                 ) : (
//                     <Typography style={{marginTop:'10px',marginLeft:'20px',padding:'5px'}}>No shared decisions available for this group.</Typography>
//                 )}
//             </Grid>
//             <ToastContainer />
//         </div>
//     );
// };

// export default MemberSharedDecisions;


import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { getMemberSharedDecisions, mailToDecisionCirclePostComment, postComment, getComments, deleteComment, updateComment } from './Networkk_Call';
import { Card, CardContent, Typography, Grid, Avatar, CircularProgress, Box, TextField, Button, Modal } from '@mui/material';
import { AiFillEdit } from "react-icons/ai";
import { MdOutlineDeleteForever } from "react-icons/md";
import './MemberSharedDecisions.css';
import { formatDistanceToNow, parseISO } from 'date-fns';
import axios from 'axios';

const MemberSharedDecisions = () => {
    const [groups, setGroups] = useState(null);
    const [user, setUser] = useState();
    const [decisions, setDecisions] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [comments, setComments] = useState({});
    const [newComments, setNewComments] = useState({});
    const [buttonLoading, setButtonLoading] = useState({});
    const [editComment, setEditComment] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editContent, setEditContent] = useState('');


    const { groupId } = useParams();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const groupName = params.get('group_name');


    useEffect(() => {
        if (groupId) {
            fetchGroupDetails();
            fetchSharedDecisions();
            fetchGroupExtra();
        }
    }, [groupId]);

    const fetchGroupDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/group/getUsersForGroup/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                setGroups(response.data.group);
                setMembers(response.data.members);
            }
            console.log('details',response.data)
        } catch (err) {
            toast.error('An error occurred while fetching the group details.');
            console.error(err);
        }
    };

    const fetchGroupExtra = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/group/getGroupDetails/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
            setUser(response.data)
            console.log('Group Admin Details:', response.data);
        } catch (err) {
            console.log("An Occured fetching data", err)
        }
    }

    const fetchSharedDecisions = async () => {
        try {
            const data = await getMemberSharedDecisions(groupId);
            setDecisions(data || []);
            data.forEach((decision) => fetchComments(groupId, decision.decision_id));
        } catch (error) {
            setError('Failed to fetch shared decisions.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostComment = async (decisionId) => {
        const comment = newComments[decisionId]?.trim();
        if (!comment) {
            return toast.error('Comment cannot be empty');
        }
        setButtonLoading((prevState) => ({ ...prevState, [decisionId]: true }));

        try {
            const dataToSend = {
                groupId,
                comment,
                decisionId,
            };

            console.log('Posting data:', dataToSend);
            await postComment(groupId, comment, decisionId);
            setNewComments((prevState) => ({ ...prevState, [decisionId]: '' }));
            toast.success('Comment posted successfully');
            fetchComments(groupId, decisionId);
        } catch (error) {
            toast.error('Error posting comment');
            console.error('Error posting comment:', error);
        } finally {
            setButtonLoading((prevState) => ({ ...prevState, [decisionId]: false }));
        }
    };

    const handleMailToPostComment = async (decisionId, email) => {
        const comment = newComments[decisionId]?.trim();
        if (!comment) {
            return toast.error('Comment cannot be empty');
        }
        setButtonLoading((prevState) => ({ ...prevState, [decisionId + '_email']: true }));
        try {
            await postComment(groupId, comment, decisionId);
            const decision = decisions.find(d => d.decision_id === decisionId);
            if (!decision) {
                throw new Error(`Decision with ID ${decisionId} not found`);
            }
            const responseToPostEmailComment = await mailToDecisionCirclePostComment(
                decision, groupId, comment, email
            );
            toast.success('Comment posted and email sent successfully');
            console.log('Response to post email comment:', responseToPostEmailComment);
            fetchComments(groupId, decisionId);
        } catch (error) {
            toast.error('Error sending email');
            console.error('Error sending email:', error);
        } finally {
            setButtonLoading((prevState) => ({ ...prevState, [decisionId + '_email']: false }));
        }
    };


    const fetchComments = async (groupId, decisionId) => {
        try {
            const response = await getComments(groupId, decisionId);
            setComments((prevComments) => ({
                ...prevComments,
                [decisionId]: response || [],
            }));
            console.log('comments:', response);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleDeleteComment = async (commentId, decisionId) => {
        try {
            await deleteComment(commentId);
            setComments((prevComments) => ({
                ...prevComments,
                [decisionId]: prevComments[decisionId].filter((comment) => comment.id !== commentId),
            }));
            toast.success('Comment deleted successfully');
        } catch (error) {
            console.error("Error deleting comment:", error.response?.data);
            toast.error('Error deleting comment');
        }
    };

    const handleCommentChange = (decisionId, value) => {
        setNewComments((prevState) => ({
            ...prevState,
            [decisionId]: value,
        }));
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const handleEditClick = (commentId) => {
        setEditComment(commentId.id);
        setEditContent(commentId.comment);
        setEditModalOpen(true);
    }


    const handleSaveEditComment = async () => {
        try {
            const updatedComment = { comment: editContent };
            await updateComment(editComment, updatedComment);
            toast.success('Comment Updated successfully');
            fetchComments();
            setEditModalOpen(false);
            setEditComment(null);
            setEditContent('')
        } catch (error) {
            console.error('Failed to update comment:', error);
            toast.error('Failed to update comment');
        } finally {
            setEditModalOpen(false);
        }
    }


    return (
        <div className='getGroup'>
            {groups && (
                <div className="group-details">
                    <h4>{groupName || groups.group_name}</h4>
                    {user && user.created_by ? (
                        <div className="group-adminContainer">
                            <Card key={user.created_by} className="group-adminCard">
                                <CardContent className="group-adminCardContent">
                                    <p className="group-adminLabel"><b>Admin</b></p>
                                    <Typography variant="body1" className="group-userInfo">
                                        {user.created_by} ({user.creator_email})
                                    </Typography>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <p className="loadingText">Loading user data...</p>
                    )}
                    {members.length > 0 ? (
                        <ul className="group-members">
                            {members.map((member) => (
                                <li key={member.user_id}>
                                    {member.displayname} ({member.email})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No members found in this group.</p>
                    )}
                </div>
            )}

            <h6>Shared with Decisions</h6>
            <Grid container spacing={3}>
                {decisions.length > 0 ? (
                    decisions.map((decision) => {
                        return (
                            <Grid item xs={12} key={decision.decision_id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">{decision.decision_name}</Typography>
                                        <Typography variant="body2"><b>Due Date:</b> {decision.decision_due_date ? new Date(decision.decision_due_date).toLocaleDateString() : ''}</Typography>
                                        <Typography variant="body2"><b>Taken Date:</b> {decision.decision_taken_date ? new Date(decision.decision_taken_date).toLocaleDateString() : ''}</Typography>
                                        <Typography variant="body2"><b>Decision Details:</b> {decision.user_statement}</Typography>
                                        <Typography variant="body2"><b>Decision Reasons:</b> {decision.reasons ? decision.reasons.join(', ') : 'No reasons provided'}</Typography>
                                        <Typography variant="body2">
                                            <b>Selected Tags:</b> {decision.tags && decision.tags.map((tag) => tag.tag_name).join(', ')}
                                        </Typography>
                                        <Typography variant='h6'><b>Shared With: {decision.shared_by}</b></Typography>
                                        <div className="comments-section">
                                            <h6>Comments:</h6>
                                            {comments[decision.decision_id]?.length > 0 ? (
                                                comments[decision.decision_id].map((comment, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: comment.type_of_member === 'author' ? 'flex-end' : 'flex-start',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        <div
                                                            className="comment-container"
                                                            style={{
                                                                maxWidth: '70%',
                                                                padding: '10px',
                                                                borderRadius: '8px',
                                                                border: '1px solid #ccc',
                                                                backgroundColor: comment.type_of_member === 'author' ? '#e1f5fe' : '#ffff',
                                                                textAlign: comment.type_of_member === 'author' ? 'left' : 'left',
                                                            }}
                                                        >
                                                            <Typography variant="body1" className="comment-text">
                                                                {comment.comment}
                                                            </Typography>
                                                            {comment.type_of_member === 'author' && (
                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                    <AiFillEdit style={{ marginRight: '8px', cursor: 'pointer' }}
                                                                        onClick={() => handleEditClick(comment)}
                                                                    />
                                                                    <MdOutlineDeleteForever
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={() => handleDeleteComment(comment.id, decision.decision_id)}
                                                                    />
                                                                </div>
                                                            )}
                                                            <Box>
                                                                <Box className="comment-content" style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                                                    <Avatar sx={{ textAlign: 'end', bgcolor: "#526D82", color: "white", marginRight: 2 }}>
                                                                        {comment.displayname[0]}
                                                                    </Avatar>
                                                                    <div style={{ flex: 1 }}>
                                                                        <Typography variant='caption'>
                                                                            {comment.displayname} | {comment.email} | {comment.created_at === comment.updated_at
                                                                                ? <span> {formatDistanceToNow(parseISO(comment.created_at), { addSuffix: true })}</span>
                                                                                : <span>Edited {formatDistanceToNow(parseISO(comment.updated_at), { addSuffix: true })}</span>
                                                                            }
                                                                        </Typography>
                                                                    </div>
                                                                </Box>
                                                            </Box>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <Typography variant="body2" style={{ margin: '10px 0' }}>
                                                    No comments yet.
                                                </Typography>
                                            )}
                                            <input
                                                value={newComments[decision.decision_id] || ''}
                                                onChange={(e) => handleCommentChange(decision.decision_id, e.target.value)}
                                                placeholder="Add your comment..."
                                                style={{ width: '90%', margin: '10px 0', padding: '8px' }}
                                            />
                                            <div className='member-button'>
                                                <button
                                                    onClick={() => handlePostComment(decision.decision_id)}
                                                    disabled={buttonLoading[decision.decision_id]}
                                                    style={{
                                                        padding: '8px 16px',
                                                        backgroundColor: '#007bff',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {buttonLoading[decision.decision_id] ? <CircularProgress size={24} /> : 'Post Comment'}
                                                </button>

                                                <button
                                                    onClick={() => handleMailToPostComment(decision.decision_id)}
                                                    disabled={buttonLoading[decision.decision_id + '_email']}
                                                    style={{
                                                        padding: '8px 16px',
                                                        backgroundColor: '#007bff',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {buttonLoading[decision.decision_id + '_email'] ? <CircularProgress size={24} /> : 'Post & Email'}
                                                </button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                ) : (
                    <Typography style={{ marginTop: '10px', marginLeft: '20px', padding: '5px' }}>No shared decisions available for this group.</Typography>
                )}
            </Grid>
            <Modal open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <Typography variant="h6" mb={2}>Edit Comment</Typography>
                    <TextField fullWidth multiline rows={4} value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                    <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                        <Button variant="contained" color="primary" onClick={handleSaveEditComment}>Save</Button>
                        <Button variant="outlined" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                    </Box>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    );
};

export default MemberSharedDecisions;
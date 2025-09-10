import React, { useEffect, useState } from 'react';
import { fetchPosts, createPost, editPost, deletePost, editComment, deleteComment } from '../../../frontend/api';

const PostList = ({ discussionId, currentUserId }) => {
  const [posts, setPosts] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [editContent, setEditContent] = useState({});
  const [commentEdit, setCommentEdit] = useState({});
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts(discussionId, token);
      setPosts(data);
    };
    loadPosts();
  }, [discussionId, token]);

  const handleCreatePost = async () => {
    await createPost(discussionId, { content: newContent }, token);
    setNewContent('');
    const data = await fetchPosts(discussionId, token);
    setPosts(data);
  };

  const handleEditPost = async (postId) => {
    await editPost(postId, { content: editContent[postId] }, token);
    setEditContent({ ...editContent, [postId]: '' });
    const data = await fetchPosts(discussionId, token);
    setPosts(data);
  };

  const handleDeletePost = async (postId) => {
    await deletePost(postId, token);
    const data = await fetchPosts(discussionId, token);
    setPosts(data);
  };

  const handleEditComment = async (postId, idx) => {
    await editComment(postId, idx, { text: commentEdit[`${postId}-${idx}`] }, token);
    setCommentEdit({ ...commentEdit, [`${postId}-${idx}`]: '' });
    const data = await fetchPosts(discussionId, token);
    setPosts(data);
  };

  const handleDeleteComment = async (postId, idx) => {
    await deleteComment(postId, idx, token);
    const data = await fetchPosts(discussionId, token);
    setPosts(data);
  };

  return (
    <div>
      <h2>Posts</h2>
      <input
        value={newContent}
        onChange={e => setNewContent(e.target.value)}
        placeholder="Write a new post..."
      />
      <button onClick={handleCreatePost}>Add Post</button>
      <ul>
        {posts.map((post, i) => (
          <li key={post._id}>
            <div>
              <strong>Post:</strong> {post.content}
              {post.author === currentUserId && (
                <>
                  <input
                    value={editContent[post._id] || ''}
                    onChange={e => setEditContent({ ...editContent, [post._id]: e.target.value })}
                    placeholder="Edit post..."
                  />
                  <button onClick={() => handleEditPost(post._id)}>Edit</button>
                  <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                </>
              )}
            </div>
            <ul>
              {post.comments && post.comments.map((comment, idx) => (
                <li key={idx}>
                  <span>{comment.text}</span>
                  {comment.userId === currentUserId && (
                    <>
                      <input
                        value={commentEdit[`${post._id}-${idx}`] || ''}
                        onChange={e => setCommentEdit({ ...commentEdit, [`${post._id}-${idx}`]: e.target.value })}
                        placeholder="Edit comment..."
                      />
                      <button onClick={() => handleEditComment(post._id, idx)}>Edit</button>
                      <button onClick={() => handleDeleteComment(post._id, idx)}>Delete</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;

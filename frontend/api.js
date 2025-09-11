// api.js
export async function fetchDiscussions(token) {
  const res = await fetch('/api/discussions', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function createDiscussion(data, token) {
  const res = await fetch('/api/discussions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchPosts(discussionId, token) {
  const res = await fetch(`/api/discussions/${discussionId}/posts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function createPost(discussionId, data, token) {
  const res = await fetch(`/api/discussions/${discussionId}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function editPost(postId, data, token) {
  const res = await fetch(`/api/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deletePost(postId, token) {
  const res = await fetch(`/api/posts/${postId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function editComment(postId, commentIdx, data, token) {
  const res = await fetch(`/api/posts/${postId}/comments/${commentIdx}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteComment(postId, commentIdx, token) {
  const res = await fetch(`/api/posts/${postId}/comments/${commentIdx}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

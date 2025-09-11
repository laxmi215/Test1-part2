// Add to api.js
export async function editDiscussion(discussionId, data, token) {
  const res = await fetch(`/api/discussions/${discussionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteDiscussion(discussionId, token) {
  const res = await fetch(`/api/discussions/${discussionId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

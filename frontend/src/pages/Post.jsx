import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!token) return navigate('/login');

    try {
      await axios.post(`http://localhost:5000/api/comments/post/${id}`, 
        { content: commentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentContent('');
      fetchPost(); // Refresh comments
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="row mt-4">
      <div className="col-md-8 offset-md-2">
        <div className="card mb-4">
          <div className="card-body">
            <h2>{post.title}</h2>
            <h6 className="text-muted mb-4">By {post.author?.username} | {new Date(post.createdAt).toLocaleDateString()}</h6>
            <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
            {userId && parseInt(userId) === post.userId && (
              <div className="mt-3">
                <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/edit/${id}`)}>Edit Post</button>
                <button className="btn btn-danger btn-sm" onClick={handleDeletePost}>Delete Post</button>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h4>Comments ({post.comments?.length || 0})</h4>
            {token ? (
              <form onSubmit={handleAddComment} className="mb-4">
                <div className="mb-3">
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Write a comment..." 
                    value={commentContent} 
                    onChange={e => setCommentContent(e.target.value)} 
                    required 
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Add Comment</button>
              </form>
            ) : (
              <p><a href="/login">Login</a> to add a comment.</p>
            )}

            <div className="comments-list">
              {post.comments?.map(comment => (
                <div key={comment.id} className="border-bottom pb-2 mb-2">
                  <strong>{comment.author?.username}</strong> <span className="text-muted" style={{fontSize: '0.8em'}}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  <p className="mb-0">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;

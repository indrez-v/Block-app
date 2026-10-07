import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      await axios.post('http://localhost:5000/api/posts', 
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    }
  };

  return (
    <div className="row mt-4">
      <div className="col-md-8 offset-md-2">
        <h3>Create New Post</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleCreate}>
          <div className="mb-3">
            <label>Title</label>
            <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Content</label>
            <textarea className="form-control" rows="6" value={content} onChange={e => setContent(e.target.value)} required></textarea>
          </div>
          <button type="submit" className="btn btn-success">Publish Post</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;

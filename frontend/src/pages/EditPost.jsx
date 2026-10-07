import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        setError('Failed to fetch post');
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      await axios.put(`http://localhost:5000/api/posts/${id}`, 
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update post');
    }
  };

  return (
    <div className="row mt-4">
      <div className="col-md-8 offset-md-2">
        <h3>Edit Post</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label>Title</label>
            <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Content</label>
            <textarea className="form-control" rows="6" value={content} onChange={e => setContent(e.target.value)} required></textarea>
          </div>
          <button type="submit" className="btn btn-success">Update Post</button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;

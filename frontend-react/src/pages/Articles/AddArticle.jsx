


import React from 'react'
import { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../axiosInstance';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function AddArticle() {

  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [subjects, setSubjects] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [previews, setPreviews] = useState({});
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    introduction: '',
    first_paragraph: '',
    second_paragraph: '',
    third_paragraph: '',
    first_media: null,
    second_media: null,
    third_media: null,
    subject: [],
    is_bestSeller: false,
    author: '',
    card: 'regular',
  });

  useEffect(() => {
    if (!user?.is_staff){
        navigate('/');
    } 
        

  const fetchOptions = async () => {
    const [subjRes, authRes] = await Promise.all([
        axiosInstance.get('/subjects/'),
        axiosInstance.get('/authors/')
      ]);
      setSubjects(subjRes.data);
      setAuthors(authRes.data);
    };

    fetchOptions();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === 'file') {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviews({ ...previews, [name]: reader.result });
        reader.readAsDataURL(file);
      }
    } else if (type === 'checkbox' && name === 'subject') {
      const updatedSubjects = formData.subject.includes(value)
        ? formData.subject.filter((s) => s !== value)
        : [...formData.subject, value];
      setFormData({ ...formData, subject: updatedSubjects });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
 
    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
            value.forEach((v) => data.append(`${key}`, v));
            } else {
            data.append(key, value);
            }
        });

        // for (let pair of data.entries()) {
        //     console.log(`${pair[0]}:`, pair[1]);
        // }

        // Get the access token from localStorage
        const accessToken = localStorage.getItem('accessToken');
        await axiosInstance.post('/articles/', data, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          });

      setMessage('Article submitted successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Error submitting article.');
    }
  };

  return (

    <div className=" w-full flex flex-col items-center justify-center dark:bg-[#1b1b1be1] dark:text-white">
      


        <div className='w-full my-20'>
            
          <section className="w-full max-w-4xl mx-auto p-6 bg-slate-400 dark:bg-[#1a1a1a] shadow rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">Add New Article</h2>

              {message && <p className="mb-4 font-semibold text-blue-600 dark:text-blue-300">{message}</p>}

              <div className="grid grid-cols-1 gap-4">
                  {['title', 'description', 'introduction', 'first_paragraph', 'second_paragraph', 'third_paragraph'].map((field) => (
                  <div key={field}>
                      <label className="block mb-1 font-semibold capitalize">{field.replace('_', ' ')}</label>
                      <textarea
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2 dark:text-black"
                      rows={field === 'description' ? 2 : 4}
                      />
                  </div>
                  ))}

                  {["first_media", "second_media", "third_media"].map((field) => (
                  <div key={field}>
                      <label className="block mb-1 font-semibold capitalize">{field.replace('_', ' ')}</label>
                      <input type="file" name={field} accept="image/*,video/*" onChange={handleChange} />
                      {previews[field] && (
                      <img src={previews[field]} alt="preview" className="mt-2 h-32 object-cover rounded" />
                      )}
                  </div>
                  ))}

                  <div>
                  <label className="block mb-1 font-semibold">Subjects</label>
                  <div className="flex flex-wrap gap-2">
                      {subjects.map((subj) => (
                      <label key={subj.id} className="flex items-center gap-1">
                          <input
                          type="checkbox"
                          name="subject"
                          value={subj.id}
                          checked={formData.subject.includes(String(subj.id))}
                          onChange={handleChange}
                          />
                          {subj.title}
                      </label>
                      ))}
                  </div>
                  </div>

                  <div>
                  <label className="block mb-1 font-semibold">Author</label>
                  <select name="author" value={formData.author} onChange={handleChange} className="w-full border rounded-lg p-2 dark:text-black">
                      <option value="">Select author</option>
                      {authors.map((auth) => (
                      <option key={auth.id} value={auth.id}>{auth.name}</option>
                      ))}
                  </select>
                  </div>

                  <div>
                  <label className="block mb-1 font-semibold">Card layout</label>
                  <select name="card" value={formData.card} onChange={handleChange} className="w-full border rounded-lg p-2 dark:text-black">
                      {["regular", "horizontal", "vartical", "mid", "flat", "end"].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                      ))}
                  </select>
                  </div>

                  <div className="flex items-center gap-2">
                  <input type="checkbox" name="is_bestSeller" checked={formData.is_bestSeller} onChange={handleChange} />
                  <label className="font-semibold">Best Seller</label>
                  </div>

                  <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Submit Article
                  </button>
              </div>
          </section>

        </div>

    </div>

  );
}

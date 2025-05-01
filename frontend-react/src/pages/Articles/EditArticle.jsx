

import './quillCustom.css';
import 'react-quill/dist/quill.snow.css';

import React from 'react'
import ReactQuill from 'react-quill';
import axiosInstance from '../../axiosInstance';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function EditArticle() {

  const navigate = useNavigate();
  const { slug  } = useParams();
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [authors, setAuthors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [previews, setPreviews] = useState({});
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    slug: '',
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

  // Get article instance from server
  useEffect(() => {

    const getArticle = async () => {
      try {
        const articleResponse = await axiosInstance.get(`/articles/${slug}/`);
        
        setArticle(articleResponse.data);
        setFormData({
            slug: articleResponse.data.slug || '',
            title: articleResponse.data.title || '',
            description: articleResponse.data.description || '',
            introduction: articleResponse.data.introduction || '',
            first_paragraph: articleResponse.data.first_paragraph || '',
            second_paragraph: articleResponse.data.second_paragraph || '',
            third_paragraph: articleResponse.data.third_paragraph || '',
            first_media: articleResponse.data.first_media || null,
            second_media: articleResponse.data.second_media || null,
            third_media: articleResponse.data.third_media || null,
            subject: articleResponse.data.subject.map((s) => s.id) || [],
            is_bestSeller: articleResponse.data.is_bestSeller || false,
            author: articleResponse.data.author_details?.id || '',
            card: articleResponse.data.card || 'regular',
          });
          setPreviews({
            first_media: articleResponse.data.first_media || null,
            second_media: articleResponse.data.second_media || null,
            third_media: articleResponse.data.third_media || null,
          });
          

      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };
    getArticle();
  }, [slug , user]);

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
                value.forEach((v) => data.append(key, v));
            } else if (key === "first_media" || key === "second_media" || key === "third_media") {
                if (value instanceof File) {
                    data.append(key, value);
                }else {
                    data.delete('first_media');
                }
            // Not file -> don't send
            } else {
                data.append(key, value);
            }
        });

        // for (let pair of data.entries()) {
        //     console.log(`${pair[0]}:`, pair[1]);
        // }

        // Get the access token from localStorage
        const accessToken = localStorage.getItem('accessToken');
        await axiosInstance.put(`/articles/${article.slug}/`, data, {
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

  const handleQuillChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Local host
  const fields = [
    { name : 'slug', type: 'input' },
    { name : 'title', type: 'input' },
    { name : 'description', type: 'textarea' },
    { name : 'introduction', type: 'textarea' },
    { name : 'first_paragraph', type: 'quill' },
    { name : 'second_paragraph', type: 'quill' },
    { name : 'third_paragraph', type: 'quill' },
  ];

  if (loading || !article) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-800 gap-10">
        <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl" />
        <div className="text-2xl text-white">
          <h6>Loading...</h6>
        </div>
      </div>
    );
  }

  return (

    <div className=" w-full flex flex-col items-center justify-center dark:bg-[#1b1b1be1] dark:text-white">

        <div className='w-full my-20'>
            
          <section className="w-[60%] mx-auto p-6 bg-slate-400 dark:bg-[#1a1a1a] shadow rounded-2xl">

            <h2 className="text-2xl font-bold mb-6">Edit Article</h2>

            {message && <p className="mb-4 font-semibold text-blue-600 dark:text-blue-300">{message}</p>}

            <div className="grid grid-cols-1 gap-4 text-xl ">

                {fields.map(({ name, type }) => (
                    <div key={name}>

                      <label className="block mb-1 font-semibold capitalize">{name.replace('_', ' ')}</label>

                      {type === 'input' && (
                          <input
                          type="text"
                          name={name}
                          value={formData[name] || ''}
                          onChange={handleChange}
                          className="w-full border rounded-lg p-2 dark:text-black"
                          />
                      )}

                      {type === 'textarea' && (
                          <textarea
                          name={name}
                          value={formData[name] || ''}
                          onChange={handleChange}
                          className="w-full border rounded-lg p-2 dark:text-black"
                          rows={2}
                          />
                      )}

                      {type === 'quill' && (
                        <ReactQuill
                        theme="snow"
                        value={formData[name] || ''}
                        onChange={(value) => handleQuillChange(name, value)}
                        modules={{
                          toolbar: [
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['bold', 'italic', 'underline'],
                            [{ align: [] }],
                            ['link'],
                            [{ indent: '-1' }, { indent: '+1' }],
                          ]
                        }}
                        className="bg-white dark:bg-[#2c2c2c] text-black dark:text-white rounded-lg"
                      />
                      )}

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
                      {subjects.map((subj, index) => (
                      <label key={subj.id} className="flex items-center gap-1">
                          <input
                          type="checkbox"
                          name="subject"
                          value={subj.id}
                          checked={formData.subject.includes(subj.id)}
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

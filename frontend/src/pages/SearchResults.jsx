import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const SearchResults = () => {
  
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      axios.get(`http://localhost:8000/search?q=${query}`)
        .then(res => setBlogs(res.data.blogs))
        .catch(err => console.error(err));
    }
  }, [query]);
  return (
    <div className="md:container-md bg-slate-50 md:mx-auto px-4 bg-slate-50 columns-1 md: h-auto w-3/4 p-4 mt-6 
      grid border-slate-100 bg-slate-50 dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl">
      <h2>Search Results for: "{query}"</h2>
        {blogs.length > 0 ? (
          blogs.map(blog => (
            <div key={blog._id} className="my-4 p-4 border rounded">
              <Link to={`/post/${blog._id}`}>
              <h3 className="text-xl font-bold">{blog.title}</h3>
              </Link>
              {/* <p>{blog.content}</p> */}
            </div>
          ))
        ) : (
          <div className="mt-4">
          <p>No matching posts found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
        )
        }
      </div>
  )
}

export default SearchResults;
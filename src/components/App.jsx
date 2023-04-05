import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/index.css"

function App() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(8);
  const [filterTerm, setFilterTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('/api/posts');
      setPosts(response.data.posts);
    }
    fetchData();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts

  .filter((post) => {
    if (filterTerm === "") return true;
    return (
      post.title.toLowerCase().includes(filterTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(filterTerm.toLowerCase()) ||
      post.categories.some((category) =>
        category.name.toLowerCase().includes(filterTerm.toLowerCase())
      )
    );
  })

  .slice(indexOfFirstPost, indexOfLastPost);      // to select only the posts that should be displayed on the current page.

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (event) => {         // this function updates the filterTerm when the user types into the filter input.
    setFilterTerm(event.target.value);
    setCurrentPage(1);
  }

  useEffect(() => {                               // to display an alert if there is no matching word
    if (filterTerm && currentPosts.length === 0) {
      window.alert("No categories found.");
    }
  }, [currentPosts]);

  return (
    <div className='container-page'>
      <div className='form-group'>
        <label htmlFor='filter'>Filter:</label>
        <input
          type='text'
          className='form-control'
          id='filter'
          value={filterTerm}
          onChange={handleFilterChange}
        />
      </div>
      <div className='row justify-content-center'>
        {currentPosts.map((post, index) => (                                    
          <div className='col-sm-5 card justify-content-center' key={post.id}>
            <div className="post-number">{indexOfFirstPost + index + 1}</div>  {/*  to display the card number */}
            <img className='card-img-top' src={post.author.avatar} alt="asd" />
                  <div className='card_header'>
                    <p className='font-author'>{post.author.name}</p>
                    <h6 className='card-title'>{post.title}</h6>
                    <p className='font-body'>{post.summary}</p>
                  </div>
                  <div className='card-body'>
                    <p className='font-title'>Categories</p>
                    <ol>
                    {post.categories.map((category) => (
                        <li>
                          <div key={category.id}>
                          <p className='font-category'>{category.name}</p>
                          </div>
                        </li>
                    ))}
                    </ol>
                  </div>
                </div>
        ))}
      </div>
      <nav className='navbar-page'>
        <ul className='pagination'>
          {Array.from({length: Math.ceil(posts.length / postsPerPage)}, (_, index) => (
            <li key={index+1} className='page-item'>
              <a onClick={() => paginate(index+1)} href='!#' className='page-link'>
                {index+1}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default App;
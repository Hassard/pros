import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const NewCorporate = ({ currentUser }) => {

  const allowed = currentUser.role === 'member' ? false : true;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/corporates',
    method: 'post',
    body: {
      title, content
    },
    onSuccess: () => Router.push('/corporates/')
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  }

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }
  };

  return (
    <div>
      <h1>Create Prayer</h1>
      { allowed && (
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea rows="12" value={content} onChange={(e) => setContent(e.target.value)} className="form-control" />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
      )}
    </div>
  );
};

export default NewCorporate;
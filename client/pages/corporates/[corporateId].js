import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const CorporateShow = ({ corporate }) => {
  const [title, setTitle] = useState(corporate.title);
  const [content, setContent] = useState(corporate.content);
  const { doRequest, errors } = useRequest({
    url: `/api/corporates/${corporate.id}`,
    method: 'put',
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
      <h1>Update Prayer</h1>
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
    </div>
  );
};

CorporateShow.getInitialProps = async (context, client) => {
  const { corporateId } = context.query;
  const { data } = await client.get(`/api/corporates/${corporateId}`);

  return { corporate: data };
};

export default CorporateShow;
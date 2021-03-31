import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const NewChurch = () => {
  const [name, setName] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/churches',
    method: 'post',
    body: {
      name
    },
    onSuccess: () => Router.push('/churches/')
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
      <h1>Create a Church</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="form-control" />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewChurch;
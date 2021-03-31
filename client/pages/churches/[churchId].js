import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const ChurchShow = ({ church }) => {
  const [name, setName] = useState(church.name);
  const { doRequest, errors } = useRequest({
    url: `/api/churches/${church.id}`,
    method: 'put',
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
      <h1>Update a Church</h1>
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

ChurchShow.getInitialProps = async (context, client) => {
  const { churchId } = context.query;
  const { data } = await client.get(`/api/churches/${churchId}`);

  return { church: data };
};

export default ChurchShow;
import Link from 'next/link';
import Router from 'next/router';
import { Fragment, useState, useEffect, useRef } from 'react';
import useRequest from '../../hooks/use-request';

const CorporatesIndex = ({ currentUser, corporates }) => {

  const [updateState, setUpdateState] = useState({
    id: '',
    active: true,
  });
  const { id, active } = updateState;

  const clickEvent = (event, stateObject) => {
    event.preventDefault();
    setUpdateState(stateObject);
  }

  const { doRequest, errors } = useRequest({
    url: '/api/corporates/status/',
    method: 'put',
    body: {
     id, active
    },
    onSuccess: () => Router.push('/corporates/')
  });

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    doRequest();
  }, [updateState]);

  const activeCorporateList = corporates.map(corporate => {
    return (
      corporate.active === true && 
      <tr key={corporate.id}>
        <td>{corporate.title}</td>
        <td>{corporate.content}</td>
        <td>
          {corporate.category === 'adoration' && 'Adoration'}
          {corporate.category === 'intercession' && 'Intercession'}
          {corporate.category === 'thanksgiving' && 'Thanksgiving'}
          {corporate.category === 'spiritual' && 'Spiritual Warfare'}
          {corporate.category === 'other' && 'Other'}
        </td>
        <td>
          { currentUser.role !== 'member' && (
            <a href="" onClick={(e) => clickEvent(e, {id: corporate.id, active: false})}>Deactivate</a>
          )}
        </td>
        <td>
          { currentUser.role !== 'member' && (
            <Link href="/corporates/[corporateId]" as={`/corporates/${corporate.id}`}>
              <a>View</a>
            </Link>
          )}
        </td>
      </tr>
    );
  });

  const inactiveCorporateList = corporates.map(corporate => {
    return (
      corporate.active === false && 
      <tr key={corporate.id}>
        <td>{corporate.title}</td>
        <td>{corporate.content}</td>
        <td>
          {corporate.category === 'adoration' && 'Adoration'}
          {corporate.category === 'intercession' && 'Intercession'}
          {corporate.category === 'thanksgiving' && 'Thanksgiving'}
          {corporate.category === 'spiritual' && 'Spiritual Warfare'}
          {corporate.category === 'other' && 'Other'}
        </td>
        <td>
          <a href="" onClick={(e) => clickEvent(e, {id: corporate.id, active: true})}>Activate</a>
        </td>
        <td>
          <Link href="/corporates/[corporateId]" as={`/corporates/${corporate.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <Fragment>
      <div>
        <h1>Prayer Chain</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Content</th>
              <th>Category</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {activeCorporateList}
          </tbody>
        </table>
        { currentUser.role !== 'member' && (
          <button onClick={() => Router.push('/corporates/new')} className="btn btn-primary">New Prayer</button>
        )}
      </div>
      { currentUser.role !== 'member' && (
      <div className="mt-5">
        <h5>Inactive</h5>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Content</th>
              <th>Category</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inactiveCorporateList}
          </tbody>
        </table>
      </div>
      )}
    </Fragment>
  )
};

CorporatesIndex.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/corporates');

  return { corporates: data };
};

export default CorporatesIndex;
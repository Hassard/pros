import Link from 'next/link';
import Router from 'next/router';

const CorporatesIndex = ({ currentUser, corporates }) => {

  const corporateList = corporates.map(corporate => {
    return (
      <tr key={corporate.id}>
        <td>{corporate.title}</td>
        <td>{corporate.content}</td>
        <td>
          <Link href="/corporates/[corporateId]" as={`/corporates/${corporate.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Prayer Chain</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {corporateList}
        </tbody>
      </table>
      { currentUser.role !== 'member' && (
        <button onClick={() => Router.push('/corporates/new')} className="btn btn-primary">New Prayer</button>
      )}
    </div>
  )
};

CorporatesIndex.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/corporates');

  return { corporates: data };
};

export default CorporatesIndex;
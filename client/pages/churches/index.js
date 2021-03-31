import Link from 'next/link';
import Router from 'next/router';

const ChurchesIndex = ({ currentUser, churches }) => {
  const churchList = churches.map(church => {
    return (
      <tr key={church.id}>
        <td>{church.name}</td>
        <td>
          <Link href="/churches/[churchId]" as={`/churches/${church.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Churches</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {churchList}
        </tbody>
      </table>
      <button onClick={() => Router.push('/churches/new')} className="btn btn-primary">New Church</button>
    </div>
  )
};

ChurchesIndex.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/churches');

  return { churches: data };
};

export default ChurchesIndex;
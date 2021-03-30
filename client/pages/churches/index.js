const ChurchesIndex = ({ churches }) => {
  return (
    <ul>
      {churches.map(church => {
        return <li key={church.id}>
          {church.name}
        </li>
      })}
    </ul>
  );
}

ChurchesIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/churches');

  return { churches: data };
};

export default ChurchesIndex;
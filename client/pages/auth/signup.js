import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const Signup = ({ churches }) => {
  const roles = [
    { label: "Owner", value: "owner" },
    { label: "Church Owner", value: "church_owner" },
    { label: "Member", value: "member" }
  ];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(roles[0]['value']);
  const [churchId, setChurchId] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email, password, role, churchId
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();    
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" />
      </div>
      <div className="form-group">
        <label>Role</label>
        <select onChange={e => setRole(e.currentTarget.value)} className="form-control">
          {roles.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Church</label>
        <select onChange={e => setChurchId(e.currentTarget.value)} className="form-control">
          <option key="0" value="">None</option>
          {churches.map(({ id, name }) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </div>
      {errors}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

Signup.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/churches');

  return { churches: data };
};

export default Signup;
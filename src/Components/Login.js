import React, { useState, useEffect } from 'react';
import { Segment, Header, Form, Input, Message, Button } from 'semantic-ui-react';

function Login(props) {
	const { setUser } = props;
	const [ error, setError ] = useState(null);
	const [ loading, setLoading ] = useState(false);
	const [ email, setEmail ] = useState('test@example.com');
	const [ password, setPassword ] = useState('password');
	const [ remember, setRemember ] = useState(false);

	useEffect(() => {
		let token = sessionStorage.getItem('token');
		if (!token) token = localStorage.getItem('token');

		if (token) {
			setLoading(true);

			//Login
			setUser({
				'name': 'Bob',
				'token': token,
				'operator': false
			});

			setLoading(false);
		}
		
	}, []);

	function attemptLogin() {
		let token = 'abc';

		setUser({
			'name': 'Bob',
			'token': token,
			'operator': false
		});

		sessionStorage.setItem('token', token);
		if (remember) localStorage.setItem('token', token);
	}

	return (
		<Segment style={{marginTop: '3rem', padding: '2rem'}}>
			<Header as="h2">Driver Login</Header>
			<Form onSubmit={attemptLogin} loading={loading}>
				{ error && <Message negative>{error}</Message> }

				<Form.Field required>
					<label>Email</label>
					<Input type="email" placeholder="Email" value={email} required onChange={(e, state) => setEmail(state.value)} />
				</Form.Field>
				<Form.Field required>
					<label>Password</label>
					<Input type="password" placeholder="Password" value={password} required onChange={(e, state) => setPassword(state.value)} />
				</Form.Field>

				<Form.Checkbox inline label='Remember me' checked={remember} onChange={(e, state) => setRemember(state.checked)} />
				<Button type="submit">Login</Button>
			</Form>
		</Segment>
	);
}

export default Login;

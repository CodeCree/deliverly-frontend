import React, { useState, useEffect } from 'react';
import { Segment, Header, Form, Input, Message, Button } from 'semantic-ui-react';

function Login(props) {
	const { setUser } = props;
	const [ error, setError ] = useState(null);
	const [ loading, setLoading ] = useState(false);
	const [ email, setEmail ] = useState('test@codecree.co.uk');
	const [ password, setPassword ] = useState('password');
	const [ remember, setRemember ] = useState(false);

	useEffect(() => {
		let token = sessionStorage.getItem('token');
		if (!token) token = localStorage.getItem('token');

		if (token) {
			setLoading(true);

			fetch(`${process.env.REACT_APP_API_ENDPOINT}/user/me`, {
				method: 'GET',
				headers: {
					'Authorization': token
				}
			})
			.then((response) => {
				response.json().then(data => {
					if (!data.success) {
						setError(data.message || data.error || 'An error occured. Please try again later');

						sessionStorage.removeItem('token');
						localStorage.removeItem('token');

						return setLoading(false);
					}

					setUser({
						'name': data.data.email,
						'token': token,
						'operator': data.data.operator
					});

					setError(null);
					return setLoading(false);
	
				}).catch((error) => {
					console.error(error);
					setError('An error occured. Please try again later');
					setLoading(false);
				});
			})
			.catch((error) => {
				console.error(error);
				setError('An error occured. Please try again later');
				setLoading(false);
			});
		}
		
	}, []);

	function attemptLogin() {
		setLoading(true);
		fetch(`${process.env.REACT_APP_API_ENDPOINT}/user/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		})
		.then((response) => {
			response.json().then(data => {
				if (!data.success) {
					setError(data.message || data.error || 'An error occured. Please try again later');
					return setLoading(false);
				}

				setUser({
					'name': data.email,
					'token': data.token,
					'operator': data.operator
				});

				sessionStorage.setItem('token', data.token);
				if (remember) localStorage.setItem('token', data.token);

				setError(null);
				return setLoading(false);

			}).catch((error) => {
				setError('An error occured. Please try again later');
				setLoading(false);
			});
		})
		.catch((error) => {
			setError('An error occured. Please try again later');
			setLoading(false);
		})

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

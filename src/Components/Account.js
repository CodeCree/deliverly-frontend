import React, { useState } from 'react';
import { Container, Header, Form, Message, Input, Button } from 'semantic-ui-react';

function Account(props) {
	const { user, setUser } = props;
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState(null);

	const [ firstName, setFirstName ] = useState(user.firstName);
	const [ lastName, setLastName ] = useState(user.lastName);
	const [ email, setEmail ] = useState(user.email);
	const [ password, setPassword ] = useState('');
	const [ passwordConfirm, setPasswordConfirm ] = useState('');

	function updateAccount() {
		if (password !== passwordConfirm) return setError('The password and password confirmation are not the same');
		setLoading(true);

		fetch(`${process.env.REACT_APP_API_ENDPOINT}/users/me`, {
			method: 'PUT',
			headers: {
				'Authorization': user.token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password || undefined
			})
		})
		.then((response) => {
			response.json().then(data => {
				if (!data.success) {
					setError(data.error || 'An error occured. Please try again later');
					return setLoading(false);
				}

				setError(null);
				data.data.token = user.token;
				setUser(data.data);
				return setLoading(false);

			}).catch((error) => {
				setError('An error occured. Please try again later');
				return setLoading(false);
			});
		})
		.catch((error) => {
			setError('An error occured. Please try again later');
			return setLoading(false);
		});
	}

	return (
		<Container>
			<Header as="h1">My Account</Header>
			<Form onSubmit={updateAccount} loading={loading}>
					{ error && <Message negative>{error}</Message> }

					<Form.Group widths="equal">
						<Form.Field required>
							<label>First Name</label>
							<Input fluid placeholder="Start Name" required value={firstName} onChange={(e, state) => setFirstName(state.value)} />
						</Form.Field>
						<Form.Field required>
							<label>Last Name</label>
							<Input fluid placeholder="Last Name" required value={lastName} onChange={(e, state) => setLastName(state.value)} />
						</Form.Field>
					</Form.Group>

					<Form.Field required>
						<label>Email</label>
						<Input fluid placeholder="Email" type="email" required value={email} onChange={(e, state) => setEmail(state.value)} />
					</Form.Field>

					<Form.Group widths="equal">
						<Form.Field>
							<label>Password Change</label>
							<Input fluid placeholder="Password Change" type="password" value={password} onChange={(e, state) => setPassword(state.value)} />
						</Form.Field>
						<Form.Field>
							<label>Password Change Confirm</label>
							<Input fluid placeholder="Password Change" type="password" value={passwordConfirm} onChange={(e, state) => setPasswordConfirm(state.value)} />
						</Form.Field>
					</Form.Group>

					<Button type="submit">Update</Button>
				</Form>
		</Container>
	)
}

export default Account;

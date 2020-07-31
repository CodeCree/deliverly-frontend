import React, { useState, useEffect } from 'react';
import { Container, Header, Card, Icon, Modal, Form, Button, Input, Message, Loader } from 'semantic-ui-react';
import { Link, Redirect, useRouteMatch, Switch, Route, useParams } from 'react-router-dom';

function Users(props) {
	function CreateUser() {
		const [ redirect, setRedirect ] = useState(null);
		const [ loading, setLoading ] = useState(false);
		const [ error, setError ] = useState(null);
	
		const [ firstName, setFirstName ] = useState('');
		const [ lastName, setLastName ] = useState('');
		const [ email, setEmail ] = useState('');
		const [ password, setPassword ] = useState('');
		const [ operator, setOperator ] = useState(false);

		function createUser() {
			fetch(`${process.env.REACT_APP_API_ENDPOINT}/users`, {
				method: 'POST',
				headers: {
					'Authorization': props.user.token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					firstName: firstName,
					lastName: lastName,
					email: email,
					password: password,
					operator: operator
				})
			})
			.then((response) => {
				response.json().then(data => {
					if (!data.success) {
						setError(data.error || 'An error occured. Please try again later');
						return setLoading(false);
					}

					setError(null);
					setRedirect('/users');
					setUsers(data.data);
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
			<Modal open={true} onClose={() => setRedirect('/users')}>
				{ redirect && <Redirect to={redirect} /> }
				<Modal.Header>Create User</Modal.Header>
				<Modal.Content>
					<Form onSubmit={createUser} loading={loading}>
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
	
						<Form.Group widths="equal">
							<Form.Field required>
								<label>Email</label>
								<Input fluid placeholder="Email" type="email" required value={email} onChange={(e, state) => setEmail(state.value)} />
							</Form.Field>
							<Form.Field required>
								<label>Password</label>
								<Input fluid placeholder="Password" type="password" required value={password} onChange={(e, state) => setPassword(state.value)} />
							</Form.Field>
						</Form.Group>

						<Form.Checkbox inline label='Operator' checked={operator} onChange={(e, state) => setOperator(state.checked)} />
	
						<Button type="submit">Create</Button>
					</Form>
				</Modal.Content>
			</Modal>
		)
	}
	
	function UserModal() {
		const { id } = useParams();

		const [ redirect, setRedirect ] = useState(false);
		const [ loading, setLoading ] = useState(false);
		const [ error, setError ] = useState(null);

		const [ firstName, setFirstName ] = useState('');
		const [ lastName, setLastName ] = useState('');
		const [ email, setEmail ] = useState('');
		const [ password, setPassword ] = useState('');
		const [ operator, setOperator ] = useState(false);
		const [ name, setName ] = useState('');
		const [ self, setSelf ] = useState(false);

		useEffect(() => {
			const user = users.find(user => user.id === id);
			if (!user) return setRedirect("/users");

			setFirstName(user.firstName);
			setLastName(user.lastName);
			setName(`${user.firstName} ${user.lastName}`);
			setEmail(user.email);
			setOperator(user.operator);
			setSelf(user.id === props.user.id);
		}, [id]);
	
		function updateUser() {
			fetch(`${process.env.REACT_APP_API_ENDPOINT}/users/${id}`, {
				method: 'PUT',
				headers: {
					'Authorization': props.user.token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					firstName: firstName,
					lastName: lastName,
					email: email,
					password: password || undefined,
					operator: self || operator
				})
			})
			.then((response) => {
				response.json().then(data => {
					if (!data.success) {
						setError(data.error || 'An error occured. Please try again later');
						return setLoading(false);
					}

					setRedirect(`/users`);
					setError(null);
					setUsers(data.data);
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
			<Modal open={true} onClose={() => setRedirect('/users')}>
				{ redirect && <Redirect to={redirect} /> }
				<Modal.Header>Update {name} {self && '(me)'}</Modal.Header>
				<Modal.Content>
					<Form onSubmit={updateUser} loading={loading}>
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
	
						<Form.Group widths="equal">
							<Form.Field required>
								<label>Email</label>
								<Input fluid placeholder="Email" type="email" required value={email} onChange={(e, state) => setEmail(state.value)} />
							</Form.Field>
							<Form.Field>
								<label>Password Change</label>
								<Input fluid placeholder="Password Change" type="password" value={password} onChange={(e, state) => setPassword(state.value)} />
							</Form.Field>
						</Form.Group>

						{ !self && <Form.Checkbox inline label='Operator' checked={operator} onChange={(e, state) => setOperator(state.checked)} /> }
	
						<Button type="submit">Update</Button>
					</Form>
				</Modal.Content>
			</Modal>
		)
	}
	
	
	function UserCard(props) {
		const { user, self } = props;
		return (
			<Card link as={Link} to={`/users/${user.id}`} color={self ? 'orange' : user.operator && 'teal'}>
				<Card.Content>
					<Card.Header>{user.firstName} {user.lastName}</Card.Header>
					<Card.Meta>
						<Icon name="letter" />
						{user.email}
					</Card.Meta>
					{ user.operator && <Card.Description>{self ? 'Me' : 'Operator'}</Card.Description> }
				</Card.Content>
			</Card>
		);
	}

	const { path } = useRouteMatch();
	const [ loading, setLoading ] = useState(true);

	const [ users, setUsers ] = useState([]);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_ENDPOINT}/users`, {
			headers: {
				'Authorization': props.user.token
			}
		})
		.then((response) => {
			response.json().then(data => {
				if (!data.success) {
					return setLoading(false);
				}

				setUsers(data.data);
				return setLoading(false);

			}).catch((error) => {
				return setLoading(false);
			});
		})
		.catch((error) => {
			return setLoading(false);
		});
	}, []);

	return (
		<Container>
			<Header as="h1">Users</Header>
			Manage Users

			{ loading ? <Loader active /> :
				<>
					<Card.Group doubling itemsPerRow={4} style={{marginTop: '1rem'}}>
						<Card link as={Link} to="/users/new" style={{padding: '1rem'}}>
							<Icon name="plus" size="huge" color="grey" link style={{margin: 'auto'}} />
						</Card>

						{ users.map(user => <UserCard key={user.id} user={user} self={user.id === props.user.id} />)}
					</Card.Group>

					<Switch>
						<Route path={`${path}/new`} component={CreateUser} />
						<Route path={`${path}/:id`} component={UserModal} />
					</Switch>
				</>
			}	 
		</Container>
	);
}

export default Users;
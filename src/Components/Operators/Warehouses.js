import React, { useState, useEffect } from 'react';
import { Container, Header, Card, Icon, Modal, Form, Button, Input, Message, Loader } from 'semantic-ui-react';
import { Link, Redirect, useRouteMatch, Switch, Route, useParams } from 'react-router-dom';
import Map from '../Map';

function Warehouses(props) {
	function CreateWarehouse() {
		const [ redirect, setRedirect ] = useState(null);
		const [ loading, setLoading ] = useState(false);
		const [ error, setError ] = useState(null);
	
		const [ name, setName ] = useState('');
		const [ street, setStreet ] = useState('');
		const [ town, setTown ] = useState('');
		const [ postcode, setPostcode ] = useState('');
	
		function createWarehouse() {
			fetch(`${process.env.REACT_APP_API_ENDPOINT}/warehouse`, {
				method: 'POST',
				headers: {
					'Authorization': user.token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: name,
					address: {
						street: street,
						city: town,
						postcode: postcode
					}
				})
			})
			.then((response) => {
				response.json().then(data => {
					if (!data.success) {
						setError(data.error || 'An error occured. Please try again later');
						return setLoading(false);
					}

					setError(null);
					setRedirect('/warehouses');
					setWarehouses(data.data);
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
			<Modal open={true} onClose={() => setRedirect('/warehouses')}>
				{ redirect && <Redirect to={redirect} /> }
				<Modal.Header>Create Warehouse</Modal.Header>
				<Modal.Content>
					<Form onSubmit={createWarehouse} loading={loading}>
						{ error && <Message negative>{error}</Message> }

						<Form.Field required>
							<label>Name</label>
							<Input fluid placeholder="Name" required value={name} onChange={(e, state) => setName(state.value)} />
						</Form.Field>
	
						<Form.Group widths="equal">
							<Form.Field required>
								<label>Street</label>
								<Input fluid placeholder="Street" required value={street} onChange={(e, state) => setStreet(state.value)} />
							</Form.Field>
							<Form.Field required>
								<label>Town</label>
								<Input fluid placeholder="Town" required value={town} onChange={(e, state) => setTown(state.value)} />
							</Form.Field>
							<Form.Field required>
								<label>Postcode</label>
								<Input fluid placeholder="Postcode" required value={postcode} onChange={(e, state) => setPostcode(state.value)} />
							</Form.Field>
						</Form.Group>
	
						<Button type="submit">Create</Button>
					</Form>
				</Modal.Content>
			</Modal>
		)
	}
	
	function WarehouseModal() {
		const { id } = useParams();

		const [ redirect, setRedirect ] = useState(false);
		const [ loading, setLoading ] = useState(false);
		const [ error, setError ] = useState(null);

		const [ name, setName ] = useState();
		const [ street, setStreet ] = useState();
		const [ town, setTown ] = useState();
		const [ postcode, setPostcode ] = useState();
		const [ mapItems, setMapItems ] = useState([]);

		useEffect(() => {
			const warehouse = warehouses.find(warehouse => warehouse.id === id);
			if (!warehouse) return setRedirect("/warehouses");

			setName(warehouse.name);
			setStreet(warehouse.address.street);
			setTown(warehouse.address.town);
			setPostcode(warehouse.address.postcode);
			setMapItems([{ position: warehouse.address.location }]);
			console.log(warehouse.address.location);
		}, [id]);
	
		function updateWarehouse() {
			fetch(`${process.env.REACT_APP_API_ENDPOINT}/warehouse/${id}`, {
				method: 'PUT',
				headers: {
					'Authorization': user.token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: name,
					address: {
						street: street,
						city: town,
						postcode: postcode
					}
				})
			})
			.then((response) => {
				response.json().then(data => {
					if (!data.success) {
						setError(data.error || 'An error occured. Please try again later');
						return setLoading(false);
					}

					setRedirect(`/warehouses`);
					setError(null);
					setWarehouses(data.data);
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
			<Modal open={true} onClose={() => setRedirect('/warehouses')}>
				{ redirect && <Redirect to={redirect} /> }
				<Modal.Header>Update {name}</Modal.Header>
				<Modal.Content>
					<Form onSubmit={updateWarehouse} loading={loading}>
						{ error && <Message negative>{error}</Message> }
						<Form.Field required>
							<label>Name</label>
							<Input fluid placeholder="Name" required value={name} onChange={(e, state) => setName(state.value)} />
						</Form.Field>
	
						<Form.Group widths="equal">
							<Form.Field required>
								<label>Street</label>
								<Input fluid placeholder="Street" required value={street} onChange={(e, state) => setStreet(state.value)} />
							</Form.Field>
							<Form.Field required>
								<label>Town</label>
								<Input fluid placeholder="Town" required value={town} onChange={(e, state) => setTown(state.value)} />
							</Form.Field>
							<Form.Field required>
								<label>Postcode</label>
								<Input fluid placeholder="Postcode" required value={postcode} onChange={(e, state) => setPostcode(state.value)} />
							</Form.Field>
						</Form.Group>

						<Map items={mapItems} />
	
						<Button type="submit">Update</Button>
					</Form>
				</Modal.Content>
			</Modal>
		)
	}
	
	
	function WarehouseCard(props) {
		const { warehouse } = props;
		return (
			<Card link as={Link} to={`/warehouses/${warehouse.id}`}>
				<Card.Content>
					<Card.Header>{warehouse.name}</Card.Header>
					<Card.Description>
						<p>
							{warehouse.address.street}
							<br />{warehouse.address.town}
							<br />{warehouse.address.postcode}
						</p>
					</Card.Description>
				</Card.Content>
			</Card>
		);
	}

	const { user } = props;
	const { token } = user;
	const { path } = useRouteMatch();
	const [ loading, setLoading ] = useState(true);

	const [ warehouses, setWarehouses ] = useState([]);
	const [ mapItems, setMapItems ] = useState([]);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_ENDPOINT}/warehouses`, {
			headers: {
				'Authorization': token
			}
		})
		.then((response) => {
			response.json().then(data => {
				if (!data.success) {
					return setLoading(false);
				}

				setWarehouses(data.data);
				return setLoading(false);

			}).catch((error) => {
				return setLoading(false);
			});
		})
		.catch((error) => {
			return setLoading(false);
		});
	}, [token]);

	useEffect(() => {
		setMapItems(warehouses.map(warehouse => {
			return {
				position: warehouse.address.location
			}
		}))
	}, [warehouses]);

	return (
		<Container>
			<Header as="h1">Warehouses</Header>
			Manage warehouses

			{ loading ? <Loader active /> :
				<>
					<Card.Group doubling itemsPerRow={4} style={{marginTop: '1rem'}}>
						<Card link as={Link} to="/warehouses/new" style={{padding: '1rem'}}>
							<Icon name="plus" size="huge" color="grey" link style={{margin: 'auto'}} />
						</Card>

						{ warehouses.map(warehouse => <WarehouseCard key={warehouse.id} warehouse={warehouse} />)}
					</Card.Group>

					<Switch>
						<Route path={`${path}/new`} component={CreateWarehouse} />
						<Route path={`${path}/:id`} component={WarehouseModal} />
					</Switch>

					<Map items={mapItems} />
				</>
			}	 
		</Container>
	);
}

export default Warehouses;

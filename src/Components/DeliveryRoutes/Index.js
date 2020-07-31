import React, { useState, useEffect } from 'react';
import { Container, Header, Card, Icon, Modal, Form, Dropdown, Message, Button, Dimmer, Loader } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';

function IndexDeliveryRoutes(props) {
	function RouteCard(props) {
		const { route } = props;
	
		return (
			<Card link as={Link} to={`/route/${route.id}`}>
				<Card.Content>
					<Card.Header>{route.startedAt}</Card.Header>
					{ route.endedAt && <Card.Meta>
						<Icon name="clock" />
						<span className="number">{route.endedAt}</span>
					</Card.Meta> }
				</Card.Content>
			</Card>
		);
	}

	function CreateRouteModal() {
		const [ endWarehouseId, setEndWarehouseId ] = useState(null);
		const [ warehouses, setWarehouses ] = useState([]);
		const [ loading, setLoading ] = useState(true);
		const [ error, setError ] = useState(null);
		const [ redirect, setRedirect ] = useState(null);

		useEffect(() => {
			setLoading(true);

			fetch(`${process.env.REACT_APP_API_ENDPOINT}/warehouses`, {
				headers: {
					'Authorization': user.token,
				}
			})
			.then((response) => {
				response.json().then(data => {
					if (!data.success) {
						setError(data.error || 'An error occured. Please try again later');
						return setLoading(false);
					}

					setError(null);
					
					setWarehouses(data.data.map(warehouse => { return {
						key: warehouse.id,
						value: warehouse.id,
						text: `${warehouse.name} - ${warehouse.address.street}, ${warehouse.address.town}, ${warehouse.address.postcode}`
					}}));

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
		}, []);

		function createRoute() {
			if (!endWarehouseId) return setError('Please select a destination warehouse');

			setLoading(true);
			setError(null);

			fetch(`${process.env.REACT_APP_API_ENDPOINT}/route`, {
				method: 'POST',
				headers: {
					'Authorization': user.token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					endWarehouse: endWarehouseId
				})
			})
			.then((response) => {
				response.json().then(data => {
					if (!data.success) {
						setError(data.error || 'An error occured. Please try again later');
						return setLoading(false);
					}

					setError(null);
					setRedirect(`/route/${data.data}`);
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
			<Modal open={true} onClose={() => setShowCreateRouteModal(false)}>
				{ redirect && <Redirect to={redirect} /> }
				<Modal.Header>Create Route</Modal.Header>
				<Modal.Content>
					<Form onSubmit={createRoute} loading={loading}>
						{ error && <Message negative>{error}</Message> }

						<Form.Field required>
							<label>Destination Warehouse</label>
							<Dropdown placeholder="Destination warehouse" fluid selection search options={warehouses} onChange={(e, state) => setEndWarehouseId(state.value)} value={endWarehouseId} required />
						</Form.Field>
	
						<Button type="submit">Create</Button>
					</Form>
				</Modal.Content>
			</Modal>
		)
	}

	const { user } = props;
	const [ showCreateRouteModal, setShowCreateRouteModal ] = useState(false);
	const [ loading, setLoading ] = useState(true);
	const [ routes, setRoutes ] = useState([]);

	useEffect(() => {
		setLoading(true);
		fetch(`${process.env.REACT_APP_API_ENDPOINT}/routes`, {
			headers: {
				'Authorization': user.token
			}
		})
		.then((response) => {
			response.json().then(data => {
				if (!data.success) {
					return setLoading(false);
				}
				console.log(data);

				setRoutes(data.data);
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
			<Header as="h1">My Routes</Header>
			Manage and create routes here

			{ showCreateRouteModal && <CreateRouteModal /> }
			{ loading && <Dimmer active><Loader active>Loading</Loader></Dimmer>}
			<Card.Group doubling itemsPerRow={4} style={{marginTop: '1rem'}}>
				<Card link style={{padding: '1rem'}} onClick={() => setShowCreateRouteModal(true)}>
					<Icon name="plus" size="huge" color="light grey" link style={{margin: 'auto'}} />
				</Card>

				{ routes.map(route => <RouteCard key={route.id} route={route} />)}
			</Card.Group>
			 
		</Container>
	);
}

export default IndexDeliveryRoutes;

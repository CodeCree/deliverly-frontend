import React, { useState, useEffect } from 'react';
import { Container, Header, Card, Icon, Image, Modal, Form, Dropdown, Message, Button } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';

function IndexDeliveryRoutes(props) {
	function RouteCard(props) {
		const { route } = props;
	
		return (
			<Card link as={Link} to={`/route/${route.id}`}>
				<Image src={route.mapImage} alt="An image of the map of the route" />
				<Card.Content>
					<Card.Header>{route.startTime}</Card.Header>
					<Card.Meta>
						<Icon name="box" />
						<span className="number">{route.packageCount} packages</span>
					</Card.Meta>
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
						setError(data.error || data.message || 'An error occured. Please try again later');
						return setLoading(false);
					}

					setError(null);
					
					setWarehouses(data.data.map(warehouse => { return {
						key: warehouse.uuid,
						value: warehouse.uuid,
						text: `${warehouse.name} - ${warehouse.address.street}, ${warehouse.address.city}, ${warehouse.address.postcode}`
					}}));

					return setLoading(false);
	
				}).catch((error) => {
					setError(error || 'An error occured. Please try again later');
					return setLoading(false);
				});
			})
			.catch((error) => {
				setError(error || 'An error occured. Please try again later');
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
						setError(data.error || data.message || 'An error occured. Please try again later');
						return setLoading(false);
					}

					setError(null);
					setRedirect(`/route/${data.id}`);
					return setLoading(false);
	
				}).catch((error) => {
					setError(error || 'An error occured. Please try again later');
					return setLoading(false);
				});
			})
			.catch((error) => {
				setError(error || 'An error occured. Please try again later');
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
	const [ routes, setRoutes ] = useState([{
		id: 'asda214',
		mapImage: 'https://miro.medium.com/max/4800/0*hGYjDjU-YL4ipJvI.',
		packageCount: 4,
		startTime: '30/07/2020 11:49'
	}]);

	return (
		<Container>
			<Header as="h1">My Routes</Header>
			Manage and create routes here

			{ showCreateRouteModal && <CreateRouteModal /> }
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

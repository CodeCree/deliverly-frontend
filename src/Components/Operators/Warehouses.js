import React, { useState, useEffect } from 'react';
import { Container, Header, Card, Icon, Image, Modal, Form, Button, Input, Message } from 'semantic-ui-react';
import { Link, Redirect, useRouteMatch, Switch, Route, useParams } from 'react-router-dom';
import Map from '../Map';

function Warehouses() {
	function CreateWarehouse(props) {
		const [ redirect, setRedirect ] = useState(false);
		const [ error, setError ] = useState(null);
	
		const [ name, setName ] = useState('');
		const [ street, setStreet ] = useState('');
		const [ town, setTown ] = useState('');
		const [ postcode, setPostcode ] = useState('');
	
		function createWarehouse() {
			setError('Invalid');
		}
	
		return (
			<Modal open={true} onClose={() => setRedirect('/warehouses')}>
				{ redirect && <Redirect to={redirect} /> }
				<Modal.Header>Create Warehouse</Modal.Header>
				<Modal.Content>
					{ error && <Message negative>{error}</Message> }
					<Form onSubmit={createWarehouse}>
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
		const [ error, setError ] = useState(null);

		const [ name, setName ] = useState();
		const [ street, setStreet ] = useState();
		const [ town, setTown ] = useState();
		const [ postcode, setPostcode ] = useState('');

		useEffect(() => {
			const warehouse = warehouses.find(warehouse => warehouse.id === id);
			if (!warehouse) setRedirect("/warehouses");

			setName(warehouse.name);
			setStreet(warehouse.address.street);
			setTown(warehouse.address.town);
			setPostcode(warehouse.address.postcode);
		}, [id]);
	
		function updateWarehouse() {
			setError('Invalid');
		}
	
		return (
			<Modal open={true} onClose={() => setRedirect('/warehouses')}>
				{ redirect && <Redirect to={redirect} /> }
				<Modal.Header>Update {name}</Modal.Header>
				<Modal.Content>
					{ error && <Message negative>{error}</Message> }
					<Form onSubmit={updateWarehouse}>
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
				<Image src={warehouse.image} alt="An image of the warehouse" />
				<Card.Content>
					<Card.Header>{warehouse.name}</Card.Header>
					<Card.Meta>
						<Icon name="box" />
						<span className="number">{warehouse.packageCount} packages</span>
					</Card.Meta>
				</Card.Content>
			</Card>
		);
	}

	const { path } = useRouteMatch();

	const [ warehouses, setWarehouses ] = useState([{
		id: 'asda214',
		name: 'Warehouse 1',
		image: 'https://cdn.pixabay.com/photo/2015/07/08/03/13/forklift-835340_960_720.jpg',
		packageCount: 23,
		address: {
			street: 'ABC',
			town: 'CBD',
			postcode: 'L00 000',
			location: [53.7389, -0.33240]
		}
	}]);
	const [ mapItems, setMapItems ] = useState([{
		position: [53.7389, -0.33240]
	}, {
		position: [53.788926, -0.425788]
	}, {
		position: [53.840070, -0.436073]
	}]);

	return (
		<Container>
			<Header as="h1">Warehouses</Header>
			Manage warehouses

			<Card.Group doubling itemsPerRow={4} style={{marginTop: '1rem'}}>
				<Card link as={Link} to="/warehouses/new" style={{padding: '1rem'}}>
					<Icon name="plus" size="huge" color="light grey" link style={{margin: 'auto'}} />
				</Card>

				{ warehouses.map(warehouse => <WarehouseCard key={warehouse.id} warehouse={warehouse} />)}
			</Card.Group>

			<Switch>
				<Route path={`${path}/new`} component={CreateWarehouse} />
				<Route path={`${path}/:id`} component={WarehouseModal} />
			</Switch>

			<Map items={mapItems} />
			 
		</Container>
	);
}

export default Warehouses;

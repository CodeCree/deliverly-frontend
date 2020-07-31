import React, { useState, useEffect } from 'react';
import { Modal, Input, Form, Message, Dropdown, Button, Label, Header, Segment, Divider, Search } from 'semantic-ui-react';
import { setRTLTextPlugin } from 'mapbox-gl';

function Create(props) {
	const { code, token, close, created } = props;

	function CreatePackage() {
		const [ error, setError ] = useState(null);
		const [ loading, setLoading ] = useState(true);

		const [ warehouses, setWarehouses ] = useState([]);

		const [ name, setName ] = useState();
		const [ email, setEmail ] = useState();
		const [ weight, setWeight ] = useState();
		const [ street, setStreet ] = useState();
		const [ town, setTown ] = useState();
		const [ postcode, setPostcode ] = useState();
		const [ warehouseId, setWarehouseId ] = useState();

		useEffect(() => {
			setLoading(true);
	
			fetch(`${process.env.REACT_APP_API_ENDPOINT}/warehouses`, {
				headers: {
					'Authorization': token,
				}
			})
			.then((response) => {
				response.json().then(data => {
					if (!data.success) {
						setError(data.error || 'An error occured. Please try again later');
						return setLoading(false);
					}
	
					setError(null);
					
					let _warehouses = data.data.map(warehouse => { return {
						key: warehouse.id,
						value: warehouse.id,
						text: `${warehouse.name} - ${warehouse.address.street}, ${warehouse.address.town}, ${warehouse.address.postcode}`
					}});
					_warehouses.unshift({
						key: 0,
						value: null,
						text: ''
					});
	
					setWarehouses(_warehouses);
	
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

		function create() {
			setLoading(true);
			fetch(`${process.env.REACT_APP_API_ENDPOINT}/package`, {
				method: 'POST',
				headers: {
					'Authorization': token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					recipient: name,
					email: email,
					address: {
						street: street,
						city: town,
						postcode: postcode,
					},
					weight: weight,
					warehouse: warehouseId,
					qrCode: code
				})
			})
			.then((response) => {
				response.json().then(data => {
					if (!data.success) {
						setError(data.error || 'An error occured. Please try again later');
						return setLoading(false);
					}

					created(data.data);
					close();
		
					setError(null);
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
			<>
				<Header as="h2">Create a new package</Header>
				<Form onSubmit={create} loading={loading}>
					{ error && <Message negative>{error}</Message> }

					<Form.Group widths="equal">
						<Form.Field required>
							<label>Recipient Name</label>
							<Input fluid placeholder="Name" required value={name} onChange={(e, state) => setName(state.value)} />
						</Form.Field>
						<Form.Field required>
							<label>Recipient Email</label>
							<Input fluid placeholder="Email" required value={email} onChange={(e, state) => setEmail(state.value)} />
						</Form.Field>
					</Form.Group>

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

					<Form.Field>
						<label>Current Warehouse</label>
						<Dropdown placeholder="Warehouse" clearable fluid search selection options={warehouses} value={warehouseId} onChange={(e, state) => setWarehouseId(state.value)} />
					</Form.Field>

					<Form.Field required>
						<label>Package Weight</label>
						<Input fluid placeholder="Weight (grams)" labelPosition="right" type="number" min="0" max={200000} value={weight} onChange={(e, state) => setWeight(state.value < 0 ? 0 : (state.value > 200000 ? 200000 : state.value))}>
							<input />
							<Label>g</Label>
						</Input>
					</Form.Field>


					<Button type="submit">Create</Button>
				</Form>
			</>
		)
	}

	function FindPackage() {
		const [ formLoading, setFormLoading ] = useState(false);
		const [ loading, setLoading ] = useState(false);
		const [ error, setError ] = useState(null);
		const [ packageCode, setPackageCode ] = useState();
		const [ packages, setPackages ] = useState([]);

		function append() {
			setFormLoading(true);
			fetch(`${process.env.REACT_APP_API_ENDPOINT}/qr-code/${code}`, {
				method: 'POST',
				headers: {
					'Authorization': token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					package: packageCode
				})
			})
			.then((response) => {
				response.json().then(data => {
					if (!data.success) {
						setError(data.error || 'An error occured. Please try again later');
						return setFormLoading(false);
					}

					created(data.data);
					close();
		
					setError(null);
					return setFormLoading(false);
		
				}).catch((error) => {
					setError('An error occured. Please try again later');
					return setFormLoading(false);
				});
			})
			.catch((error) => {
				setError('An error occured. Please try again later');
				return setFormLoading(false);
			});
		}

		function handleSearchChange(e, state) {
			setLoading(true);
			fetch(`${process.env.REACT_APP_API_ENDPOINT}/package/search?query=${encodeURIComponent(state.value)}`, {
				headers: {
					'Authorization': token
				}
			})
			.then((response) => {
				response.json().then(data => {
					if (!data.success) {
						setError(data.error || 'An error occured. Please try again later');
						return setLoading(false);
					}

					setPackages(data.data);
		
					setError(null);
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
			<>
				<Header as="h2">Add the barcode to a package</Header>
				<Form onSubmit={append} loading={formLoading}>
					{ error && <Message negative>{error}</Message> }

					<Form.Field required>
						<label>Package</label>
						<Search loading={loading} value={packageCode} required onResultSelect={(e, state) => setPackageCode(state.result.title)} onSearchChange={handleSearchChange} results={packages} fluid />
					</Form.Field>

					<Button type="submit">Set</Button>
				</Form>
			</>
		);
	}

	return (
		<Modal open={true} onClose={close}>
			<Modal.Header>New QR Code</Modal.Header>
			<Modal.Content>
				<Segment basic>
					<CreatePackage />

					<Divider horizontal section>Or</Divider>

					<FindPackage />
				</Segment>
				
			</Modal.Content>
		</Modal>
	)
}

export default Create;
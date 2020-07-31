import React, { useState } from 'react';
import { Container, Header, Segment, Message, Grid, Card, Icon, Loader, Dimmer } from 'semantic-ui-react';
import QrReader from 'react-qr-reader';

import CreatePackage from './Packages/Create';

function ScannedPackage(props) {
	const { scannedPackage } = props;
	return (
		<Card>
			<Card.Content>
				<Card.Header>{scannedPackage.code}</Card.Header>
				<Card.Meta><span className="name">{scannedPackage.customer.name}</span></Card.Meta>
				<Card.Description>
					<p>{scannedPackage.address.street}
					<br />{scannedPackage.address.city}
					<br />{scannedPackage.address.postcode}</p>
				</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Icon name="mail" />
				{scannedPackage.customer.email}
			</Card.Content>
		</Card>
	)
}

function PackageScanner(props) {
	const { user } = props;
	const [ error, setError ] = useState(null);
	const [ loading, setLoading ] = useState(false);
	const [ showReader, setShowReader ] = useState(true);
	const [ lastScan, setLastScan ] = useState(null);
	const [ scannedPackages, setScannedPackages ] = useState([]);

	const [ createPackageCode, setCreatePackageCode ] = useState();

	function addPackageToList(_package) {
		let _packages = scannedPackages;
		_packages.unshift({
			code: _package.code,
			customer: {
				name: _package.recipient,
				email: _package.email
			},
			address: _package.address
		})
		setScannedPackages(_packages);
	}
	

	function handleScan(data) {
		if (data) {
			if (lastScan === data) return;
			if (data.length !== 34 || !data.startsWith('de')) return setError('Invalid QR code');

			setLoading(true);
			fetch(`${process.env.REACT_APP_API_ENDPOINT}/package/${data}`, {
				headers: {
					'Authorization': user.token
				}
			})
			.then((response) => {
				response.json().then(_data => {
					setError(null);

					if (!_data.success) {
						setCreatePackageCode(data);
					}
					else {
						addPackageToList(_data.data);
					}

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

			setLastScan(data);
		}
	}
	function handleError(error) {
		setError('An error occured. Your device might not support the camera or you may not have given camera permissions.');
		setShowReader(false);
	}

	return (
		<Container>
			<Header as="h1">Package Scanner</Header>
			Please scan a package using your camera

			{ error && <Message negative>{error}</Message> }
			{ loading && <Dimmer active><Loader active>Loading</Loader></Dimmer> }

			{ createPackageCode && <CreatePackage code={createPackageCode} token={user.token} close={() => setCreatePackageCode(null)} created={_package => addPackageToList(_package)} /> }

			<Grid columns={2} stackable>
				{ showReader && <Grid.Column>
					<Segment style={{maxWidth: '30rem'}}>
						<QrReader facingMode="environment" onScan={handleScan} onError={handleError} />
					</Segment>
				</Grid.Column> }
				<Grid.Column>
					<Header as="h2">Scanned Packages</Header>
					
					{ scannedPackages.map((scannedPackage, i) => <ScannedPackage scannedPackage={scannedPackage} key={i} />)}
				</Grid.Column>
			</Grid>
			 
		</Container>
	);
}

export default PackageScanner;

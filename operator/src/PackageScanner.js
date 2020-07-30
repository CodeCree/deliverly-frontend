import React, { useState } from 'react';
import { Container, Header, Segment, Message, Grid, Card, Icon } from 'semantic-ui-react';
import QrReader from 'react-qr-reader';

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

function PackageScanner() {
	const [ error, setError ] = useState(null);
	const [ showReader, setShowReader ] = useState(true);
	const [ lastScan, setLastScan ] = useState(null);
	const [ scannedPackages, setScannedPackages ] = useState([]);

	function handleScan(data) {
		if (data) {
			if (lastScan === data) return;
			if (data.length !== 45 || !data.startsWith('deliverly')) return setError('Invalid QR code');

			//Check data

			let packages = scannedPackages.slice();
			packages.unshift({
				'code': 'i-like-cheese',
				'customer': {
					'name': 'Bob Bobson',
					'email': 'email@email.com'
				},
				'address': {
					'street': '1 London Road',
					'city': 'London',
					'postcode': 'LO1 001'
				}
			});
			setScannedPackages(packages);
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

			<Grid columns={2} stackable>
				{ showReader && <Grid.Column>
					<Segment style={{maxWidth: '30rem'}}>
						<QrReader facingMode="environment" onScan={handleScan} onError={handleError} />
					</Segment>
				</Grid.Column> }
				<Grid.Column>
					<Header as="h2">Scanned Packages</Header>
					
					{ scannedPackages.map(scannedPackage => <ScannedPackage scannedPackage={scannedPackage} />)}
				</Grid.Column>
			</Grid>
			 
		</Container>
	);
}

export default PackageScanner;

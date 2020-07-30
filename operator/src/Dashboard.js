import React from 'react';
import { Container, Header, Card, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function Dashboard() {
	return (
		<Container>
			<Header as="h2">Welcome to Deliverly, user!</Header>

			<Card.Group itemsPerRow={4} doubling>
				<Card link as={Link} to="/routes">
					<Card.Content>
						<Icon name="truck" size="huge" color="grey" style={{marginBottom: '1.5rem'}}/>
						<Card.Header>Routes</Card.Header>
						<Card.Description>Manage your routes</Card.Description>
					</Card.Content>
				</Card>

				<Card link as={Link} to="/package/scan">
					<Card.Content>
						<Icon name="eye" size="huge" color="grey" style={{marginBottom: '1.5rem'}}/>
						<Card.Header>Scan QR Code</Card.Header>
						<Card.Description>Lookup a package QR code on the system</Card.Description>
					</Card.Content>
				</Card>

				<Card link as={Link} to="/qr-codes">
					<Card.Content>
						<Icon name="qrcode" size="huge" color="grey" style={{marginBottom: '1.5rem'}}/>
						<Card.Header>Generate QR Codes</Card.Header>
						<Card.Description>Generate additional package QR codes</Card.Description>
					</Card.Content>
				</Card>

				<Card link as={Link} to="/account">
					<Card.Content>
						<Icon name="user" size="huge" color="grey" style={{marginBottom: '1.5rem'}}/>
						<Card.Header>Account</Card.Header>
						<Card.Description>Manage your account</Card.Description>
					</Card.Content>
				</Card>
			</Card.Group>
		</Container>
	);
}

export default Dashboard;

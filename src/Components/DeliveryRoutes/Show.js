import React, { useEffect, useState } from 'react';
import { Container, Header, Button, List, Card, CardDescription } from 'semantic-ui-react';

function DeliveryRoute() {
	const [ packages, setPackages ] = useState([
		{
			code: 'random-package-here'
		},
		{
			code: 'i-like-cheese'
		},
		{
			code: 'bob-and-dave'
		}
	]);
	const [trackingLocation, setTrackingLocation] = useState(0);



	useEffect(() => {
		function sendLocation() {
			try {
				navigator.geolocation.getCurrentPosition((position) => {
					let pos = [Math.round(position.coords.latitude*100000)/100000, Math.round(position.coords.longitude*100000)/100000];
		
					//Send pos to server
					//console.log(pos);
				}, () => {
					console.error('Error');
				});
			}
			catch (error) {
				console.error('Error');
			}
		}

		if (navigator.geolocation) {
			setTrackingLocation(1);
		}
		//sendLocation();
		//setInterval(sendLocation, 3000);
	}, []);

	return (
		<Container>
			<Header as="h1">Route</Header>

			<List>
				<List.Item>
					<List.Icon name="boxes" />
					<List.Content><strong>Packages: </strong>0</List.Content>
				</List.Item>
				<List.Item>
					<List.Icon name="clock" />
					<List.Content><strong>Started at: </strong>30/07/2020 22:55</List.Content>
				</List.Item>
				<List.Item>
					<List.Icon name="clock" />
					<List.Content><strong>Ended at: </strong></List.Content>
				</List.Item>
				<List.Item>
					<List.Icon name="location arrow" />
					<List.Content><strong>Tracking location: </strong>{trackingLocation === 0 ? 'Not supported by your device' : ( trackingLocation === 1 ? 'Off' : ( trackingLocation === 3 ? 'An error occured' : 'On'))}</List.Content>
				</List.Item>
			</List>

			<Button>Start Route</Button>

			<Header as="h2">Packages</Header>
			<Button>Scan New Package</Button>
			<Card.Group doubling itemsPerRow={6} style={{marginTop: '1rem'}}>
				{ packages.map(parcel => (
					<Card key={parcel.code} >
						<Card.Content>
							<Card.Header>{parcel.code}</Card.Header>
						</Card.Content>
					</Card>
				))}
			</Card.Group>
			
		</Container>
	);
}

export default DeliveryRoute;

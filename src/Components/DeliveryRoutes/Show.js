import React, { useEffect } from 'react';
import { Container, Header } from 'semantic-ui-react';

function DeliveryRoute() {
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

		if (!navigator.geolocation) {
			return console.log('Geolocation not supported');
		}
		//sendLocation();
		//setInterval(sendLocation, 3000);
	}, []);

	return (
		<Container>
			<Header as="h2">Route</Header>
		</Container>
	);
}

export default DeliveryRoute;

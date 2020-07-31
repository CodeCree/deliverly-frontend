import React, { useEffect, useState } from 'react';
import { Container, Header, Button, List, Card, CardDescription, Dimmer, Loader } from 'semantic-ui-react';
import { useParams, Redirect } from 'react-router-dom';

function DeliveryRoute(props) {
	const { user } = props;
	const { id } = useParams();
	const [ route, setRoute ] = useState(null);
	const [ redirect, setRedirect ] = useState(null);
	const [trackingLocation, setTrackingLocation] = useState(0);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_ENDPOINT}/route/${id}`, {
			headers: {
				'Authorization': user.token
			}
		})
		.then((response) => {
			response.json().then(data => {
				if (!data.success) {
					return setRedirect('/routes');
				}

				setRoute(data.data);
				console.log(data.data);

			}).catch((error) => {
				setRedirect('/routes');
			});
		})
		.catch((error) => {
			setRedirect('/routes');
		});
	}, []);

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

			{ !route && <Dimmer active><Loader active>Loading</Loader></Dimmer> }
			{ redirect && <Redirect to={redirect} /> }

			{ route && <>
			<List>
				<List.Item>
					<List.Icon name="boxes" />
					<List.Content><strong>Packages: </strong>{route.packages.length}</List.Content>
				</List.Item>
				<List.Item>
					<List.Icon name="clock" />
					<List.Content><strong>Started at: </strong>{route.startedAt || 'Not Started'}</List.Content>
				</List.Item>
				<List.Item>
					<List.Icon name="clock" />
					<List.Content><strong>Ended at: </strong>{route.endedAt || 'Not Ended'}</List.Content>
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
				{ route.packages.map(parcel => (
					<Card key={parcel.code} >
						<Card.Content>
							<Card.Header>{parcel.code}</Card.Header>
						</Card.Content>
					</Card>
				))}
			</Card.Group> 
			</>
			}
			
		</Container>
	);
}

export default DeliveryRoute;

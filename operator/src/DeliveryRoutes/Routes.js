import React, { useState } from 'react';
import { Container, Header, Card, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function RouteCard(props) {
	const { route } = props;

	return (
		<Card link as={Link} to={`/routes/${route.id}`}>
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

function Routes() {
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

			<Card.Group doubling itemsPerRow={4} style={{marginTop: '1rem'}}>
				<Card link as={Link} to="/routes/new" style={{padding: '1rem'}}>
					<Icon name="plus" size="huge" color="light grey" link style={{margin: 'auto'}} />
				</Card>

				{ routes.map(route => <RouteCard key={route.id} route={route} />)}
			</Card.Group>
			 
		</Container>
	);
}

export default Routes;

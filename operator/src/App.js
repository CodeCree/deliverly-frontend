import React, { useEffect } from 'react';
import { Container, Menu, Button } from 'semantic-ui-react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import DeliveryRoutes from './DeliveryRoutes/Route';
import QrCodeGenerator from './QrCodeGenerator';

function App() {
	return (
		<Router>
			<Menu>
				<Container>
					<Menu.Item as={Link} header to="/">Deliverly</Menu.Item>

					<Menu.Item as={Link} to="/">Dashboard</Menu.Item>
					<Menu.Item as={Link} to="/routes">Routes</Menu.Item>

					<Menu.Item position='right'>
						<Button>Logout</Button>
					</Menu.Item>
				</Container>
			</Menu>

			<Switch>
				<Route path="/" exact>Dashboard</Route>
				<Route path="/routes">
					<DeliveryRoutes />
				</Route>
				<Route path="/qr-code-generator">
					<QrCodeGenerator />
				</Route>
				<Route>
					<Redirect to="/" />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;

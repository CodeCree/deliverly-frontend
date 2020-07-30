import React from 'react';
import { Container, Menu } from 'semantic-ui-react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import DeliveryRoutes from './DeliveryRoutes/Routes';
import QrCodeGenerator from './QrCodeGenerator';
import Dashboard from './Dashboard';
import PackageScanner from './PackageScanner';

function App() {
	return (
		<Router>
			<Menu>
				<Container>
					<Menu.Item as={Link} header to="/">Deliverly</Menu.Item>

					<Menu.Item position='right'>Logout</Menu.Item>
				</Container>
			</Menu>

			<Switch>
				<Route path="/" exact>
					<Dashboard />
				</Route>
				<Route path="/routes">
					<DeliveryRoutes />
				</Route>
				<Route path="/packages/scan">
					<PackageScanner />
				</Route>
				<Route path="/qr-codes">
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

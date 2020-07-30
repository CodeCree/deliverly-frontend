import React, { useState } from 'react';
import { Container, Menu, Header, Message, Icon } from 'semantic-ui-react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import Login from './Login';

import Dashboard from './Dashboard';
import Account from './Account';
import PackageScanner from './PackageScanner';
import QrCodeGenerator from './QrCodeGenerator';
import IndexDeliveryRoutes from './DeliveryRoutes/Index';
import ShowDeliveryRoute from './DeliveryRoutes/Show';

import Users from './Operators/Users';
import Packages from './Operators/Packages';
import Warehouses from './Operators/Warehouses';
import AllRoutes from './Operators/Routes';

function App() {
	const [ user, setUser ] = useState(null);

	function logout() {
		sessionStorage.removeItem('token');
		localStorage.removeItem('token');
		setUser(null);

		//
	}

	if (!user) {
		return (
			<Router>
				<Menu>
					<Container>
						<Menu.Item as={Link} header to="/">Deliverly</Menu.Item>
					</Container>
				</Menu>

				<Container>
					<Header as="h1">Welcome to Deliverly</Header>
					Deliverly is a delivery platform...

					<Message icon as="a" href="/track">
						<Icon name="box" />
						<Message.Content>
							<Message.Header>Tracking a Package?</Message.Header>
							If you are trying to track a package, please click here.
						</Message.Content>
					</Message>

					<Login setUser={setUser} />
				</Container>
			</Router>
		)
	}

	return (
		<Router>
			<Menu>
				<Container>
					<Menu.Item as={Link} header to="/">Deliverly</Menu.Item>

					<Menu.Item position='right' onClick={logout}>Logout</Menu.Item>
				</Container>
			</Menu>

			<Switch>
				<Route path="/" exact component={Dashboard} />
				<Route path="/account" exact component={Account} />
				<Route path="/route/:id" component={ShowDeliveryRoute} />
				<Route path="/routes" component={IndexDeliveryRoutes} />
				<Route path="/packages/scan" component={PackageScanner} />
				<Route path="/qr-codes" component={QrCodeGenerator} />

				<Route path="/users" component={Users} />
				<Route path="/packages" component={Packages} />
				<Route path="/warehouses" component={Warehouses} />
				<Route path="/routes/all" component={AllRoutes} />

				<Route>
					<Redirect to="/" />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;

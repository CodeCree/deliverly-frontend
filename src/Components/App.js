import React from 'react';
import { Container, Menu } from 'semantic-ui-react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import Dashboard from './Dashboard';
import Account from './Account';
import PackageScanner from './PackageScanner';
import QrCodeGenerator from './QrCodeGenerator';
import IndexDeliveryRoutes from './DeliveryRoutes/Index';
import ShowDeliveryRoute from './DeliveryRoutes/Show';
import CreateDeliveryRoute from './DeliveryRoutes/Create';

import Users from './Operators/Users';
import Packages from './Operators/Packages';
import Warehouses from './Operators/Warehouses';
import AllRoutes from './Operators/Routes';

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
				<Route path="/" exact component={Dashboard} />
				<Route path="/account" exact component={Account} />
				<Route path="/route/new" component={CreateDeliveryRoute} />
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

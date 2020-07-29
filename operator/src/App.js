import React, { useEffect } from 'react';
import { Container, Header } from 'semantic-ui-react';
import Route from './Routes/Route';
//import QrCodeGenerator from './QrCodeGenerator';

function App() {
	return (
		<Container>
			<Header as="h1">Deliverly</Header>
			<Route />
		</Container>
	);
}

export default App;

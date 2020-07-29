import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import QrCodeGenerator from './QrCodeGenerator';

function App() {
	return (
		<Container>
			<Header as="h1">Deliverly</Header>
			<QrCodeGenerator />
		</Container>
	);
}

export default App;

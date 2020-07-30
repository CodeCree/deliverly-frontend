import React, { useState } from 'react';
import { Container, Loader, Header, Segment, Button } from 'semantic-ui-react';
import QRCode from 'qrcode';
import jsPdf from 'jspdf';

function QrCodeSheet() {
	const [loading, setLoading] = useState(false);

	async function generateCodes() {
		setLoading(true);

		async function fetchStrings() {
			//Take from backend
			let strings = [];
			
			for (let i = 0; i < 16; i++) {
				let random = Math.round(Math.random()*100000000000).toLocaleString('fullwide', {useGrouping:false, minimumIntegerDigits:12}) + Math.round(Math.random()*100000000000).toLocaleString('fullwide', {useGrouping:false, minimumIntegerDigits:12}) + Math.round(Math.random()*100000000000).toLocaleString('fullwide', {useGrouping:false, minimumIntegerDigits:12});

				strings.push('deliverly' + random);
			}
			return strings;
		}
		async function generateQrCode(str) {
			try {
				return await QRCode.toDataURL(str, { errorCorrectionLevel: 'Q' });
			}
			catch (err) {
				try {
					return await QRCode.toDataURL(str, { errorCorrectionLevel: 'Q' });
				}
				catch (err) {
					console.error('ERROR: ' + err);
					return 'invalid';
				}
			}
		}
		function formatDigits(number) {
			if (number < 10) return '0' + number;
			return number;
		}

		let doc = new jsPdf();

		let strings = await fetchStrings();

		for (let i = 0; i < 15; i++) {
			let ypos = (i % 5)*55+11;
			let xpos = 17;
			if (i > 4) xpos = 76;
			if (i > 9) xpos = 138;

			doc.addImage(await generateQrCode(strings[i]), 'PNG', xpos, ypos, 55, 55)
		}

		doc.text('Deliverly QR Codes', 105, 11, {
			align: 'center'
		});
		let date = new Date();
		let dateString = `${formatDigits(date.getFullYear())}${formatDigits(date.getMonth())}${formatDigits(date.getDate())}-${formatDigits(date.getHours())}${formatDigits(date.getMinutes())}${formatDigits(date.getSeconds())}`;
		doc.text(dateString, 105, 290, {
			align: 'center'
		});

		doc.save(`deliverly-qr-codes-${dateString}.pdf`);

		setLoading(false);
	}

	return (
		<Container>
			<Header as="h1">QR Code Generator</Header>
			Click the button below to generate an A4 sheet of QR codes to stick on packages

			<Segment>
				{ loading ? <Loader active>Loading</Loader>
				: <Button onClick={generateCodes}>Generate Codes</Button> }
			</Segment>
			 
		</Container>
	);
}

function QrCodeGenerator() {
	return (
		<Container>
			<QrCodeSheet />
		</Container>
	);
}

export default QrCodeGenerator;

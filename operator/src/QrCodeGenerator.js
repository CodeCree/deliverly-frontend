import React, { useEffect, useState, useRef } from 'react';
import { Container, Loader, Image as SemanticImage } from 'semantic-ui-react';
import QRCode from 'qrcode';
import printJs from 'print-js';

function QrCodeSheet() {
	const [loading, setLoading] = useState(true);
	const [sheetImage, setSheetImage] = useState(null);
	let ref = useRef();

	useEffect(() => {
		async function fetchStrings() {
			//Take from backend
			let strings = [];
			for (let i = 0; i < 16; i++) {
				strings.push('deliverly' + Math.round(Math.random()*10000000000000000000000000000000000));
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
					return '';
				}
			}
		}
		async function generateCodes() {
			let strings = await fetchStrings();

			const canvas = ref.current;
			const ctx = canvas.getContext('2d');
			
			ctx.fillStyle = 'blue';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			function addCode(str, xpos, ypos) {
				return new Promise(async (resolve, reject) => {
					let img = new Image();

					img.onload = () => {
						ctx.drawImage(img, xpos, ypos, 650, 650);
						resolve();
					}
	
					img.src = await generateQrCode(str);
				});
			}

			for (let i = 0; i < 15; i++) {
				let ypos = (i % 5)*650+128;
				let xpos = 211;
				if (i > 4) xpos = 915;
				if (i > 9) xpos = 1625;

				await addCode(strings[i], xpos, ypos);
			}

			setLoading(false);
			setSheetImage(canvas.toDataURL());
			printJs({printable: canvas.toDataURL(), type: 'image', imageStyle: 'width:100%'});
		}

		setLoading(true);
		generateCodes();
		
	}, []);

	return (
		<>
			{ loading && <Loader active>Loading</Loader> }
			<canvas ref={ref} width={2480} height={3508} style={{display: 'none'}} />

			{ sheetImage && <SemanticImage src={sheetImage} /> }
		</>
	)
}

function QrCodeGenerator() {
	return (
		<Container>
			<QrCodeSheet />
		</Container>
	);
}

export default QrCodeGenerator;

import React, { createRef, useEffect } from 'react';
import { Segment } from 'semantic-ui-react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
console.log(process.env);

function Map() {
	const ref = createRef();

	useEffect(() => {
		const map = new mapboxgl.Map({
			container: ref.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [-0.33240, 53.73893],
			zoom: 9
		});
		map.fitBounds([
			[-0.425788, 53.788926],
			[-0.436073, 53.840070]
		])
	}, [ref]);

	return (
		<Segment style={{padding: '0.7rem 0.7rem 2rem', margin: '1rem 0'}}>
			<div ref={ref} style={{height: '30rem'}} />
		</Segment>
	);
}

export default Map;

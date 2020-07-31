import React, { createRef, useEffect, useState } from 'react';
import { Segment, ItemDescription, ItemExtra } from 'semantic-ui-react';
import mapboxgl from 'mapbox-gl';

function Map(props) {
	const [ map, setMap ] = useState(null);
	const ref = createRef();
	const { items } = props;

	useEffect(() => {
		if (!items) return;
		if (items.length === 0) return;
		mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
		let _map = new mapboxgl.Map({
			container: ref.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [items[0].position[1], items[0].position[0]],
			zoom: 9
		});
		setMap(_map);
	}, []);

	useEffect(() => {
		if (!items) return;
		if (items.length === 0) return;
		if (!map) return;

		let minPosition = [items[0].position[1], items[0].position[0]];
		let maxPosition = [items[0].position[1], items[0].position[0]];
		items.forEach((item) => {
			new mapboxgl.Marker()
			.setLngLat([item.position[1], item.position[0]])
			.addTo(map);
			//console.log([item.position[1], item.position[0]]);

			if (item.position[1] < minPosition[0]) minPosition[0] = item.position[1];
			else if (item.position[1] > maxPosition[0]) maxPosition[0] = item.position[1];
			if (item.position[0] < minPosition[1]) minPosition[1] = item.position[0];
			else if (item.position[0] > maxPosition[1]) maxPosition[1] = item.position[0];
		});

		minPosition[0] = minPosition[0] - 0.02;
		minPosition[1] = minPosition[1] - 0.02;
		maxPosition[0] = maxPosition[0] + 0.02;
		maxPosition[1] = maxPosition[1] + 0.02;
		
		map.fitBounds([minPosition, maxPosition]);
	}, [map, items]);

	return (
		<Segment style={{padding: '0.7rem 0.7rem 2rem', margin: '1rem 0'}}>
			<div ref={ref} style={{height: '30rem'}} />
		</Segment>
	);
}

export default Map;

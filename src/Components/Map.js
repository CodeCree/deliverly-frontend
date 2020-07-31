import React, { createRef, useEffect, useState } from 'react';
import { Segment, ItemDescription, ItemExtra } from 'semantic-ui-react';
import mapboxgl from 'mapbox-gl';

function Map(props) {
	const [ map, setMap ] = useState(null);
	const ref = createRef();
	const { items } = props;
	const [ markers, setMarkers ] = useState([]);

	useEffect(() => {
		if (!items) return;
		if (items.length === 0) return;

		let _map = map;
		if (!_map) {
			mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
			_map = new mapboxgl.Map({
				container: ref.current,
				style: 'mapbox://styles/mapbox/streets-v11',
				center: [items[0].position[1], items[0].position[0]],
				zoom: 9
			});
			setMap(_map);
		}

		markers.forEach(marker => {
			marker.remove();
		});

		let minPosition = [items[0].position[1], items[0].position[0]];
		let maxPosition = [items[0].position[1], items[0].position[0]];

		let _markers = [];
		items.forEach((item) => {
			_markers.push(new mapboxgl.Marker()
			.setLngLat([item.position[1], item.position[0]])
			.addTo(_map));

			if (item.position[1] < minPosition[0]) minPosition[0] = item.position[1];
			else if (item.position[1] > maxPosition[0]) maxPosition[0] = item.position[1];
			if (item.position[0] < minPosition[1]) minPosition[1] = item.position[0];
			else if (item.position[0] > maxPosition[1]) maxPosition[1] = item.position[0];
		});

		minPosition[0] = minPosition[0] - 0.02;
		minPosition[1] = minPosition[1] - 0.02;
		maxPosition[0] = maxPosition[0] + 0.02;
		maxPosition[1] = maxPosition[1] + 0.02;
		
		_map.fitBounds([minPosition, maxPosition]);

		setMarkers(_markers);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items]);

	return (
		<Segment style={{padding: '0.7rem 0.7rem 2rem', margin: '1rem 0', display: ((!items) || items.length === 0) && 'none'}}>
			<div ref={ref} style={{height: '30rem'}} />
		</Segment>
	);
}

export default Map;

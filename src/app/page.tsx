'use client'

import React, { useState } from 'react';
import Game from '../components/Game';
import Popup from '../components/Popup';

const Home: React.FC = () => {
	const [showPopup, setShowPopup] = useState<boolean>(false);

	const handlePopupClose = () => {
		setShowPopup(false);
	};

	return (
		<div>
			<Game setShowPopup={setShowPopup} />
			{showPopup && <Popup onClose={handlePopupClose} />}
		</div>
	);
};

export default Home;

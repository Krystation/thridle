import React, { useEffect } from 'react';

interface PopupProps {
	onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const popup = document.getElementById('popup');
			if (popup && !popup.contains(event.target as Node)) {
				onClose();
			}
		};
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [onClose]);

	return (
		<div
			id="popup"
			style={{
				position: 'fixed',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				backgroundColor: '#fff',
				padding: '20px',
				boxShadow: '0 0 10px rgba(0,0,0,0.5)',
				zIndex: 1000,
				textAlign: 'center',
			}}
		>
			<h2>Congratulations!</h2>
			<p>You won the game!</p>
			<button onClick={onClose} style={{ marginTop: '10px' }}>
				X
			</button>
		</div>
	);
};

export default Popup;

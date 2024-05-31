import React, { useState } from 'react';
import WordDisplay from './WordDisplay';

interface GameProps {
	setShowPopup: (value: boolean) => void;
}

const Game: React.FC<GameProps> = ({ setShowPopup }) => {
	const [result, setResult] = useState<string[]>([]);
	const [currentWord, setCurrentWord] = useState<string>('');
	const [error, setError] = useState<string | null>(null);
	const [resetInputs, setResetInputs] = useState<boolean>(false);

	// State for game
	const [first, setFirst] = useState<boolean>(false);
	const [second, setSecond] = useState<boolean>(false);
	const [third, setThird] = useState<boolean>(false);

	function separateWords(result: string): string[] {
		const trimmedResult = result.trim().replace(/\n/g, '');
		const words = trimmedResult.split(',');
		if (words.length !== 3) {
			throw new Error("Expected exactly three words separated by commas.");
		}
		return words;
	}

	async function fetchWords() {
		try {
			const response = await fetch('/generate');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			const words = separateWords(data.result);
			setResult(words);
			if (words.length > 0) {
				setCurrentWord(words[0]);
			}
			setResetInputs(true);
		} catch (err) {
			setError(err.message);
			console.error("Failed to fetch words:", err);
		}
	}

	function handleResetComplete() {
		setResetInputs(false);
	}

	function newGame() {
		fetchWords();
	}

	return (
		<div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
			{currentWord && (
				<WordDisplay
					word={currentWord}
					resetInputs={resetInputs}
					onResetComplete={handleResetComplete}
					first={first}
					setFirst={setFirst}
				/>
			)}
			{first && result[1] && (
				<WordDisplay
					word={result[1]}
					resetInputs={resetInputs}
					onResetComplete={handleResetComplete}
					first={second}
					setFirst={setSecond}
				/>
			)}
			{second && result[2] && (
				<WordDisplay
					word={result[2]}
					resetInputs={resetInputs}
					onResetComplete={handleResetComplete}
					first={third}
					setFirst={(value) => {
						setThird(value);
						if (value) {
							setShowPopup(true);
						}
					}}
				/>
			)}
			<p>Result: {result.join(', ')}</p>
			{error && <p style={{ color: 'red' }}>Error: {error}</p>}
			<button onClick={newGame}>Generate Words</button>
		</div>
	);
};

export default Game;

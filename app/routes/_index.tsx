import { useState } from "react";
import WordDisplay from "~/components/WordDisplay";
import Popup from "~/components/Popup"; // Import the Popup component

export default function Index() {
	const [result, setResult] = useState<string[]>([]);
	const [currentWord, setCurrentWord] = useState<string>('');
	const [error, setError] = useState<string | null>(null);
	const [resetInputs, setResetInputs] = useState<boolean>(false);

	// State for game
	const [first, setFirst] = useState<boolean>(false);
	const [second, setSecond] = useState<boolean>(false);
	const [third, setThird] = useState<boolean>(false);
	const [showPopup, setShowPopup] = useState<boolean>(false);

	function separateWords(result: string): string[] {
		// Trim any leading/trailing whitespace and remove any newline characters
		const trimmedResult = result.trim().replace(/\n/g, '');

		// Split the string by comma to get individual words
		const words = trimmedResult.split(',');

		// Ensure that exactly three words are returned
		if (words.length !== 3) {
			throw new Error("Expected exactly three words separated by commas.");
		}

		return words;
	}

	async function fetchWords() {
		try {
			const response = await fetch("/generate");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			const words = separateWords(data.result);
			setResult(words);
			if (words.length > 0) {
				setCurrentWord(words[0]); // Update the current word
			}
			setResetInputs(true); // Trigger input reset
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

	function handlePopupClose() {
		setShowPopup(false);
	}

	return (
		<>
			<h1>Thridle</h1>
			<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
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
								setShowPopup(true); // Show popup when third is set to true
							}
						}}
					/>
				)}
				{/* <p>Result: {result.join(", ")}</p> */}
				{error && <p style={{ color: "red" }}>Error: {error}</p>}
				<button onClick={newGame}>New Game</button>
				{showPopup && <Popup onClose={handlePopupClose} />}
			</div>
		</>
	);
}

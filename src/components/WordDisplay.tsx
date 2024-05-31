import React, { useState, useEffect, useRef } from 'react';
import { validateWord } from '../app/utils/validateWord';

interface WordDisplayProps {
	word: string;
	resetInputs: boolean;
	onResetComplete: () => void;
	first: boolean;
	setFirst: React.Dispatch<React.SetStateAction<boolean>>;
}

const WordDisplay: React.FC<WordDisplayProps> = ({
	word,
	resetInputs,
	onResetComplete,
	first,
	setFirst,
}) => {
	const [letters, setLetters] = useState<string[]>(Array.from(word));
	const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
	const [inputValues, setInputValues] = useState<string[]>(Array(5).fill(''));
	const [backgroundColors, setBackgroundColors] = useState<string[]>(Array(5).fill(''));
	const [isValidWord, setIsValidWord] = useState<boolean | null>(null);
	const [isCompleted, setIsCompleted] = useState<boolean>(false);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		setLetters(Array.from(word));
		const randomIndex = Math.floor(Math.random() * word.length);
		setVisibleIndex(randomIndex);
		setInputValues(Array(5).fill(''));
		setBackgroundColors(Array(5).fill(''));
		setIsValidWord(null);
		setIsCompleted(false);
	}, [word]);

	useEffect(() => {
		if (resetInputs) {
			setInputValues(Array(5).fill(''));
			setBackgroundColors(Array(5).fill(''));
			setIsValidWord(null);
			setIsCompleted(false);
			onResetComplete();
		}
	}, [resetInputs, onResetComplete]);

	useEffect(() => {
		if (visibleIndex !== null) {
			let firstInputIndex = 0;
			while (firstInputIndex < inputRefs.current.length && firstInputIndex === visibleIndex) {
				firstInputIndex++;
			}
			inputRefs.current[firstInputIndex]?.focus();
		}
	}, [visibleIndex]);

	const handleChange = (index: number, value: string) => {
		if (value.length <= 1) {
			const newInputValues = [...inputValues];
			newInputValues[index] = value;
			setInputValues(newInputValues);

			if (value && index < inputRefs.current.length - 1) {
				let nextIndex = index + 1;
				if (nextIndex === visibleIndex) {
					nextIndex += 1;
				}
				inputRefs.current[nextIndex]?.focus();
			}
		}
	};

	const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Backspace' && inputValues[index] === '' && index > 0) {
			let previousIndex = index - 1;
			if (previousIndex === visibleIndex) {
				previousIndex -= 1;
			}
			inputRefs.current[previousIndex]?.focus();
		} else if (event.key === 'Enter') {
			handleSubmit();
		}
	};

	const handleSubmit = async () => {
		const userWordArray = [...inputValues];
		if (visibleIndex !== null) {
			userWordArray[visibleIndex] = letters[visibleIndex];
		}
		const userWord = userWordArray.join('');

		const isValid = await validateWord(userWord);

		if (!isValid) {
			setIsValidWord(false);
			alert('The entered word is not a valid English word.');
			return;
		}

		setIsValidWord(true);
		const newBackgroundColors = [...backgroundColors];
		let allCorrect = true;
		inputValues.forEach((value, index) => {
			if (index !== visibleIndex) {
				if (value === letters[index]) {
					newBackgroundColors[index] = 'green';
				} else {
					allCorrect = false;
					if (letters.includes(value)) {
						newBackgroundColors[index] = 'yellow';
					} else {
						newBackgroundColors[index] = 'red';
					}
				}
			} else {
				newBackgroundColors[index] = 'green';
			}
		});
		setBackgroundColors(newBackgroundColors);

		if (allCorrect) {
			setIsCompleted(true);
			setFirst(true);
		}
	};

	return (
		<div>
			<form>
				{letters.map((letter, index) => (
					<input
						key={index}
						ref={(el) => (inputRefs.current[index] = el)}
						type="text"
						value={index === visibleIndex ? letter : inputValues[index]}
						maxLength={1}
						onChange={(e) => handleChange(index, e.target.value)}
						onKeyDown={(e) => handleKeyDown(index, e)}
						style={{
							width: '2em',
							textAlign: 'center',
							backgroundColor: index === visibleIndex ? 'green' : backgroundColors[index],
							color: index === visibleIndex ? 'white' : 'black',
						}}
						readOnly={index === visibleIndex || isCompleted}
					/>
				))}
			</form>
			<button type="button" onClick={handleSubmit}>
				Submit
			</button>
			{isValidWord === false && <p style={{ color: 'red' }}>Invalid English word. Try again!</p>}
		</div>
	);
};

export default WordDisplay;

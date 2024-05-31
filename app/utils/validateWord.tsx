export async function validateWord(word: string): Promise<boolean> {
	const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
	console.log(word);
	if (response.ok) {
		const data = await response.json();
		// Check if the response contains word data
		return data.length > 0 && data[0].word === word;
	} else {
		return false;
	}
}

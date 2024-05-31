export async function validateWord(word: string): Promise<boolean> {
	const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
	if (response.ok) {
		const data = await response.json();
		return data.length > 0;
	}
	return false;
}

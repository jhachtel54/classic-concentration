class Puzzle
{
	constructor(answers)
	{
		this.answers = answers;
	}
}

class PuzzleManager
{
	static puzzles = [
		new Puzzle(["ACID RAIN"]),
		new Puzzle(["A PASSAGE TO INDIA"]),
		new Puzzle(["BREAD AND BUTTER", "BREAD & BUTTER"]),
		new Puzzle(["CHESAPEAKE BAY"]),
		new Puzzle(["HERE'S JOHNNY", "HERES JOHNNY"]),
		new Puzzle(["I'M FOREVER BLOWING BUBBLES", "I AM FOREVER BLOWING BUBBLES"]),
		new Puzzle(["PUMPING IRON"]),
		new Puzzle(["SIXTY MINUTES", "60 MINUTES"]),
		new Puzzle(["THE STATE OF THE UNION"]),
		new Puzzle(["TIME OFF FOR GOOD BEHAVIOR"]),
		new Puzzle(["TWO HEADS ARE BETTER THAN ONE"], ["2 HEADS ARE BETTER THAN ONE"])
	];
	
	static SelectPuzzle()
	{
		var randomIndex = Math.floor(Math.random() * this.puzzles.length);
		this.selectedPuzzle = this.puzzles[randomIndex];
		return "img/Puzzles/" + String(randomIndex).padStart(3, '0') + ".png";
	}
	
	static CheckAnswer(userAnswer)
	{
		return this.selectedPuzzle.answers.includes(userAnswer);
	}
};
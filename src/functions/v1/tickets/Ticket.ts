export type Prediction = {
	homeTeam: string;
	awayTeam: string;
	league: string;
	prediction: string;
	result: string;
};

export type Ticket = {
	id: string;
	type: string;
	payProductId: string;
	title: string;
	deadlineDate: number;
	matchPredictions: Prediction[];
};

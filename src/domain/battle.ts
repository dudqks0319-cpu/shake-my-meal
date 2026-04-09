export function resolveBattleWinner(playerOne: number, playerTwo: number) {
  if (playerOne === playerTwo) {
    return {
      winner: 'draw',
      winningIntensity: playerOne,
    } as const;
  }

  if (playerOne > playerTwo) {
    return {
      winner: 'player1',
      winningIntensity: playerOne,
    } as const;
  }

  return {
    winner: 'player2',
    winningIntensity: playerTwo,
  } as const;
}

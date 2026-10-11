import { getValidBlackMoves } from "./rules";
import { getPiece } from "./board";
import { WHITE, BLACK, BOARD_SIZE } from '../lib/constants'

export function pickRandomMove(moves) {
    if (moves.length < 1) return null

    const randomIndex = Math.floor(Math.random() * moves.length)
    return moves[randomIndex]
}

function getPotentialAttackers(move) {
    const potentialAttackers = {
        first: getPiece(move.move.row + 1, move.move.col + 1),
        second: getPiece(move.move.row + 1, move.move.col - 1)
    }

    return potentialAttackers
}

function canBeCaptured(move) {
    const attackers = getPotentialAttackers(move)
    const canFirstTake = attackers.first != null && attackers.first.color === WHITE
    const canSecondTake = attackers.second != null && attackers.second.color === WHITE
    return canFirstTake || canSecondTake
}

function shuffleArray(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pickSmartMove(moves) {
    moves = shuffleArray(moves)
    const betterMove = moves.find(move => !canBeCaptured(move))
    if (betterMove === undefined) {
        return pickRandomMove(moves)
    }

    return betterMove
}
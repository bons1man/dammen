// Twee computertegenstanders, allebei spelen ze zwart. Ze krijgen de lijst
// met toegestane zetten van rules.js.
// - pickRandomMove: kiest een willekeurige zet.
// - pickSmartMove: kiest liefst een zet waarna de steen niet meteen geslagen
//   kan worden, anders een willekeurige zet.
// De controle is voorzichtig: elke witte steen schuin voor het landingsvakje
// telt als gevaar, ook als die niet echt kan slaan.

import { getPiece } from "./board";
import { isInPlayingfield } from "./rules";
import { isCaptureMove } from "./rules";
import { WHITE, BOARD_SIZE } from '../lib/constants'

export function pickRandomMove(moves) {
    if (moves.length < 1) return null

    const randomIndex = Math.floor(Math.random() * moves.length)
    return moves[randomIndex]
}

function isEmptyAfterMove(position, move) {
    const from = move.piece
    const to = move.move

    if (position.row === from.row && position.col === from.col) return true

    if (isCaptureMove(from, to)) {
        const victimRow = (from.row + to.row) / 2
        const victimCol = (from.col + to.col) / 2
        if (position.row === victimRow && position.col === victimCol) return true
    }

    return getPiece(position.row, position.col) == null
}

function canBeCaptured(move) {
    const to = move.move

    for (const colDirection of [-1, 1]) {
        const attacker = getPiece(to.row + 1, to.col + colDirection)
        if (attacker == null || attacker.color !== WHITE) continue

        const landing = { row: to.row - 1, col: to.col - colDirection }
        if (isInPlayingfield(landing) && isEmptyAfterMove(landing, move)) return true
    }

    return false
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
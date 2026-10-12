// Beantwoordt vragen over het bord: welke zetten kunnen er, mag een zet,
// wie heeft gewonnen. Het verandert het bord nooit dat doet main.js.
//
// Een zet is een object: { piece, move: { row, col } }, waarbij move het
// vakje is waar de steen op landt, bij slaan is het het vakje achter het slachtoffer.
//
// Stenen gaan één vakje schuin vooruit, nooit achteruit,
// en slaan is verplicht.
// Missende implementatie: de dam, meerdere keren slaan in één beurt, achteruit slaan.

import { getBlackPieces, getWhitePieces, getPiece } from './board.js'
import { WHITE, BLACK, BOARD_SIZE } from '../lib/constants'

const COL_DIRECTIONS = [-1, 1]
const MOVE_GETTERS = {
    white: getValidWhiteMoves,
    black: getValidBlackMoves,
}

export function isInPlayingfield({ row, col }) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
}

function isEmpty({ row, col }) {
    return getPiece(row, col) == null
}

function isOppositeColor(attacker, victim) {
    return attacker.color !== victim.color
}

function getPositionAfterCapture(attacker, victim) {
    if (attacker == null || victim == null) {
        console.warn("Could not get capture difference because there was a null input")
        return null
    }

    const dRow = victim.row - attacker.row
    const dCol = victim.col - attacker.col

    const row = victim.row + dRow
    const col = victim.col + dCol

    if (isInPlayingfield({row, col})) {
        return {row: row, col: col}
    }

    return null
}

function hasCaptureMoves(moves) {
    return moves.some(
        (move) => isCaptureMove(move.piece, move.move))
}

// Checks if a piece can capture another piece on a position
function canCupture(attacker, { col, row }) {
    const victim = getPiece(row, col)
    if (!isOppositeColor(attacker, victim)) return false

    const pos = getPositionAfterCapture(attacker, victim)
    if (pos == null) return null

    return isEmpty(pos)
}

function getAllMoves(pieces, rowDirection) {
    const validMoves = []

    for (const piece of pieces) {
        for (const colDirection of COL_DIRECTIONS) {
            let move = {
                row: piece.row + rowDirection,
                col: piece.col + colDirection,
            }

            if (!isInPlayingfield(move)) continue

            if (isEmpty(move)) {
                validMoves.push({ piece, move })
                continue
            }

            const victim = getPiece(move.row, move.col)

            if (canCupture(piece, move)) {
                move = getPositionAfterCapture(piece, victim)
                validMoves.push({ piece, move })
            }

        }
    }

    return validMoves
}

function applyMandatoryCapture(moves) {
    if (!hasCaptureMoves(moves)) return moves
    return moves.filter(move => isCaptureMove(move.piece, move.move))
}

export function getMoveablePieces(color) {
    const getMoves = MOVE_GETTERS[color]
    if (getMoves == null) return []

    const moves = getMoves()
    const moveablePieces = []

    for (const validMove of moves) {
        if (!moveablePieces.includes(validMove.piece)) {
            moveablePieces.push(validMove.piece)
        }
    }

    return moveablePieces
}

export function isCaptureMove(piece, { row, col }) {
    return Math.abs(piece.row - row) === 2 && Math.abs(piece.col - col) === 2
}

export function getValidBlackMoves() {
    return applyMandatoryCapture(getAllMoves(getBlackPieces(), 1))
}

export function getValidWhiteMoves() {
    return applyMandatoryCapture(getAllMoves(getWhitePieces(), -1))
}

export function getPieceMoves(piece) {
    const getMoves = MOVE_GETTERS[piece.color]
    if (getMoves == null) return false

    return getMoves().filter(move => move.piece === piece)
}

export function canMoveTo(piece, { row, col }) {
    const getMoves = MOVE_GETTERS[piece.color]
    if (getMoves == null) return false

    return getMoves().some(
        (validMove) =>
            validMove.piece === piece &&
            validMove.move.row === row &&
            validMove.move.col === col
    )
}

export function getWinner(colorToMove) {
    const getMoves = MOVE_GETTERS[colorToMove]
    if (getMoves == null) return null
    if (getMoves().length > 0) return null

    return colorToMove === WHITE ? BLACK : WHITE
}
import { WHITE, BLACK, BOARD_SIZE } from '../lib/constants'

// Slaat de begin coordinaten van alle stenen op in een array
let _board = []

export function initializeBoard() {
    let color = "black"
    _board = []

    for (let r = 0; r < BOARD_SIZE; r++) {
        if (r === 3 || r === 4) {
            if (color === "black") {
                color = "white"
            }
            continue
        }
        for (let c = 0; c < BOARD_SIZE; c++) {
            var piece = {
                row: r,
                col: c,
                color: color
            }

            if ((r + c) % 2 === 1) {
                _board.push(piece)
            }
        }
    }
    return _board
}

export function capturePiece(piece) {
    const index = _board.indexOf(piece)
    if (index > -1) {
        _board.splice(index, 1)
    }
}

export function getPiece(row, col) {
    if (_board.length === 0) {
        console.warn(`Could not get piece at ${row}, ${col} because the board is empty`)
        return
    }

    for (const piece of _board) {
        if (piece.row === row && piece.col === col) {
            return piece
        }
    }
    return null
}

export function getBlackPieces() {
    if (_board.length === 0) {
        console.warn(`Could not get black pieces because board is empty`)
        return
    }

    return _board.filter(piece => piece.color === "black")
}

export function getWhitePieces() {
    if (_board.length === 0) {
        console.warn(`Could not get black pieces because board is empty`)
        return
    }

    return _board.filter(piece => piece.color === "white")
}

export function getBoard() {
    return _board
}

export function movePiece(piece, { row, col }) {
    if (piece === null) {
        console.warn(`Could not get piece at ${row}, ${col} because the piece doesnt exist`)
        return
    }
    piece.row = row
    piece.col = col
}
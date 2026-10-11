import { WHITE, BLACK } from '../lib/constants'

let _currentTurn = WHITE
let _hasStarted = false

export function getTurn() {
    return _currentTurn
}

export function switchTurn() {
    if (_currentTurn === WHITE) {
        _currentTurn = BLACK
    } else {
        _currentTurn = WHITE
    }
}

export function isPlayerTurn(piece) {
    return piece.color === _currentTurn
}

export function resetTurn() {
    _currentTurn = WHITE
}
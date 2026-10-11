// Verbindt alles. game/ en ui/ kennen elkaar niet
// dit bestand geeft de gegevens door:
// klik -> rules.js vragen of de zet mag -> data aanpassen in board.js
// -> het bord opnieuw tekenen.
// Hier zit ook het menu, de beurtwisseling, de robot en het einde van het spel.

import './style.css'

import { drawBoard, drawPieces, highlightMoves, clearMoveHighlights, highlightMoveablePieces, clearPieceHighlights } from './ui/render.js'
import { initializeBoard, getBoard, getPiece, movePiece, capturePiece } from './game/board.js'
import { canMoveTo, isCaptureMove, getPieceMoves, getValidBlackMoves, getMoveablePieces, getWinner } from './game/rules'
import { isPlayerTurn, switchTurn, getTurn, resetTurn } from './game/state.js'
import { pickRandomMove, pickSmartMove } from './game/robot.js'
import { WHITE, BLACK, MODE_PVP, MODE_SMART_ROBOT } from './lib/constants.js'

let selectedPiece = null
let isVersingRobot = false
let isRobotSmart = false
let isGameOver = false

function getVictim(attacker, landing) {
    const victimCol = (attacker.col + landing.col) / 2
    const victimRow = (attacker.row + landing.row) / 2

    return getPiece(victimRow, victimCol)
}

function isRobotsTurn() {
    return isVersingRobot && getTurn() === BLACK
}

function endGame(winner) {
    isGameOver = true
    const name = winner === WHITE ? 'Wit' : 'Zwart'
    document.querySelector('#game-over-text').textContent = `${name} heeft gewonnen!`
    document.querySelector('#game-over').hidden = false
}

function backToMenu() {
    document.querySelector('#game-over').hidden = true
    document.querySelector('.grid-container').classList.add('hidden')
    document.querySelector('#menu').hidden = false
}

function refreshPieceHighlights() {
    clearPieceHighlights()

    if (isRobotsTurn()) return

    highlightMoveablePieces(getMoveablePieces(getTurn()))
}

function executeMove(piece, target) {
    if (isCaptureMove(piece, target)) {
        capturePiece(getVictim(piece, target))
    }
    movePiece(piece, target)
    drawPieces(getBoard())
    switchTurn()

    const winner = getWinner(getTurn())
    if (winner != null) {
        clearPieceHighlights()
        endGame(winner)
        return
    }

    refreshPieceHighlights()
}

function playRobotTurn() {
    let move
    if (isRobotSmart) {
        move = pickSmartMove(getValidBlackMoves())
    } else {
        move = pickRandomMove(getValidBlackMoves())
    }

    if (move == null) return

    setTimeout(() => {
        if (isGameOver) return
        executeMove(move.piece, move.move)
    }, 1000)
}

function tryPlayerMove(target) {
    if (!canMoveTo(selectedPiece, target)) return false

    executeMove(selectedPiece, target)
    selectedPiece = null
    return true
}

function selectPiece(piece) {
    if (piece == null || !isPlayerTurn(piece)) {
        selectedPiece = null
        return
    }

    selectedPiece = piece
    highlightMoves(getPieceMoves(piece))
}

function onCellClick(row, col) {
    if (isGameOver || isRobotsTurn()) return

    clearMoveHighlights()

    const target = { row, col }
    const clicked = getPiece(row, col)

    if (clicked == null && selectedPiece != null) {
        if (tryPlayerMove(target)) {
            if (!isGameOver && isRobotsTurn()) {
                playRobotTurn()
            }
        } else {
            highlightMoves(getPieceMoves(selectedPiece))
        }
        return
    }

    selectPiece(clicked)
}

function startGame(mode) {
    isVersingRobot = mode !== MODE_PVP
    isRobotSmart = mode === MODE_SMART_ROBOT

    isGameOver = false
    selectedPiece = null
    resetTurn()
    initializeBoard()

    const container = document.querySelector('.grid-container')
    container.replaceChildren()
    container.classList.remove('hidden')
    document.querySelector('#menu').hidden = true

    drawBoard(onCellClick)
    drawPieces(getBoard())
    refreshPieceHighlights()
}

document.querySelectorAll('#menu button').forEach((button) => {
    button.addEventListener('click', () => startGame(button.dataset.mode))
})
document.querySelector('#back-to-menu').addEventListener('click', backToMenu)
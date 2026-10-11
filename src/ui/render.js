import { WHITE, BLACK } from '../lib/constants'

export function drawBoard(onClick) {
    const boardDimension = 8;
    const gridContainer = document.querySelector(".grid-container")

    for (let row = 0; row < boardDimension; row++) {
        for (let col = 0; col < boardDimension; col++) {
            const square = document.createElement('div')
            if ((row + col) % 2 == 0) {
                square.classList.add("light")
            } else {
                square.classList.add("dark")
            }

            //square.textContent = `${row}, ${col}`
            square.addEventListener("click", function() {
                onClick(row, col)
            })

            square.setAttribute("id", `${row}${col}`)
            gridContainer.append(square)
        }
    }
}

function getCell(row, col) {
    const cell = document.getElementById(`${row}${col}`)
    if (cell == null) {
        console.warn(`Kon cell op positie ${row}, ${col} niet ophalen`)
        return null
    }
    return cell
}

function clearPlayfield() {
    const cells = document.querySelector('.grid-container').children
    for (const cell of cells) {
        if (cell.hasChildNodes()) {
            cell.replaceChildren()
        }
    }
}

export function clearMoveHighlights() {
    const cells = document.querySelectorAll('.highlight')
    cells.forEach(elem => elem.remove())
}

export function highlightMoves(moves) {
    for (const move of moves) {
        const cell = getCell(move.move.row, move.move.col)
        const highlightElement = document.createElement('div')
        highlightElement.classList.add('highlight')

        cell.append(highlightElement)
    }
}

export function clearPieceHighlights() {
    const cells = document.querySelectorAll('.piece-highlight')
    cells.forEach(elem => elem.remove())
}

export function highlightMoveablePieces(pieces) {
    for (const piece of pieces) {
        const cell = getCell(piece.row, piece.col)
        let pieceElement
        if (piece.color === "black") {
            pieceElement = cell.querySelector('.black-piece')
        } else if (piece.color === "white") {
            pieceElement = cell.querySelector('.white-piece')
        }
        pieceElement.style.outline = "4px solid #ff0000"
    }
}

export function drawPieces(pieces) {
    clearPlayfield()
    for (const piece of pieces) {
        const cell = getCell(piece.row, piece.col)
        const pieceElement = document.createElement('div')
        if (piece.color === "black") {
            pieceElement.classList.add("black-piece")
        } else if (piece.color === "white") {
            pieceElement.classList.add("white-piece")
        }
        cell.append(pieceElement)
    }
}
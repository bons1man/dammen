# Bitdam

Een dammenspel gemaakt in JavaScript, HTML en CSS met Vite.

## Starten

Je hebt [Node.js](https://nodejs.org) nodig.

```bash
npm install
npm run dev
```

Open daarna de link die in de terminal verschijnt (meestal `http://localhost:5173`).

## Hoe het werkt

1. Kies in het menu een spelmodus: 1 vs 1, tegen de robot of tegen de slimme robot.
2. Wit begint. De stenen die kunnen bewegen hebben een rode rand.
3. Klik op een steen om te zien waar die heen kan (groene bolletjes) en klik op een groen vakje om te zetten.
4. Als de tegenstander geen zet meer heeft, heb je gewonnen. Daarna kun je terug naar het menu.

## Regels

- Een steen beweegt één vakje schuin vooruit op de donkere vakjes en mag niet naar achteren.
- Slaan is verplicht. Als je kunt slaan, mag je geen gewone zet doen.
- De dam, meerdere keren achter elkaar slaan en remise zitten er niet in.

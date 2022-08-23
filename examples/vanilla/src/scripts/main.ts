import confetti from 'canvas-confetti';

function tada() {
    confetti.create(null, {
        resize: true,
        useWorker: true,
    })({ particleCount: 200, spread: 200 });
}

tada()

document.addEventListener('click', () => tada())

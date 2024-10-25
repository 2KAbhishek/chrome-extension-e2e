let count = 0;

chrome.storage.local.get(['count'], (result) => {
    count = result.count || 0;
    updateDisplay();
});

function updateDisplay() {
    document.querySelector('[data-testid="counter"]').textContent = count;
    chrome.storage.local.set({count});
}

document
    .querySelector('[data-testid="increment"]')
    .addEventListener('click', () => {
        count++;
        updateDisplay();
    });

document
    .querySelector('[data-testid="decrement"]')
    .addEventListener('click', () => {
        count--;
        updateDisplay();
    });

document
    .querySelector('[data-testid="reset"]')
    .addEventListener('click', () => {
        count = 0;
        updateDisplay();
    });

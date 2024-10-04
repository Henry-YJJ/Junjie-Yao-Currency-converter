const apiKey = 'd275234f72ed20a5494d4452'; 
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const amountInput = document.getElementById('amount');
const resultDiv = document.getElementById('result');
const convertButton = document.getElementById('convert');

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('API Data:', data); 
        if (data.conversion_rates) {
            const currencies = Object.keys(data.conversion_rates);
            currencies.forEach(currency => {
                const option1 = document.createElement('option');
                const option2 = document.createElement('option');
                option1.value = currency;
                option1.textContent = currency;
                option2.value = currency;
                option2.textContent = currency;
                fromCurrency.appendChild(option1);
                toCurrency.appendChild(option2);
            });
        } else {
            throw new Error('Invalid data structure from API');
        }
    })
    .catch(error => {
        console.error('Error fetching currency data:', error); 
        resultDiv.textContent = 'Failed to load currency options. Please try again later.';
    });

convertButton.addEventListener('click', () => {
    const amount = amountInput.value;
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (amount === '' || isNaN(amount)) {
        alert('Please enter a valid amount');
        return;
    }

    const conversionUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`;

    fetch(conversionUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.conversion_result) {
                const result = data.conversion_result;
                resultDiv.textContent = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
            } else {
                throw new Error('Invalid data structure from API');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.textContent = 'An error occurred. Please try again later.';
        });
});

const rateTableBody = document.querySelector('#rateTable tbody');

function fetchAndDisplayRates(baseCurrency) {
    fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`)
        .then(response => response.json())
        .then(data => {
            const rates = data.conversion_rates;
            const rateEntries = Object.entries(rates).slice(0, 10);
            let tableContent = '';

            rateEntries.forEach(([currency, rate]) => {
                
                // https://blog.csdn.net/u010866487/article/details/9001006#:~:text=%E6%A8%A1%E6%8B%9F%E6%98%BE%E7%A4%BA%E4%B8%80%E4%B8%AA
                const change = (Math.random() - 0.5).toFixed(2); 
                const rateChangeClass = change > 0 ? 'rate-up' : 'rate-down';

                tableContent += `
                    <tr>
                        <td>${currency}</td>
                        <td>${rate.toFixed(4)}</td>
                        <td class="${rateChangeClass}">${change}%</td>
                    </tr>
                `;
            });

            rateTableBody.innerHTML = tableContent;
        })
        .catch(error => {
            console.error('Error fetching exchange rates:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayRates('USD');
});
document.getElementById('convert').addEventListener('click', () => {
    const fromCurrency = document.getElementById('fromCurrency').value;
    fetchAndDisplayRates(fromCurrency); 
});

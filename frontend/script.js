function generateGraph() {
    const stock = document.getElementById('stock').value;
    const fromMonth = document.getElementById('fromMonth').value;
   // const fromYear = document.getElementById('fromYear').value;
    const toMonth = document.getElementById('toMonth').value;
   // const toYear = document.getElementById('toYear').value;

    // Fetch data from MongoDB 

    fetch(`http://localhost:4010/api/stocks?stock=${stock}&fromMonth=${fromMonth}&toMonth=${toMonth}`)

        .then(response => response.json())
        .then(data => {
            // Process data and generate graph using a charting library (e.g., Chart.js)
            // Example:
            const chartData = processData(data);
            renderChart(chartData);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// function processData(data) {
//     // Process the fetched data as needed
//     // Example: Extract necessary information for the chart
//     // Return the processed data
// }

// function renderChart(data) {
//     // Use a charting library (e.g., Chart.js) to render the chart
//     // Example:
//     const ctx = document.getElementById('chartContainer').getContext('2d');
//     const chart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: data.labels,
//             datasets: data.datasets
//         },
//         options: {
//             // Chart options
//         }
//     });
// }

function processData(data) {
    const labels = []; // Array to store labels (dates)
    const values = []; // Array to store stock values

    // Process the fetched data
    data.forEach(entry => {
        labels.push(entry.Date); // Assuming Date field is available in the data
        values.push(entry.Close); // Assuming Close field represents the stock value
    });

    // Return the processed data as an object
    return {
        labels: labels,
        datasets: [{
            label: 'Stock Value',
            data: values,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };
}

function renderChart(data) {
    // Use Chart.js to render the line chart
    const ctx = document.getElementById('chartContainer').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'time', // Assuming labels represent dates
                    time: {
                        unit: 'month' // Adjust as needed based on your data
                    }
                },
                y: {
                    beginAtZero: true // Start y-axis at zero
                }
            }
        }
    });
}


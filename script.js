const CORONA_TRAFFIC_URL = 'https://knudmoeller.github.io/berlin_corona_cases/data/target/berlin_corona_traffic_light.json';


function render(datasets) {
    console.log(moment());
    var ctx = document.getElementById('chart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Chart.js Time Point Data'
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    },
                    ticks: {
                        major: {
                            fontStyle: 'bold',
                            fontColor: '#FF0000'
                        }
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'value'
                    }
                }]
            }
        }
    });
}

async function getData() {
    return (await fetch(CORONA_TRAFFIC_URL)).json();
}

function getDataset(data, label, key) {
    data.reverse();
    return {
        label,
        data: data.map(e => ({ x: e.pr_date, y: e.indicators[key].value })),
        pointBackgroundColor: data.map(e => e.indicators[key].color),
        // fill: 'none'
        //yAxisID: key
    }
}

function transform(data) {

    const datasets = [
        getDataset(data, 'Reproduktionszahl R', 'basic_reproduction_number'),
        getDataset(data, 'Neue Infektionen', 'incidence_new_infections'),
        getDataset(data, 'Intensivbetten', 'icu_occupancy_rate')
    ];

    console.log(datasets);
    return datasets;
}

getData()
    .then(data => render(transform(data)));
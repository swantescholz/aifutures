google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(onLoadCallback);

const CATEGORIES = [EXISTENTIAL, AMBIVALENT, GOOD];

function onLoadCallback() {
    var chart = new google.visualization.ColumnChart(document.getElementById(idTotalPlot));
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Outcome');
    data.addColumn('number', 'Probability');
    data.addColumn({type: 'string', role: 'style'});
    data.addColumn({type: 'string', role: 'annotation'});

    // get probabilities for each category for the nodes
    CATEGORIES.map(categoy => {
        nodes.filter(node => {todo

        }
        .map(eIndex => pEdge(eIndex)).reduce((a, b) => a + b, 0.0);
    };

    var options = {
        title: "Total Probabilities",
        width: 800,
        height: 400,
        bar: {groupWidth: "75%"},
        legend: { position: "none" },
        chartArea: { width: '50%' },
        // hAxis: {
        //     title: 'Element'
        // },
        vAxis: {
            // title: 'Probability (%)',
            format: 'percent'
        },
        annotations: {
            alwaysOutside: false
        },
        animation: {
            duration: 100,
            easing: 'out',
        },
    };

    function updateChartData() {
        data.removeRows(0, data.getNumberOfRows());
        data.addRows([
            ['Copper\nCu\n29', Math.random(), 'color: #b87333', (Math.random() * 20).toFixed(2) + ' g/cm³'],
            ['Silver\nAg\n47', Math.random(), 'color: silver', (Math.random() * 20).toFixed(2) + ' g/cm³'],
            ['Gold\nAu\n79', Math.random(), 'color: gold', (Math.random() * 20).toFixed(2) + ' g/cm³'],
            ['Platinum\nPt\n78', Math.random(), 'color: #e5e4e2', (Math.random() * 20).toFixed(2) + ' g/cm³']
        ]);
        chart.draw(data, options);
    }

    // Update plots at a regular interval.
    setInterval(updateChartData, 3000);
}
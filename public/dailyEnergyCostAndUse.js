document.addEventListener('DOMContentLoaded', function() {

    function coloring(data) {
        let maxProduct = 0;
        let minProduct = Infinity;
      
        // Find min and max first
        data.map((point) => {
            const product = point[0] * point[1];
            maxProduct = Math.max(maxProduct, product);
            minProduct = Math.min(minProduct, product);
        });
      
        console.log(maxProduct, minProduct);
      
        // Come up a split interval
        const numSplits = 10;
        const splitInterval = (maxProduct - minProduct) / (numSplits - 1);
        
        // Assign colors along the split interval
        return data.map((point) => {
            const product = point[0] * point[1]; // kW used * the usage cost

            let color;
            if (product < minProduct + (1 * splitInterval)) color = '#8FD2F9';
            else if (product < minProduct + (2 * splitInterval)) color = '#74c7f8';
            else if (product < minProduct + (3 * splitInterval)) color = '#58bbf6';
            else if (product < minProduct + (4 * splitInterval)) color = '#64b1e4';
            else if (product < minProduct + (5 * splitInterval)) color = '#70a6d2';
            else if (product < minProduct + (6 * splitInterval)) color = '#7c9bc0';
            else if (product < minProduct + (7 * splitInterval)) color = '#8890ae';
            else if (product < minProduct + (8 * splitInterval)) color = '#A07B8A';
            else if (product < minProduct + (9 * splitInterval)) color = '#b76566';
            else color = '#e94f37';

            return { y: point[0], z: point[1], color: color };
        });
    }

    const hourlyIntervals = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM'];

    const data = [
        [1.0, 0.15],
        [1.05, 0.14],
        [1.10, 0.13],
        [1.05, 0.12],
        [1.9, 0.11],
        [2.1, 0.10],
        [1.85, 0.09],
        [1.65, 0.10],
        [1.7, 0.11],
        [2.3, 0.15],
        [2.4, 0.19],
        [2.35, 0.25],
        [1.5, 0.27],
        [1.35, 0.25],
        [1.2, 0.21],
        [1.75, 0.16],
        [2.8, 0.11],
        [2.9, 0.09],
        [2.2, 0.07],
        [1.5, 0.09],
        [1.25, 0.11],
        [1.2, 0.12],
        [1.1, 0.13],
        [1.05, 0.14]
    ];
    
    /* 
     * Renders the chart (and stores data locally for exporting)
     */
    const dailyEnergyCostAndUse = Highcharts.chart('dailyEnergyCostAndUseContainer', {
        chart: {
            type: 'variwide'
        },
        title: {
            text: 'Annual Energy Usage and Cost Throughout the Day'
        },
        yAxis: {
            title: {
                text: 'Hourly cost of energy (in Dollars)'
            }
        },
        xAxis: {
            categories: hourlyIntervals,
            title: {
                text: 'Time of Day'
            },
            labels: {
                rotation: -45
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            type: 'variwide',
            keys: ['y', 'z'],
            data: coloring(data),
            dataLabels: {
                enabled: true,
                formatter: function() {
                // kW used ✖ the usage cost ✖ number of days in a year
                return '$' + (this.y * this.point.options.z * 365).toFixed(2);
                }
            },
            tooltip: {
                pointFormat: 'Energy used: <b>{point.y} kW</b><br>' +
                'Daily energy cost: <b>${point.z}</b><br>'
            },
            borderRadius: 3,
          }
        ],
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        }
    });

    /* 
    * For production to use exporting, along with the appropriate type 
    */
    const filetype = 'image/svg+xml';
    // const filetype = 'image/jpeg',
    // const filetype = 'image/png',

    // dailyEnergyCostAndUse.exportChartLocal({
    //     type: filetype,
    //     filename: 'dailyEnergyCostAndUseChart'
    // }, dailyEnergyCostAndUseOptions);
});
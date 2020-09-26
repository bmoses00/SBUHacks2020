fetch('api/get_officer_complaint_ranking').then(response => response.json())
    .then(data => {
        data.arr.splice(0, 0, "Officer Ranking");
        console.log(data.arr.length)
        let ranking = ["x"];
        for (let i = 1; i <= 1461; i++) {
            ranking[i] = i*50;
        }
        var chart = c3.generate({
           bindto: '#rankings',
           data: {
             x: "x",
             columns: [
               ranking,
               data.arr,
             ],
             colors: {
               "Officer Ranking": "#ff0000"
             },
             types: {
               "Officer Ranking": "bar"
             }
           }
       });
    });

fetch('api/get_complaints_by_year').then(response => response.json())
    .then(data => {
        data.arr.splice(0, 0, "Complaints by Year");
        // creating list for x-axis, from 1985 to 2020
        let years = ["x"]
        for (let i = 1; i <= 40; i++) {
            years[i] = i + 1984;
        }
        var chart = c3.generate({
           bindto: '#yearly',
           data: {
             x: "x",
             columns: [
               years,
               data.arr,
             ],
             types: {
               "Complaints by Year": "bar"
             }
           }
       });
    });


fetch('api/get_fado_frequences').then(response => response.json())
    .then(data => {
    var chart = c3.generate({
       bindto: '#fado',
       data: {
         columns: data.arr,
         type: "pie"
       }
   });
});

fetch('api/get_allegation_frequences').then(response => response.json())
    .then(data => {
    var chart = c3.generate({
       bindto: '#allegations',
       data: {
         columns: data.arr,
         type: "pie"
       }
   });
});

fetch('api/get_board_frequences').then(response => response.json())
    .then(data => {
    var chart = c3.generate({
       bindto: '#dispositions',
       data: {
         columns: data.arr,
         type: "pie"
       }
   });
});

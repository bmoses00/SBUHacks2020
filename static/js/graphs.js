fetch('api/get_officer_complaint_ranking').then(response => response.json())
    .then(data => {
        data.arr.splice(0, 0, "officer_ranking");
        var chart = c3.generate({
           bindto: '#rankings',
           data: {
             columns: [
               data.arr,
             ],
             colors: {
               officer_ranking: "#ff0000"
             },
             types: {
               officer_ranking: "bar"
             }
           }
       });
    });

fetch('api/get_complaints_by_year').then(response => response.json())
    .then(data => {
        data.arr.splice(0, 0, "complaints_by_year");
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
               data.arr: "bar"
             }
           }
       });
    });


fetch('api/get_fado_frequences').then(response => response.json())
    .then(data => {
    var chart = c3.generate({
       bindto: '#fado',
       data: {
         columns: columns,
         type: "pie"
       }
   });
});

fetch('api/get_data').then(response => response.json())
    .then(data => {
        // officer_ranking
        officer_data = data.arr.short_arr;
        officer_data.splice(0, 0, "Complaint Count");
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
               officer_data,
             ],
             colors: {
               "Complaint Count": "#ff0000"
             },
             types: {
               "Complaint Count": "bar"
             }
           }
       });


       // complaints by year
       year_data = data.arr.complaints_by_year;
       year_data.splice(0, 0, "Complaints by Year");
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
              year_data,
            ],
            types: {
              "Complaints by Year": "bar"
            }
          }
      });


      // fado frequencies
      fado_data = data.arr.fado_frequences
      var chart = c3.generate({
         bindto: '#fado',
         data: {
           columns: fado_data,
           type: "pie"
         }
     });


     // allegation frequencies
     allegation_data = data.arr.allegation_frequencies
     var chart = c3.generate({
        bindto: '#allegations',
        data: {
          columns: allegation_data,
          type: "pie"
        }
    });


    // board frequencies
    board_data = data.arr.board_frequences
    var chart = c3.generate({
       bindto: '#dispositions',
       data: {
         columns: board_data,
         type: "pie"
       }
   });
});

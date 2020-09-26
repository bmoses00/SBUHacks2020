d3.csv("static/data/CCRB_database_raw.csv").then(function(data) {
    // graph 1: ranking graph
    var dict = {};
    var sorting_arr = [];
    data.forEach(function(d, index) {
        if (index > 10000) return;

        let officer_name = d["First Name"] + "_" + d["Last Name"];
        if (!(officer_name in dict)) dict[officer_name] = 1;
        else dict[officer_name] += 1;
     });

     let keys = Object.keys(dict);
     for (let key of keys) {
         sorting_arr.push(dict[key]);
     };
     sorting_arr.sort((a,b)=>b-a);
     sorting_arr.splice(0, 0, "officer_ranking")

     var chart = c3.generate({
        bindto: '#rankings',
        data: {
          columns: [
            sorting_arr,
          ],
          types: {
            officer_ranking: "bar"
          }
        }
    });

    // graph 2: complaints by year
    let dates = [];
    // complaints by year is data for y-axis
    let complaints_by_year = []
    // get years data from csv
    data.forEach(function(d, index) {
        if (index > 100000) return;
        if (d["Incident Date"] != "NULL"
         && d["Incident Date"].slice(-4) != "1900"
         && d["Incident Date"].slice(-4) != "1983"
         && d["Incident Date"].slice(-4) != "1984") {
             dates.push(d["Incident Date"].slice(-4));
         }
    });
    // create dict with year: complaints pairs
    var year_dict = {};
    for (let i = 0; i < dates.length; i++) {
        if (!(dates[i] in year_dict)) year_dict[dates[i]] = 1;
        else year_dict[dates[i]] += 1;
    }
    let year_keys = Object.keys(year_dict);
    for (let key of year_keys) {
        complaints_by_year.push(year_dict[key]);
    };
    complaints_by_year.splice(0, 0, "yearly_complaints");
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
           complaints_by_year,
         ],
         types: {
           yearly_complaints: "bar"
         }
       }
   });



   // chart 3: bar graphs!!!! :)
   let fado_arr = []
   data.forEach(function(d, index) {
       if (index > 10000) return;
       if (d["FADO Type"] != "NULL") {
           fado_arr.push(d["FADO Type"]);
       }
    });
    var fado_dict = {};
    for (let i = 0; i < fado_arr.length; i++) {
        if (!(fado_arr[i] in fado_dict)) fado_dict[fado_arr[i]] = 1;
        else fado_dict[fado_arr[i]] += 1;
    }
    columns = [];
    let fado_keys = Object.keys(fado_dict);
    for (let key of fado_keys) {
        columns.push([key, fado_dict[key]]);
    }

    var chart = c3.generate({
       bindto: '#fado',
       data: {
         columns: columns,
         type: "pie"
       }
   });




});

from flask import Flask, render_template, request, jsonify
import configparser
import csv

ccrb_database = []
data_per_command = {}
precinct_rank = {}

app = Flask(__name__)


@app.route("/")
def main():
    config = configparser.ConfigParser()
    config.read('properties.ini')
    return render_template("index.html", key=config["DEFAULT"]["Key"])

@app.route("/api/get_data_by_precinct", methods=['GET', 'POST'])
def data_by_precinct():
    precinct_num = int(request.args.get('precinct'))

    total_complaints = len(data_per_command[precinct_num])

    precinct_dat = data_per_command[precinct_num]
    columns = ccrb_database[0]
    id_idx = columns.index("Unique Id")
    unique_set = set([row[id_idx] for row in precinct_dat])

    first_name_idx = columns.index("First Name")
    last_name_idx = columns.index("Last Name")
    allegation_idx = columns.index("Allegation")

    names = [row[first_name_idx] + " " + row[last_name_idx] for row in precinct_dat]
    allegations = [row[allegation_idx] for row in precinct_dat]

    total_unique = len(unique_set)

    dat = {
        "unique_officers": total_unique,
        "total_complaints": total_complaints,
        "ranking": precinct_rank[precinct_num] + 1,
        "complaints_list": list(zip(names, allegations))
    }
    return jsonify(dat)
    # config = configparser.ConfigParser()
    # config.read('properties.ini')
    # return render_template("index.html", key=config["DEFAULT"]["Key"])

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/graph")
def graph():
    return render_template("graph.html")

@app.route("/contacts")
def contacts():
    return render_template("contacts.html")

@app.route("/resources")
def resources():
    return render_template("resources.html")

def load_police_data():
    print("loading data")

    with open('static/data/CCRB_database_raw.csv', 'r') as csvfile:
        csvreader = csv.reader(csvfile)
        for row in csvreader:
            ccrb_database.append(row)

    columns = ccrb_database[0]
    command_idx = columns.index("Command")

    print("indexing data")

    for row in range(1, len(ccrb_database)):
        command = ccrb_database[row][command_idx]
        split_dat = command.split(' ')
        for val in split_dat:
            if len(val) == 3:
                precint = None
                if val.isdigit():
                    precint = int(val)
                elif val == "CPK":
                    # central park
                    precint = 22
                elif val == "MTS":
                    precint = 14
                elif val == "MTN":
                    precint = 18
                if precint == None:
                    break
                if precint not in data_per_command:
                    data_per_command[precint] = []
                data_per_command[precint].append(ccrb_database[row])
                break

    percent_loaded = sum([len(data_per_command[key])
                          for key in data_per_command]) / (len(ccrb_database)-1) * 100

    print(f"Extracted location data from {percent_loaded}% of the records")

    temp_precint_rank_arr = []
    for precinct_num in data_per_command:
        temp_precint_rank_arr.append((len(data_per_command[precinct_num]), precinct_num))
    
    temp_precint_rank_arr.sort(key = lambda x: x[0], reverse=True)

    for i in range(len(temp_precint_rank_arr)):
        precinct_rank[temp_precint_rank_arr[i][1]] = i


if __name__ == "__main__":
    load_police_data()
    app.debug = True
    app.run()

from flask import Flask, render_template
import configparser
import csv

ccrb_database = []
data_per_command = {}

app = Flask(__name__)


@app.route("/")
def main():
    config = configparser.ConfigParser()
    config.read('properties.ini')
    return render_template("index.html", key=config["DEFAULT"]["Key"])


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
                data_per_command[precint].append(row)
                break

    percent_loaded = sum([len(data_per_command[key])
                          for key in data_per_command]) / (len(ccrb_database)-1) * 100

    print(f"Extracted location data from {percent_loaded}% of the records")


if __name__ == "__main__":
    load_police_data()
    app.debug = True
    app.run()

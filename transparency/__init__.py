from flask import Flask, render_template, request, jsonify
import json
import os
DIR = os.path.dirname(__file__) or '.'
DIR += '/'

app = Flask(__name__)

@app.route("/")
def main():
    return render_template("home.html")

@app.route("/api/get_data", methods = ['GET', 'POST'])
def get_data():
    with open(DIR + 'static/data/precinct_data.json', 'r') as f:
        data = json.load(f)
    return jsonify({"arr": data})

@app.route("/api/get_rankings", methods=['GET', 'POST'])
def data_rankings():
    with open(DIR + 'static/data/precinct_data.json', 'r') as f:
        data = json.load(f)
    dat = {
        "rankings": [[precinct, data['precinct_rank'][precinct]] for precinct in data['precinct_rank']]
    }
    return dat

@app.route("/api/get_data_by_precinct", methods=['GET', 'POST'])
def data_by_precinct():
    precinct_num = int(request.args.get('precinct'))

    with open(DIR + 'static/data/precinct_data.json', 'r') as f:
        data = json.load(f)

    return jsonify(data['precinct_data'][request.args.get('precinct')])

@app.route("/map")
def home():
    with open(DIR + 'key.txt', 'r') as f:
        api_key = f.read()

    return render_template("index.html", key = api_key)

@app.route("/data")
def data():
    return render_template("data.html")

@app.route("/contacts")
def contacts():
    return render_template("contacts.html")

@app.route("/resources")
def resources():
    return render_template("resources.html")

if __name__ == "__main__":
    app.debug = True
    app.run()

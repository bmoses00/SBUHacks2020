from flask import Flask, render_template
import configparser

app = Flask(__name__)

@app.route("/")
def main():
    config = configparser.ConfigParser()
    config.read('properties.ini')
    return render_template("index.html", key = config["DEFAULT"]["Key"])

if __name__ == "__main__":
        app.debug = True
        app.run()

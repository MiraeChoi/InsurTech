from flask import Flask, request, render_template
from Main import Results
from flask_cors import CORS

app = Flask(__name__)

@app.route('/test')

def result():
    InspectionResult = Results.result()
    return InspectionResult

if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5000', debug=True)
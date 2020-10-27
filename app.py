from flask import Flask
app = Flask(__name__)

@app.route('/', methods=['POST'])
def result():
/*    total_result = 


if __name__ == '__main__':
    app.run(debug=False, port=80)
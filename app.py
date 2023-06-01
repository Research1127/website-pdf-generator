from flask import Flask, request, render_template,send_file
from flask_cors import CORS
import jinja2
import pdfkit
from datetime import datetime
import json


app = Flask(__name__, static_folder="static")
CORS(app)
directory_path = r"C:\Users\firdaus\Downloads"
# -------------------------------------------This Part is To generate the CSV file---------------------------------------------- #

# ----------------------------------This Part is To Read the csv file and render the main template---------------------------------------------- #
@app.route('/', methods=['GET'])
def index():
    # Read the CSV file and pass the data to the template
    with open('data.csv', 'r') as f:
        rows = [line.split(',') for line in f.read().split('\n') if line]
        header = rows.pop(0)  # remove first row and assign to header variable
    return render_template('index.html', rows=rows)


# ----------------------------------This Part is To Process The Value JavaScript---------------------------------------------- #

@app.route('/process_row', methods=['POST'])
def process_row():
    row_json = request.form.get('rowJson')  # Retrieve the value of 'rowJson' from the form data
    
    # Process the JSON string
    # Parse the JSON string back into a Python object
    row_object = json.loads(row_json)
    
    # Access the values of columns 1, 2, and 3
    
    ticketnumber = row_object['column2']
    created = row_object['column3']
    duedate = row_object['column4']
    lastmessage = row_object['column5']
    name = row_object['column6']
    email = row_object['column7']
    status = row_object['column8']
    phone = row_object['column9']
    source = row_object['column10']
    department = row_object['column11']
    priority = row_object['column12']
    helptopic = row_object['column13']
    

    # Current Issues Part
    issue1 = "Status"
    issue2 = "Priority"
    issue3 = "Help Topic"

    today_date = datetime.today().strftime("%d %b, %Y")
    month = datetime.today().strftime("%d %b, %Y")

    context = {'client_name': name, 'today_date': today_date, 'total': status, 'month': month, "ticket_no": ticketnumber,
            "created": created, "email": email, "source": source, "phone": phone, "department": department, "lastmessage": lastmessage, "duedate": duedate,
            'currentissue1': issue1, 'description1': status,
            'currentissue2': issue2, 'description2': priority,
            'currentissue3': issue3, 'description3': helptopic
            }

    template_loader = jinja2.FileSystemLoader("./")
    template_env = jinja2.Environment(loader=template_loader)

    template = template_env.get_template("ticket.html")
    output_text = template.render(context)

    config = pdfkit.configuration(wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe")
    pdfkit.from_string(output_text, "invoice_new.pdf", configuration=config, css="ticket.css")

    # Function to send the generated PDF file as a response
    def send_pdf():
        try:
            return send_file("invoice_new.pdf", as_attachment=True)
        except Exception as e:
            return str(e)
    
    return send_pdf()
    
if __name__ == "__main__":
    app.run(debug=True)



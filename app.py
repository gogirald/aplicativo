 # -*- coding: utf-8 -*-
"""
Created on Tue May 15 11:13:18 2018
@author: Data In situ
"""

from flask import Flask
#from flask_cors import CORS
from flask import render_template, flash, request, redirect, url_for, flash, redirect, session, abort
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps
from werkzeug.utils import secure_filename
import os


app = Flask(__name__, template_folder='template')

MONGODB_HOST = 'mongodb+srv://equipo01:d4t41ns1tu*@monitoreo-cl5aq.mongodb.net/energia?retryWrites=true'
MONGODB_PORT = 27017
DBS_NAME = 'energia'
COLLECTION_NAME = 'cauchoscorona'
VALIDATION='validacion'
LOGEAR = {'usuario':True, }
FIELDS = {'estampa tiempo':True,
          'frecuencia':True,
          'voltaje L1':True,
          'voltaje L2':True,
          'voltaje L3':True,
          'voltaje L1-L2': True,
          'voltaje L2-L3': True,
          'voltaje L3-L1': True,
          'corriente L1':True,
          'coriente L2':True,
          'corriente L3':True,
          'corriente total': True,
          'potencia Activa Total':True,
          'potencia reactiva total':True,
          'potencia aparente total': True,
          'factor potencia total':True,
          'energia activa':True,
          'energia inductiva':True,
          'energia capacitiva':True,
          'energia aparente':True,
          '_id': False}

@app.route("/")
def home():
    if not session.get('logged_in'):
        return render_template("login.html")
    else:
        return render_template("index.html")

@app.route("/login", methods=['POST'])
def do_admin_login():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][VALIDATION]
    login_user = collection.find_one({'usuario' : request.form['username']})

    if login_user:
        if login_user['password'] == request.form['password']:
            session['logged_in'] = True
            global datos
            datos = login_user['collection']
    else:
        flash('wrong password!')
    return home()

@app.route("/energia/monitoreo")
def energia_dashboard():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][datos]
    projects = collection.find(projection=FIELDS)
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.close()
    return json_projects

@app.route("/sign_out")
def sign_out():
    session['logged_in'] = False
    return home()
#@app.route('/sign_out')
#def sign_out():
#    session.pop('usuario')
#    return redirect(url_for('index'))


if __name__ == "__main__":
    app.secret_key = os.urandom(12)
    app.run(host='0.0.0.0',port=8080,debug=True)

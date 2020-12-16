# this file is used to pre-generate json data
import csv
import json
import os
DIR = os.path.dirname(__file__) or '.'
DIR += '/'

ccrb_database = []
data_per_command = {}
precinct_rank = {}

officer_complaint_dict = {}
short_arr = []

year_complaint_dict = {}
complaints_by_year = []

fado_frequences = []
fado_dict = {}

allegation_frequencies = []
allegation_dict = {}

board_frequences = []
board_dict = {}


def load_police_data():
    print("loading data")

    with open(DIR + 'static/data/CCRB_database_raw.csv', 'r') as csvfile:
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


    first_name_idx = columns.index("First Name")
    last_name_idx = columns.index("Last Name")

    for r in range(1, len(ccrb_database)):
        row = ccrb_database[r]
        officer_name = row[first_name_idx] + " " + row[last_name_idx]
        officer_complaint_dict[officer_name] = officer_complaint_dict.get(officer_name, 0) + 1

    complaint_counts = [officer_complaint_dict[officer] for officer in officer_complaint_dict]
    complaint_counts.sort(reverse = True)

    for i in range(5):
        short_arr.append(complaint_counts[i])

    for i in range(5, len(complaint_counts), 50):
        short_arr.append(complaint_counts[i])

    incident_idx = columns.index("Incident Date")

    for r in range(1, len(ccrb_database)):
        row = ccrb_database[r]
        if row[incident_idx] != 'NULL':
            last_4 = row[incident_idx][-4:]
            if last_4 != '1900' and last_4 != '1983' and last_4 != '1984':
                year_complaint_dict[last_4] = year_complaint_dict.get(last_4, 0) + 1

    for i in range(1985, 2020+1):
        complaints_by_year.append(year_complaint_dict[str(i)])

    fado_idx = columns.index("FADO Type")

    for r in range(1, len(ccrb_database)):
        row = ccrb_database[r]
        if row[fado_idx] != 'NULL':
            val = row[fado_idx]
            fado_dict[val] = fado_dict.get(val, 0) + 1

    for k in fado_dict:
        fado_frequences.append([k, fado_dict[k]])

    allegation_idx = columns.index("Allegation")

    for r in range(1, len(ccrb_database)):
        row = ccrb_database[r]
        if row[allegation_idx] != 'NULL':
            val = row[allegation_idx]
            allegation_dict[val] = allegation_dict.get(val, 0) + 1

    a_keys = [k for k in allegation_dict]
    a_keys.sort(key = lambda x: allegation_dict[x], reverse = True)

    for i in range(9):
        allegation_frequencies.append([a_keys[i], allegation_dict[a_keys[i]]])

    remaining = 0
    for i in range(9, len(a_keys)):
        remaining += allegation_dict[a_keys[i]]

    allegation_frequencies.append(["Other", remaining])

    board_idx = columns.index("Board Disposition")

    for r in range(1, len(ccrb_database)):
        row = ccrb_database[r]
        if row[board_idx] != 'NULL':
            val = row[board_idx]
            board_dict[val] = board_dict.get(val, 0) + 1

    # for k in board_dict:
    #     board_frequences.append([k, board_dict[k]])

    b_keys = [k for k in board_dict]
    b_keys.sort(key = lambda x: board_dict[x], reverse = True)

    for i in range(9):
        board_frequences.append([b_keys[i], board_dict[b_keys[i]]])

    remaining = 0
    for i in range(9, len(b_keys)):
        remaining += board_dict[b_keys[i]]

    board_frequences.append(["Other", remaining])

    data = {}
    data['short_arr'] = short_arr
    data['complaints_by_year'] = complaints_by_year
    data['fado_frequences'] = fado_frequences
    data['allegation_frequencies'] = allegation_frequencies
    data['board_frequences'] = board_frequences
    data['precinct_rank'] = precinct_rank


    precinct_data = {}

    for precinct_num in data_per_command:

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
            # "complaints_list": list(zip(names, allegations))
        }

        precinct_data[precinct_num] = dat

    data['precinct_data'] = precinct_data

    with open('static/data/precinct_data.json', 'w') as f:
        json.dump(data, f)

load_police_data()

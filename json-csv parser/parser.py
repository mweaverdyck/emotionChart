#!/usr/bin/python

# Author: Meng Du
# July 31, 2016

import sys
import csv
import json

NUM_TOTAL_POINTS = 21

def parse(json_obj, full_data_file, history_file, original_data_file):
    # Write CSV Header
    # full_data header
    full_data_header = ["subject ID", "start time", "end time"]
    for pt in range(1, NUM_TOTAL_POINTS + 1):
        full_data_header.append("")
    full_data_file.writerow(full_data_header)

    # Write Subject Data
    for firebaseSubjectId in json_obj:
        subject = json_obj[firebaseSubjectId]
        subject_id = subject["id"]
        start_time = subject["start_time"]
        if "end_time" in subject:
            end_time = subject["end_time"]
        else:
            end_time = ''   # no end time means the participant did not finish
        csv_subject_row = [subject_id, start_time, end_time]
        for emotionId in subject:
            if emotionId == "id" or emotionId == "start_time":
                continue
            jsonFullData = subject[emotionId]["full_data"]
            jsonHistory = subject[emotionId]["history"]
            jsonOriginalData = subject[emotionId]["original_data"]
            for tuple in jsonFullData:



if __name__ == "__main__":
    if len(sys.argv) < 2:
        print "Please pass the name of the json file as an argument. For example:"
        print "    python parser.py emotion-dynamics-export.json"
        sys.exit(0)
    filename = sys.argv[1]
    with open(filename) as jsonFile:
        # three output files
        full_data_file = csv.writer(open("results_full_data.csv", "wb+"))
        history_file = csv.writer(open("results_history.csv", "wb+"))
        original_data_file = csv.writer(open("results_original_data.csv", "wb+"))
        parse(json.load(jsonFile), full_data_file, history_file, original_data_file)

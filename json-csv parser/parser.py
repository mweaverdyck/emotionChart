#!/usr/bin/python

# Author: Meng Du
# July 31, 2016

import sys
import csv
import json
from collections import OrderedDict

NUM_TOTAL_POINTS = 21


def parse(json_obj, full_data_file, history_file, original_data_file):
    # 1) Get CSV Headers
    data_header = ["subject ID", "start time", "end time"]  # same for full_data and original_data
    history_header = ["subject ID", "start time", "end time"]
    num_common_columns = len(data_header)

    # i) find out the length of history_header
    subject = json_obj[json_obj.keys()[1]]
    num_emotions = len(subject) - num_common_columns
    max_history_lengths = [0] * num_emotions  # initialize an zero list
    # iterate through subjects
    for subject in json_obj:
        emotion_index = -1
        for emotion in json_obj[subject]:
            if emotion[0].islower():  # not an emotion
                continue
            emotion_index += 1
            current_history_length = len(json_obj[subject][emotion]["history"])
            if current_history_length > max_history_lengths[emotion_index]:
                max_history_lengths[emotion_index] = current_history_length

    # ii) iterate through emotions
    subject = json_obj[json_obj.keys()[1]]
    emotion_index = -1
    for emotion in subject:
        if emotion[0].islower():  # not an emotion
            continue
        emotion_index += 1
        # create data header
        data_header.append(emotion + "/index")
        for pt in range(0, len(subject[emotion]["full_data"])):
            point_label = subject[emotion]["full_data"][pt][2]
            data_header.append(emotion + "/" + str(point_label) + "/x")
            data_header.append(emotion + "/" + str(point_label) + "/y")
        for event in range(1, max_history_lengths[emotion_index] + 1):
            history_header.append(emotion + "/event_" + str(event) + "/name")
            history_header.append(emotion + "/event_" + str(event) + "/time")
            history_header.append(emotion + "/event_" + str(event) + "/point/x")
            history_header.append(emotion + "/event_" + str(event) + "/point/y")
            history_header.append(emotion + "/event_" + str(event) + "/point/label")

    # iii) write headers to files
    full_data_file.writerow(data_header)
    original_data_file.writerow(data_header)
    history_file.writerow(history_header)

    # 2) Get Subject Data
    for firebaseSubjectId in json_obj:
        subject = json_obj[firebaseSubjectId]
        subject_id = subject["id"]
        start_time = subject["start_time"]
        if "end_time" in subject:
            end_time = subject["end_time"]
        else:
            end_time = ''   # no end time means the participant did not finish
        csv_full_data_row = [subject_id, start_time, end_time]
        csv_history_row = [subject_id, start_time, end_time]
        csv_original_data_row = [subject_id, start_time, end_time]
        history_header_index = num_common_columns
        original_header_index = num_common_columns
        for emotion in subject:
            if emotion[0].islower():  # not an emotion
                continue
            json_full_data = subject[emotion]["full_data"]
            json_history = subject[emotion]["history"]
            json_original_data = subject[emotion]["original_data"]

            # full_data
            csv_full_data_row.append(subject[emotion]["index"])
            for point in json_full_data:
                csv_full_data_row.append(point[0])
                csv_full_data_row.append(point[1])

            # history
            for event in json_history:
                csv_history_row.append(event["event"])
                csv_history_row.append(event["time"])
                if "point" in event:
                    csv_history_row.append(event["point"][0])   # point x
                    csv_history_row.append(event["point"][1])   # point y
                    csv_history_row.append(event["point"][2])   # point label
                else:
                    for i in range(0, 3):
                        csv_history_row.append("")
                history_header_index += 5
            while history_header_index < len(history_header) and emotion in history_header[history_header_index]:
                csv_history_row.append("")
                history_header_index += 1

            # original_data
            for point in json_original_data:
                csv_original_data_row.append(point[0])
                csv_original_data_row.append(point[1])
                original_header_index += 2
            while original_header_index < len(data_header) and emotion in data_header[original_header_index]:
                csv_original_data_row.append("")
                original_header_index += 1

        full_data_file.writerow(csv_full_data_row)
        history_file.writerow(csv_history_row)
        original_data_file.writerow(csv_original_data_row)


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
        parse(json.load(jsonFile, object_pairs_hook=OrderedDict), full_data_file, history_file, original_data_file)

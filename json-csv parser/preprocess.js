function preprocess(json, dataType) {
    var newJson = [];
    for (var firebaseUid in json) {
        if (!json.hasOwnProperty(firebaseUid)) {
            continue;
        }
        var uid = json[firebaseUid].id;
        var startTime = json[firebaseUid].start_time
        newJson.push({"subject ID": uid, "start time": startTime, "data": {}});

        var subject = json[firebaseUid];
        for (var firebaseEmotionId in subject) {
            if (!subject.hasOwnProperty(firebaseEmotionId) || firebaseEmotionId === 'id' || firebaseEmotionId === 'start_time') {
                continue;
            }
            var emotion = subject[firebaseEmotionId].emotion;
            // parse full_data, history & original_data from arrays to an objects
            //  full_data
            var fullData = subject[firebaseEmotionId].full_data;  // is an array
            var newFullData = {};
            for (var pt = 1; pt <= fullData.length; ++pt) {
                newFullData['point_' + pt + '_label'] = fullData[pt - 1][2];
                newFullData['point_' + pt + '_x'] = fullData[pt - 1][0];
                newFullData['point_' + pt + '_y'] = fullData[pt - 1][1];
            }
            newJson[newJson.length - 1]["data"][emotion + '/full_data'] = newFullData;

            //  history
            var history = subject[firebaseEmotionId].history;
            var newHistory = {};
            for (var t = 1; t <= history.length; ++t) {
                newHistory['event_' + t + '_name'] = history[t - 1].event;
                newHistory['event_' + t + '_time(ms)'] = history[t - 1].time;
                var point = history[t - 1].point;
                if (point) {
                    newHistory['event_' + t + '_point_x'] = point[0];
                    newHistory['event_' + t + '_point_y'] = point[1];
                    newHistory['event_' + t + '_point_label'] = point[2];
                } else {
                    newHistory['event_' + t + '_x'] = '';
                    newHistory['event_' + t + '_y'] = '';
                }
            }
            newJson[newJson.length - 1]["data"][emotion + '/history'] = newHistory;

            //  original_data
            var originalData = subject[firebaseEmotionId].original_data;
            var newOriginalData = {};
            for (var pt = 1; pt <= originalData.length; ++pt) {
                newOriginalData['point_' + pt + '_label'] = originalData[pt - 1][2];
                newOriginalData['point_' + pt + '_x'] = originalData[pt - 1][0];
                newOriginalData['point_' + pt + '_y'] = originalData[pt - 1][1];
            }
            newJson[newJson.length - 1]["data"][emotion + '/original_data'] = newOriginalData;
        }
    }
    return newJson;
}

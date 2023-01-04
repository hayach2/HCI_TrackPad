$(document).ready(function () {
    /* convert a Json into a csv file */
    var JSONToCSV = function (data, reportTitle) {
        var CSV = '';
        CSV += reportTitle + '\r\n\n'

        var row = '';
        for (var index in data[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);
        CSV += row + '\r\n';

        for (var i = 0; i < data.length - 1; i++) {
            var row = '';
            for (var index in data[i]) {
                row += data[i][index] + ',';
            }
            row = row.slice(0, -1);
            CSV += row + '\r\n';
        }
        return CSV;
    }

    function ConvertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        var beginning = true;

        for (var i = 0; i < array.length; i++) {
            var line = '';
            // if (beginning) {
            //     beginning = false;
            //     if (line != '') line += ','
            //
            //     line += array[i];
            //     array[i]
            // }

            if (beginning) {
                for (var index in array[i]) {
                    if (line != '') line += ','

                    line += index;
                }
                str += line + '\r\n';
                line = '';
            }

            beginning = false;

            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }
            beginning = false;

            str += line + '\r\n';
        }

        return str;
    }

    $("#download").click(function (e) {
        if ($("#name_field").val() === "") {
            $("#messages").html("<span class='sys' style='color: red'>Please put in Your Name</span>");
        } else {
            let test_type = localStorage.getItem('test_type');
            console.log(localStorage.getItem('expData'));
            var CSV = ConvertToCSV(localStorage.getItem('expData'));
            console.log('hon' + CSV);
            // var CSV = localStorage.getItem('expData');

            var fileName = $("#name_field").val() + '_' + test_type;
            fileName = fileName.split(' ').join('_');

            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
            var link = document.createElement('a');
            link.href = uri;
            link.style = 'visibility: hidden';
            link.download = fileName + '.csv';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

});
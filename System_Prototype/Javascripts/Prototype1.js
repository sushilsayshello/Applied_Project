<script>
    $(document).ready(function() {
        // Hide all sections except the landing page
        $('#landingPage').show();

        var isLoggedIn = false;

        // Global variables to store dashboard data
        var totalDetections = 0;
        var potentialAttacks = 0;
        var normalTraffic = 0;
        var recentDetections = [];

        // Function to update the dashboard
        function updateDashboard() {
            $('#totalDetections').text(totalDetections);
            $('#potentialAttacks').text(potentialAttacks);
            $('#normalTraffic').text(normalTraffic);

            var recentList = '<ul class="list-group">';
            recentDetections.slice(-5).forEach(function(item) {
                recentList += '<li class="list-group-item">' + item + '</li>';
            });
            recentList += '</ul>';
            $('#recentDetections').html(recentList);
        }

        // Function to update the navigation bar based on login status
        function updateNavBar() {
            var navLinks = $('#navLinks');
            navLinks.empty();

            if (isLoggedIn) {
                navLinks.append('<li class="nav-item"><a class="nav-link text-white" href="#" id="navDashboard">Dashboard</a></li>');
                navLinks.append('<li class="nav-item"><a class="nav-link text-white" href="#" id="navProfile">Profile</a></li>');
                navLinks.append('<li class="nav-item"><a class="nav-link text-white" href="#" id="navHome">Home</a></li>');
                navLinks.append('<li class="nav-item"><a class="nav-link text-white" href="#" id="navManualEntry">Manual Entry</a></li>');
                navLinks.append('<li class="nav-item"><a class="nav-link text-white" href="#" id="navUploadData">Upload Data</a></li>');
                navLinks.append('<li class="nav-item"><a class="nav-link text-white" href="#" id="navLogout">Logout</a></li>');
            } else {
                navLinks.append('<li class="nav-item"><a class="nav-link text-white" href="#" id="navHome">Home</a></li>');
                navLinks.append('<li class="nav-item"><a class="nav-link text-white" href="#" id="navLogin">Login</a></li>');
            }
        }

        updateNavBar();

        // Function to show a specific page/section
        function showPage(pageId) {
            $('#mainContent > div').hide();
            $('#' + pageId).show();
            window.scrollTo(0, 0);

            if (pageId === 'optionsPage') {
                var userName = localStorage.getItem('userName') || 'User';
                $('#optionsPage h2').text('Welcome, ' + userName + '!');
            }
        }

        // "Let's Get Started" button
        $('#getStartedButton').click(function() {
            showPage('loginPage');
        });

        // Dark Mode Toggle
        $('#darkModeToggle').click(function() {
            $('body').toggleClass('dark-mode');
            var icon = $(this).find('i');
            if ($('body').hasClass('dark-mode')) {
                icon.removeClass('fa-moon').addClass('fa-sun');
            } else {
                icon.removeClass('fa-sun').addClass('fa-moon');
            }
        });

        // Handle login form submission
        $('#loginForm').on('submit', function(event) {
            event.preventDefault();
            var loginEmail = $('#loginEmail').val();
            var userName = loginEmail.substring(0, loginEmail.indexOf('@')) || 'User';
            localStorage.setItem('userName', userName);
            isLoggedIn = true;
            updateNavBar();
            showPage('optionsPage');
        });

        // Navigation link handlers
        $(document).on('click', '#navDashboard', function() {
            showPage('dashboardPage');
            updateDashboard(); // Ensure the dashboard is updated when navigating to it
        });

        $(document).on('click', '#navProfile', function() {
            showPage('profilePage');
        });

        $(document).on('click', '#navHome', function() {
            showPage('optionsPage');
        });

        $(document).on('click', '#navManualEntry', function() {
            showPage('manualEntryPage');
        });

        $(document).on('click', '#navUploadData', function() {
            showPage('uploadDataPage');
        });

        $(document).on('click', '#navLogout', function() {
            isLoggedIn = false;
            localStorage.removeItem('userName');
            updateNavBar();
            showPage('landingPage');
        });

        // Option cards click handlers
        $('#enterManuallyOption').click(function() {
            showPage('manualEntryPage');
        });

        $('#uploadDataOption').click(function() {
            showPage('uploadDataPage');
        });

        // Handle drag and drop for file upload
        var dropArea = $('#dropArea');
        var fileInput = $('#datasetFile');

        dropArea.on('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropArea.addClass('dragover');
        });

        dropArea.on('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropArea.removeClass('dragover');
        });

        dropArea.on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropArea.removeClass('dragover');
            var files = e.originalEvent.dataTransfer.files;
            fileInput[0].files = files;
        });

        dropArea.on('click', function() {
            fileInput.click();
        });

        // Handle dataset upload and analysis
        $('#analyzeButton').click(function() {
            var file = fileInput[0].files[0];
            if (file) {
                $('#uploadProgress').show();
                var progressBar = $('#progressBar');

                var fileName = file.name;
                var fileExtension = fileName.substr(fileName.lastIndexOf('.')).toLowerCase();

                if (fileExtension === '.csv') {
                    progressBar.css('width', '50%');
                    Papa.parse(file, {
                        header: true,
                        dynamicTyping: true,
                        complete: function(results) {
                            displayDataset(results.data);
                            analyzeDataset(results.data);
                            progressBar.css('width', '100%');
                            setTimeout(() => $('#uploadProgress').fadeOut(), 1000);
                        },
                        error: function(error) {
                            alert('Error parsing CSV file: ' + error.message);
                            $('#uploadProgress').fadeOut();
                        }
                    });
                } else if (fileExtension === '.xls' || fileExtension === '.xlsx') {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var data = e.target.result;
                        var workbook = XLSX.read(data, {type: 'binary'});
                        var firstSheetName = workbook.SheetNames[0];
                        var worksheet = workbook.Sheets[firstSheetName];
                        var jsonData = XLSX.utils.sheet_to_json(worksheet, {header:1});
                        var dataWithHeaders = [];
                        var headers = jsonData[0];
                        for (var i = 1; i < jsonData.length; i++) {
                            var row = {};
                            for (var j = 0; j < headers.length; j++) {
                                row[headers[j]] = jsonData[i][j];
                            }
                            dataWithHeaders.push(row);
                        }
                        displayDataset(dataWithHeaders);
                        analyzeDataset(dataWithHeaders);
                        progressBar.css('width', '100%');
                        setTimeout(() => $('#uploadProgress').fadeOut(), 1000);
                    };
                    reader.onerror = function(ex) {
                        alert('Error parsing XLS file: ' + ex.message);
                        $('#uploadProgress').fadeOut();
                    };
                    reader.readAsBinaryString(file);
                } else {
                    alert('Unsupported file format. Please upload a CSV or XLS/XLSX file.');
                }
            } else {
                alert('Please select a file.');
            }
        });

        // Handle manual entry form submission
        $('#manualEntryForm').on('submit', function(event) {
            event.preventDefault();
            var formData = {
                pktcount: parseInt($('#pktcount').val()),
                bytecount: parseInt($('#bytecount').val()),
                dur: parseInt($('#dur').val()),
                flows: parseInt($('#flows').val()),
                packetins: parseInt($('#packetins').val()),
                pktperflow: parseInt($('#pktperflow').val()),
                byteperflow: parseInt($('#byteperflow').val()),
                pktrate: parseInt($('#pktrate').val()),
                pairflow: parseInt($('#pairflow').val())
            };

            var isAttack = false;

            if (formData.pktcount > 100000 || formData.bytecount > 100000000 ||
                formData.pktrate > 1000 || formData.flows > 100 ||
                formData.pktperflow > 20000 || formData.byteperflow > 50000000 ||
                formData.packetins > 5000 || formData.pairflow > 10) {
                isAttack = true;
            }

            var resultDiv = $('#manualEntryResult');
            resultDiv.removeClass('alert-success alert-danger');

            if (isAttack) {
                resultDiv.addClass('alert alert-danger');
                resultDiv.html('<strong>Warning!</strong> Potential DDoS attack detected.');
                potentialAttacks++;
                recentDetections.push('Potential DDoS detected at ' + new Date().toLocaleTimeString());
            } else {
                resultDiv.addClass('alert alert-success');
                resultDiv.html('No DDoS attack detected. Network traffic appears normal.');
                normalTraffic++;
                recentDetections.push('Normal traffic at ' + new Date().toLocaleTimeString());
            }
            totalDetections++;
            updateDashboard(); // Update the dashboard after manual entry
        });

        // Function to display dataset in a table
        function displayDataset(data) {
            var datasetSection = $('#datasetSection');
            var datasetPreview = $('#datasetPreview');

            var table = '<table class="table table-bordered table-striped"><thead><tr>';
            var headers = Object.keys(data[0]);
            for (var i = 0; i < headers.length; i++) {
                table += '<th>' + headers[i] + '</th>';
            }
            table += '</tr></thead><tbody>';
            var previewData = data.slice(0, 10);
            for (var i = 0; i < previewData.length; i++) {
                table += '<tr>';
                for (var j = 0; j < headers.length; j++) {
                    var cellData = previewData[i][headers[j]] !== undefined ? previewData[i][headers[j]] : '';
                    table += '<td>' + cellData + '</td>';
                }
                table += '</tr>';
            }
            table += '</tbody></table>';

            datasetPreview.html(table);
            datasetSection.show();
        }

        // Function to display the analysis summary
        function displayAnalysisSummary(totalSamples, attackCount, normalCount) {
            var analysisSummaryContent = $('#analysisSummaryContent');
            var summaryHtml = '<p><strong>Total Samples:</strong> ' + totalSamples + '</p>';
            summaryHtml += '<p><strong>Potential Attacks:</strong> ' + attackCount + '</p>';
            summaryHtml += '<p><strong>Normal Traffic:</strong> ' + normalCount + '</p>';

            analysisSummaryContent.html(summaryHtml);
            $('#analysisSummary').show();

            // Create the pie chart
            var ctx = document.getElementById('analysisPieChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Potential Attacks', 'Normal Traffic'],
                    datasets: [{
                        data: [attackCount, normalCount],
                        backgroundColor: ['#dc3545', '#28a745'],
                        hoverBackgroundColor: ['#c82333', '#218838']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            enabled: true
                        }
                    }
                }
            });
        }

        // Function to analyze the dataset
        function analyzeDataset(data) {
            var totalSamples = data.length;
            var attackCount = 0;
            var normalCount = 0;

            for (var i = 0; i < data.length; i++) {
                var row = data[i];
                var pktcount = parseInt(row['pktcount']);
                var bytecount = parseInt(row['bytecount']);
                var pktrate = parseInt(row['pktrate']);
                var flows = parseInt(row['flows']);
                var pktperflow = parseInt(row['pktperflow']);
                var byteperflow = parseInt(row['byteperflow']);
                var packetins = parseInt(row['packetins']);
                var pairflow = parseInt(row['pairflow']);

                var isAttack = false;
                if (pktcount > 100000 || bytecount > 100000000 ||
                    pktrate > 1000 || flows > 100 ||
                    pktperflow > 20000 || byteperflow > 50000000 ||
                    packetins > 5000 || pairflow > 10) {
                    isAttack = true;
                }

                if (isAttack) {
                    attackCount++;
                } else {
                    normalCount++;
                }
            }

            // Update global counters and dashboard
            totalDetections += totalSamples;
            potentialAttacks += attackCount;
            normalTraffic += normalCount;
            recentDetections.push(totalSamples + ' samples analyzed at ' + new Date().toLocaleTimeString());

            updateDashboard();
            displayAnalysisSummary(totalSamples, attackCount, normalCount);
        }

        // Export Dataset as CSV
        $('#exportCSVButton').click(function() {
            var data = Papa.unparse({
                fields: ['pktcount', 'bytecount', 'dur', 'flows', 'packetins', 'pktperflow', 'byteperflow', 'pktrate', 'pairflow', 'protocol'],
                data: recentDetections.map(function(detection) {
                    return [
                        detection.pktcount,
                        detection.bytecount,
                        detection.dur,
                        detection.flows,
                        detection.packetins,
                        detection.pktperflow,
                        detection.byteperflow,
                        detection.pktrate,
                        detection.pairflow,
                        detection.protocol
                    ];
                })
            });

            var blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });

            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'ddos_detection_data.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        // Show Signup and Forgot Password pages
        $('#showSignup').click(function() {
            showPage('signupPage');
        });

        $('#showForgotPassword').click(function() {
            showPage('forgotPasswordPage');
        });

        $('#backToLogin').click(function() {
            showPage('loginPage');
        });

        $('#backToLoginFromForgot').click(function() {
            showPage('loginPage');
        });
    });
</script>

// Manually specify the order of the lines
const lineOrder = [11, 12, 13, 15, 16, 21, 22, 23, 24, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 71, 72, 73, 90, 101, 102, 103, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 135, 140, 141, 142, 145, 155, 201, 202, 203, 204, 211, 212, 213, 221, 248, 249, 401, 414, 440, 701, 702, 737, 747, 777, 901, 903, 999];

console.log('Line order:', lineOrder);

fetch('/Lines')
    .then(response => response.json())
    .then(files => {

        const validFiles = files.filter(fileName => fileName !== 'LineSchema.json');
        // Fetch and render each line
        Promise.all(validFiles.map(fileName => fetchLine(fileName)))
            .then(lines => {
                // Filter out lines not listed in lineOrder
                const filteredLines = lines.filter(line => lineOrder.includes(line.lineNumber));

                // Sort the filtered lines based on the lineOrder array
                const sortedLines = filteredLines.sort((a, b) => {
                    const orderA = lineOrder.indexOf(a.lineNumber);
                    const orderB = lineOrder.indexOf(b.lineNumber);
                    return orderA - orderB;
                });

                // Render the sorted lines
                sortedLines.forEach(line => renderLine(line));
            })
            .catch(error => console.error('Error fetching or rendering lines:', error));
    })
    .catch(error => console.error('Error fetching files:', error));

function fetchLine(fileName) {
    return fetch(`/Lines/${fileName}`)
        .then(response => response.json())
        .catch(error => {
            console.error(`Error fetching line ${fileName}:`, error);
            return null;
        });
}

function renderLine(line) {
    if (!line) {
        console.error('The following line doesn\'t exist: ', line);
        return;
    }

    const container = document.getElementById('bus-line-container');
    const busLine = document.createElement('div');
    busLine.classList.add('bus-line');
    
    if (line.frequent) {
        busLine.classList.add('frequent-line');
    } else if (typeof line.express !== "undefined" && line.express) {
        busLine.classList.add("express-line")
    } else if (typeof line["ooi-express"] !== "undefined" && line["ooi-express"]) {
        busLine.classList.add("ooi-express-line")
    }

    const header = document.createElement('div');
    header.classList.add('bus-line-header');
    header.textContent = `${line.lineNumber} | ${line.lineName} | From: ${line.from}, To: ${line.to}`;
    busLine.appendChild(header);

    for (const key in line.stops) {
        if (line.stops.hasOwnProperty(key)) {
            const stopDiv = document.createElement('div');
            stopDiv.classList.add('bus-stop');
            const stopNumber = parseInt(key);
            stopDiv.innerHTML = `<span>Stop ${stopNumber}:</span> ${line.stops[key]}`;
            busLine.appendChild(stopDiv);
        }
    }

    container.appendChild(busLine);
}

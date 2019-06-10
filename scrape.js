const request = require('request');
const cheerio = require('cheerio');

url = 'http://schema.oru.se/setup/jsp/Schema.jsp?startDatum=2019-01-21&intervallTyp=d&intervallAntal=1&sokMedAND=false&sprak=SV&resurser=l.T101%2Cl.T103%2Cl.T129%2Cl.T131%2Cl.T133%2Cl.T135%2Cl.T141%2Cl.T205%2Cl.T207%2Cl.T209%2Cl.T211%2Cl.T213%2Cl.T215%2Cl.T219%2Cl.P101%2Cl.P103%2Cl.P104%2Cl.P105%2Cl.P107%2Cl.P114%2Cl.P138%2Cl.P200%2Cl.P201%2Cl.P203%2Cl.P204%2Cl.P206%2Cl.P2101%2Cl.P215%2Cl.P216%2Cl.P217%2Cl.P218%2Cl.P219%2Cl.P220%2Cl.P221%2Cl.P226-Medicin%2Cl.P229%2Cl.P236%2Cl.P243%2Cl.P245%2Cl.P247%2Cl.P254%2Cl.P257%2Cl.P258%2Cl.P259%2Cl.P260%2Cl.P261%2Cl.P262%2Cl.P267%2Cl.P276%2Cl.L103%2Cl.L109%2Cl.L111%2Cl.L112%2Cl.L142%2Cl.L144%2Cl.L146%2Cl.L156%2Cl.L159%2Cl.F103%2Cl.F105%2Cl.F139%2Cl.F147%2C';

let houses = {
    teknikhuset : {
        'name' : 'Teknikhuset',
        'rooms' : [
            'T101', 'T129', 'T131', 'T133', 'T135', 'T141', 'T207', 'T209',
            'T211', 'T213', 'T215'
        ],
        'booked' : [],
        'free' : []
    },
    langhuset : {
        'name' : 'Långhuset',
        'rooms' : [
            'L109', 'L111', 'L112', 'L142', 'L144', 'L146', 'L156', 'L159',
            'L103'
        ],
        'booked' : [],
        'free' : []
    },
    prismahuset : {
        'name' : 'Prismahuset',
        'rooms' : [
            'P103', 'P104', 'P104', 'P114', 'P200', 'P201', 'P203', 'P206',
            'P215', 'P216', 'P217', 'P218', 'P219', 'P220', 'P221', 'P229',
            'P236', 'P243', 'P254', 'P257', 'P258', 'P259', 'P260', 'P261',
            'P262', 'P267', 'P276'
        ],
        'booked' : [],
        'free' : []
    },
    forumhuset : {
        'name' : 'Forumhuset',
        'rooms' : [
            'F103', 'F105', 'F139', 'F147'
        ],
        'booked' : [],
        'free' : []
    }
};

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

request(url, (error, response, body) => {
    if (error || response.statusCode != 200) {
        reject('Error: (' + response.statusCode + ')');
    }

    // Scrape rooms
    const $ = cheerio.load(body);

    let rooms = $('.schemaTabell tbody tr td:nth-child(9) a');
    for (let i = 0; i < rooms.length; i++) {
        let room = $(rooms.get(i)).text();

        console.log(room);

        if (room[0] === 'L') {
            houses.langhuset.booked.push(room);
        }
        if (room[0] === 'T') {
            houses.teknikhuset.booked.push(room);

        }
        if (room[0] === 'F') {
            houses.forumhuset.booked.push(room);
        }
        if (room[0] === 'P') {
            houses.prismahuset.booked.push(room);
        }
    }

    // Find free rooms
    Object.keys(houses).forEach(function(house) {
        let rooms = houses[house].rooms;
        let booked = houses[house].booked;

        houses[house].free = rooms.diff(booked);
    });
});

module.exports = houses;

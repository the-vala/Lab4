const credentials = require('./credentials.js')
const request = require('request')

const geocode = function(city, callback) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + city + '.json?access_token=' + credentials.MAPBOX_TOKEN

    request({ url, json: true }, function(error, response) {
        if (error) {
            console.log(error.Error)
        } else {
            const data = response.body

            if ( data.Response == 'False' ) {
                console.log('Error: ' + data.Error)
            } else {
                const info = {
                    coordinates: data.features[0].center,
                    city: city
                }

                callback (info)
            }
        }
    })
}

const darksky = function(info, callback) {
    const url = 'https://api.darksky.net/forecast/' + credentials.DARK_SKY_SECRET_KEY + 
        '/' + info.coordinates[1] + ',' + info.coordinates[0] + '?units=si'

    request({ url, json: true }, function(error, response) {
        if (error) {
            console.log(error.Error)
        } else {
            const data = response.body

            if ( data.Response == 'False' ) {
                console.log('Error: ' + data.Error)
            } else {
                const phrase = 'The weather in ' + info.city + ':\n' +
                    '\tIt currently is ' + data.currently.summary + ' with a temperature of ' + data.currently.temperature + '°C. ' +
                    'Precipitation probability is of ' + data.currently.precipProbability + '%.\n' +
                    '\tFor the rest of the day, ' + data.hourly.summary + '\n' +
                    '\tAnd for the rest of the week, ' + data.daily.summary + '\n'

                callback (phrase)
            }
        }
    })
}
  
geocode('Monterrey', function(data) {
    darksky(data, function(finalPhrase) {
        console.log(finalPhrase)
    })
})
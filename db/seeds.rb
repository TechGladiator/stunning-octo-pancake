# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
states = State.create([{ name: 'Alaska', short_name: 'AK' }, { name: 'Alabama', short_name: 'AL' }, { name: 'Arkansas', short_name: 'AR' }, { name: 'American Samoa', short_name: 'AS' }, { name: 'Arizona', short_name: 'AZ' }, { name: 'California', short_name: 'CA' }, { name: 'Colorado', short_name: 'CO' }, { name: 'Connecticut', short_name: 'CT' }, { name: 'District of Columbia', short_name: 'DC' }, { name: 'Delaware', short_name: 'DE' }, { name: 'Florida', short_name: 'FL' }, { name: 'Federated States of Micronesia', short_name: 'FM' }, { name: 'Georgia', short_name: 'GA' }, { name: 'Guam', short_name: 'GU' }, { name: 'Hawaii', short_name: 'HI' }, { name: 'Iowa', short_name: 'IA' }, { name: 'Idaho', short_name: 'ID' }, { name: 'Illinois', short_name: 'IL' }, { name: 'Indiana', short_name: 'IN' }, { name: 'Kansas', short_name: 'KS' }, { name: 'Kentucky', short_name: 'KY' }, { name: 'Louisiana', short_name: 'LA' }, { name: 'Massachusetts', short_name: 'MA' }, { name: 'Maryland', short_name: 'MD' }, { name: 'Maine', short_name: 'ME' }, { name: 'Marshall Islands', short_name: 'MH' }, { name: 'Michigan', short_name: 'MI' }, { name: 'Minnesota', short_name: 'MN' }, { name: 'Missouri', short_name: 'MO' }, { name: 'Northern Mariana Islands', short_name: 'MP' }, { name: 'Mississippi', short_name: 'MS' }, { name: 'Montana', short_name: 'MT' }, { name: 'North Carolina', short_name: 'NC' }, { name: 'North Dakota', short_name: 'ND' }, { name: 'Nebraska', short_name: 'NE' }, { name: 'New Hampshire', short_name: 'NH' }, { name: 'New Jersey', short_name: 'NJ' }, { name: 'New Mexico', short_name: 'NM' }, { name: 'New York', short_name: 'NY' }, { name: 'Nevada', short_name: 'NV' }, { name: 'Ohio', short_name: 'OH' }, { name: 'Oklahoma', short_name: 'OK' }, { name: 'Oregon', short_name: 'OR' }, { name: 'Pennsylvania', short_name: 'PA' }, { name: 'Puerto Rico', short_name: 'PR' }, { name: 'Palau', short_name: 'PW' }, { name: 'Rhode Island', short_name: 'RI' }, { name: 'South Carolina', short_name: 'SC' }, { name: 'South Dakota', short_name: 'SD' }, { name: 'Tennessee', short_name: 'TN' }, { name: 'Texas', short_name: 'TX' }, { name: 'Utah', short_name: 'UT' }, { name: 'Virginia', short_name: 'VA' }, { name: 'Virgin Islands', short_name: 'VI' }, { name: 'Vermont', short_name: 'VT' }, { name: 'Washington', short_name: 'WA' }, { name: 'Wisconsin', short_name: 'WI' }, { name: 'West Virginia', short_name: 'WV' }, { name: 'Wyoming', short_name: 'WY' }])

import = Import.create([{ import_name: 'import01' }])

records = Record.create([{ name: 'National Zoological Park', address: '3001 Connecticut Ave NW', address_2: 'Suite 1001', city: 'Washington', state: 'DC', zip: '20008', purpose: 'Data Center', property_owner: 'Smithsonian', creation_date: '2018-04-10', lat: '38.9296156', long: '-77.04978440000002', import_id: Import.last.id }, { name: '3Com Corp', address: '350 Campus Dr', address_2: '', city: 'Marlborough', state: 'MA', zip: '01752', purpose: 'Technology', property_owner: '3Com Corp', creation_date: '2017-05-04', lat: '42.3256103', long: '-71.58414069999998', import_id: Import.last.id }, { name: 'AG Edwards Inc', address: '1 N Jefferson Ave', address_2: '', city: 'St. Louis', state: 'MO', zip: '63103', purpose: 'Financials', property_owner: 'AG Edwards Inc', creation_date: '1887-01-01', lat: '38.6312741', long: '-90.21581830000002', import_id: Import.last.id }])
export enum TimezoneEnum {
  // Universal Coordinated Time
  UTC = 'UTC',
  GMT = 'GMT',

  // North America - United States
  US_EASTERN = 'America/New_York',
  US_CENTRAL = 'America/Chicago',
  US_MOUNTAIN = 'America/Denver',
  US_PACIFIC = 'America/Los_Angeles',
  US_ALASKA = 'America/Anchorage',
  US_HAWAII = 'Pacific/Honolulu',
  US_ARIZONA = 'America/Phoenix',

  // North America - Canada
  CANADA_ATLANTIC = 'America/Halifax',
  CANADA_EASTERN = 'America/Toronto',
  CANADA_CENTRAL = 'America/Winnipeg',
  CANADA_MOUNTAIN = 'America/Edmonton',
  CANADA_PACIFIC = 'America/Vancouver',
  CANADA_NEWFOUNDLAND = 'America/St_Johns',

  // North America - Mexico
  MEXICO_CENTRAL = 'America/Mexico_City',
  MEXICO_MOUNTAIN = 'America/Chihuahua',
  MEXICO_PACIFIC = 'America/Tijuana',

  // South America
  BRAZIL_EAST = 'America/Sao_Paulo',
  BRAZIL_WEST = 'America/Manaus',
  ARGENTINA = 'America/Argentina/Buenos_Aires',
  CHILE = 'America/Santiago',
  COLOMBIA = 'America/Bogota',
  PERU = 'America/Lima',
  VENEZUELA = 'America/Caracas',
  ECUADOR = 'America/Guayaquil',
  BOLIVIA = 'America/La_Paz',
  URUGUAY = 'America/Montevideo',
  PARAGUAY = 'America/Asuncion',

  // Europe - Western
  UK = 'Europe/London',
  IRELAND = 'Europe/Dublin',
  PORTUGAL = 'Europe/Lisbon',
  SPAIN = 'Europe/Madrid',
  FRANCE = 'Europe/Paris',
  NETHERLANDS = 'Europe/Amsterdam',
  BELGIUM = 'Europe/Brussels',
  GERMANY = 'Europe/Berlin',
  SWITZERLAND = 'Europe/Zurich',
  AUSTRIA = 'Europe/Vienna',
  ITALY = 'Europe/Rome',

  // Europe - Central
  POLAND = 'Europe/Warsaw',
  CZECH_REPUBLIC = 'Europe/Prague',
  SLOVAKIA = 'Europe/Bratislava',
  HUNGARY = 'Europe/Budapest',
  CROATIA = 'Europe/Zagreb',
  SLOVENIA = 'Europe/Ljubljana',

  // Europe - Eastern
  RUSSIA_MOSCOW = 'Europe/Moscow',
  RUSSIA_YEKATERINBURG = 'Asia/Yekaterinburg',
  RUSSIA_NOVOSIBIRSK = 'Asia/Novosibirsk',
  RUSSIA_KRASNOYARSK = 'Asia/Krasnoyarsk',
  RUSSIA_IRKUTSK = 'Asia/Irkutsk',
  RUSSIA_YAKUTSK = 'Asia/Yakutsk',
  RUSSIA_VLADIVOSTOK = 'Asia/Vladivostok',
  RUSSIA_KAMCHATKA = 'Asia/Kamchatka',
  UKRAINE = 'Europe/Kiev',
  BELARUS = 'Europe/Minsk',
  ROMANIA = 'Europe/Bucharest',
  BULGARIA = 'Europe/Sofia',
  GREECE = 'Europe/Athens',
  TURKEY = 'Europe/Istanbul',

  // Nordic Countries
  NORWAY = 'Europe/Oslo',
  SWEDEN = 'Europe/Stockholm',
  DENMARK = 'Europe/Copenhagen',
  FINLAND = 'Europe/Helsinki',
  ICELAND = 'Atlantic/Reykjavik',

  // Africa
  SOUTH_AFRICA = 'Africa/Johannesburg',
  EGYPT = 'Africa/Cairo',
  MOROCCO = 'Africa/Casablanca',
  NIGERIA = 'Africa/Lagos',
  KENYA = 'Africa/Nairobi',
  ETHIOPIA = 'Africa/Addis_Ababa',
  GHANA = 'Africa/Accra',
  ALGERIA = 'Africa/Algiers',
  TUNISIA = 'Africa/Tunis',
  LIBYA = 'Africa/Tripoli',

  // Middle East
  ISRAEL = 'Asia/Jerusalem',
  LEBANON = 'Asia/Beirut',
  SYRIA = 'Asia/Damascus',
  JORDAN = 'Asia/Amman',
  IRAQ = 'Asia/Baghdad',
  IRAN = 'Asia/Tehran',
  SAUDI_ARABIA = 'Asia/Riyadh',
  UAE = 'Asia/Dubai',
  QATAR = 'Asia/Qatar',
  KUWAIT = 'Asia/Kuwait',
  BAHRAIN = 'Asia/Bahrain',
  OMAN = 'Asia/Muscat',
  YEMEN = 'Asia/Aden',

  // Asia - South
  INDIA = 'Asia/Kolkata',
  PAKISTAN = 'Asia/Karachi',
  BANGLADESH = 'Asia/Dhaka',
  SRI_LANKA = 'Asia/Colombo',
  NEPAL = 'Asia/Kathmandu',
  BHUTAN = 'Asia/Thimphu',
  MALDIVES = 'Indian/Maldives',

  // Asia - Southeast
  THAILAND = 'Asia/Bangkok',
  VIETNAM = 'Asia/Ho_Chi_Minh',
  CAMBODIA = 'Asia/Phnom_Penh',
  LAOS = 'Asia/Vientiane',
  MYANMAR = 'Asia/Yangon',
  MALAYSIA = 'Asia/Kuala_Lumpur',
  SINGAPORE = 'Asia/Singapore',
  INDONESIA_WESTERN = 'Asia/Jakarta',
  INDONESIA_CENTRAL = 'Asia/Makassar',
  INDONESIA_EASTERN = 'Asia/Jayapura',
  PHILIPPINES = 'Asia/Manila',
  BRUNEI = 'Asia/Brunei',

  // Asia - East
  CHINA = 'Asia/Shanghai',
  HONG_KONG = 'Asia/Hong_Kong',
  MACAU = 'Asia/Macau',
  TAIWAN = 'Asia/Taipei',
  JAPAN = 'Asia/Tokyo',
  SOUTH_KOREA = 'Asia/Seoul',
  NORTH_KOREA = 'Asia/Pyongyang',
  MONGOLIA = 'Asia/Ulaanbaatar',

  // Asia - Central
  KAZAKHSTAN_WEST = 'Asia/Oral',
  KAZAKHSTAN_EAST = 'Asia/Almaty',
  UZBEKISTAN = 'Asia/Tashkent',
  TURKMENISTAN = 'Asia/Ashgabat',
  TAJIKISTAN = 'Asia/Dushanbe',
  KYRGYZSTAN = 'Asia/Bishkek',
  AFGHANISTAN = 'Asia/Kabul',

  // Oceania - Australia
  AUSTRALIA_WESTERN = 'Australia/Perth',
  AUSTRALIA_CENTRAL = 'Australia/Adelaide',
  AUSTRALIA_EASTERN = 'Australia/Sydney',
  AUSTRALIA_NORTHERN = 'Australia/Darwin',
  AUSTRALIA_QUEENSLAND = 'Australia/Brisbane',
  AUSTRALIA_TASMANIA = 'Australia/Hobart',
  AUSTRALIA_LORD_HOWE = 'Australia/Lord_Howe',

  // Oceania - New Zealand
  NEW_ZEALAND = 'Pacific/Auckland',
  NEW_ZEALAND_CHATHAM = 'Pacific/Chatham',

  // Oceania - Pacific Islands
  FIJI = 'Pacific/Fiji',
  SAMOA = 'Pacific/Apia',
  TONGA = 'Pacific/Tongatapu',
  VANUATU = 'Pacific/Efate',
  NEW_CALEDONIA = 'Pacific/Noumea',
  SOLOMON_ISLANDS = 'Pacific/Guadalcanal',
  PAPUA_NEW_GUINEA = 'Pacific/Port_Moresby',
  GUAM = 'Pacific/Guam',
  PALAU = 'Pacific/Palau',
  MARSHALL_ISLANDS = 'Pacific/Majuro',
  MICRONESIA = 'Pacific/Chuuk',
  KIRIBATI_GILBERT = 'Pacific/Tarawa',
  KIRIBATI_PHOENIX = 'Pacific/Enderbury',
  KIRIBATI_LINE = 'Pacific/Kiritimati',
  COOK_ISLANDS = 'Pacific/Rarotonga',
  TAHITI = 'Pacific/Tahiti',
  MARQUESAS = 'Pacific/Marquesas',
  EASTER_ISLAND = 'Pacific/Easter',

  // Atlantic
  AZORES = 'Atlantic/Azores',
  CAPE_VERDE = 'Atlantic/Cape_Verde',
  CANARY_ISLANDS = 'Atlantic/Canary',
  BERMUDA = 'Atlantic/Bermuda',

  // Indian Ocean
  MAURITIUS = 'Indian/Mauritius',
  SEYCHELLES = 'Indian/Mahe',
  REUNION = 'Indian/Reunion',
  MADAGASCAR = 'Indian/Antananarivo',
}

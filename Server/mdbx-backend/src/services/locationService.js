const axios = require('axios');

//Using country space API

class LocationService {
  constructor() {
    this.baseURL = 'https://countriesnow.space/api/v0.1';
    this.timeout = 10000; 
  }

  /**
   * Get all countries
   */
  async getCountries() {
    try {
      const response = await axios.get(`${this.baseURL}/countries`, {
        timeout: this.timeout
      });
      
      if (response.data && response.data.data) {
        // The API returns an array of country objects with 'country' property
        const countries = response.data.data.map(item => ({
          name: item.country || item,
          code: (item.iso2 || item.country?.substring(0, 2) || '').toUpperCase()
        })).sort((a, b) => a.name.localeCompare(b.name));
        
        return countries;
      }
      
      // Fallback list if API fails
      return this.getFallbackCountries();
    } catch (error) {
      console.error('Error fetching countries:', error.message);
      // Return fallback countries instead of throwing
      return this.getFallbackCountries();
    }
  }

  /**
   * Fallback country list
   */
  getFallbackCountries() {
    return [
      { name: 'Nigeria', code: 'NG' },
      { name: 'United States', code: 'US' },
      { name: 'United Kingdom', code: 'GB' },
      { name: 'Canada', code: 'CA' },
      { name: 'Ghana', code: 'GH' },
      { name: 'South Africa', code: 'ZA' },
      { name: 'Kenya', code: 'KE' }
    ].sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get states for a country
   */
  async getStates(countryName) {
    try {
      const response = await axios.post(`${this.baseURL}/countries/states`, {
        country: countryName
      }, {
        timeout: this.timeout
      });
      
      if (response.data && response.data.data && response.data.data.states) {
        return response.data.data.states.map(state => {
          // Clean state name - remove " State" suffix if present
          let stateName = state.name;
          if (stateName.endsWith(' State')) {
            stateName = stateName.replace(/ State$/, '');
          }
          
          return {
            name: stateName,
            code: state.state_code || stateName.substring(0, 2).toUpperCase()
          };
        }).sort((a, b) => a.name.localeCompare(b.name));
      }
      
      // Return empty array if no states found
      return [];
    } catch (error) {
      console.error('Error fetching states:', error.message);
      // Return fallback for Nigeria
      if (countryName === 'Nigeria') {
        return this.getFallbackNigerianStates();
      }
      return [];
    }
  }

  /**
   * Fallback Nigerian states
   */
  getFallbackNigerianStates() {
    return [
      { name: 'Abia', code: 'AB' },
      { name: 'Adamawa', code: 'AD' },
      { name: 'Akwa Ibom', code: 'AK' },
      { name: 'Anambra', code: 'AN' },
      { name: 'Bauchi', code: 'BA' },
      { name: 'Bayelsa', code: 'BY' },
      { name: 'Benue', code: 'BE' },
      { name: 'Borno', code: 'BO' },
      { name: 'Cross River', code: 'CR' },
      { name: 'Delta', code: 'DE' },
      { name: 'Ebonyi', code: 'EB' },
      { name: 'Edo', code: 'ED' },
      { name: 'Ekiti', code: 'EK' },
      { name: 'Enugu', code: 'EN' },
      { name: 'FCT', code: 'FC' },
      { name: 'Gombe', code: 'GO' },
      { name: 'Imo', code: 'IM' },
      { name: 'Jigawa', code: 'JI' },
      { name: 'Kaduna', code: 'KD' },
      { name: 'Kano', code: 'KN' },
      { name: 'Katsina', code: 'KT' },
      { name: 'Kebbi', code: 'KE' },
      { name: 'Kogi', code: 'KO' },
      { name: 'Kwara', code: 'KW' },
      { name: 'Lagos', code: 'LA' },
      { name: 'Nasarawa', code: 'NA' },
      { name: 'Niger', code: 'NI' },
      { name: 'Ogun', code: 'OG' },
      { name: 'Ondo', code: 'ON' },
      { name: 'Osun', code: 'OS' },
      { name: 'Oyo', code: 'OY' },
      { name: 'Plateau', code: 'PL' },
      { name: 'Rivers', code: 'RI' },
      { name: 'Sokoto', code: 'SO' },
      { name: 'Taraba', code: 'TA' },
      { name: 'Yobe', code: 'YO' },
      { name: 'Zamfara', code: 'ZA' }
    ];
  }

  /**
   * Get cities for a state in a country
   */
  async getCities(countryName, stateName) {
    try {
      const response = await axios.post(`${this.baseURL}/countries/state/cities`, {
        country: countryName,
        state: stateName
      }, {
        timeout: this.timeout
      });
      
      if (response.data && response.data.data) {
        return response.data.data.map(city => ({
          name: city
        })).sort((a, b) => a.name.localeCompare(b.name));
      }
      return [];
    } catch (error) {
      console.error('Error fetching cities:', error.message);
      // Cities are optional, return empty array
      return [];
    }
  }

  /**
   * Get Nigerian LGAs (Local Government Areas)
   * Uses local fallback data as primary source for reliability
   */
  async getNigerianLGAs(stateName) {
    console.log('🔍 getNigerianLGAs called with state:', stateName);
    
    // Clean state name - remove " State" suffix if present
    let cleanStateName = stateName;
    if (cleanStateName.endsWith(' State')) {
      cleanStateName = cleanStateName.replace(/ State$/, '');
    }
    console.log('Cleaned state name:', cleanStateName);
    
    // Use fallback data as primary source for reliability
    const fallbackLGAs = this.getFallbackLGAs(cleanStateName);
    
    if (fallbackLGAs.length > 0) {
      console.log('Returning', fallbackLGAs.length, 'LGAs from local data');
      return fallbackLGAs;
    }
    
    // If no fallback data, try external API as backup
    try {
      const url = 'https://countriesnow.space/api/v0.1/countries/state/lga';
      console.log('No local data, trying external API');
      
      const response = await axios.post(url, {
        country: 'Nigeria',
        state: cleanStateName
      }, { timeout: this.timeout });
      
      console.log('API response status:', response.status);
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        const lgas = response.data.data.map(lga => ({
          name: lga
        })).sort((a, b) => a.name.localeCompare(b.name));
        console.log('Returning', lgas.length, 'LGAs from API');
        return lgas;
      }
    } catch (error) {
      console.error('Error fetching LGAs from API:', error.message);
    }
    
    console.log('No LGA data available for state:', stateName);
    return [];
  }

  /**
   * Fallback LGAs for ALL Nigerian states
   */
  getFallbackLGAs(stateName) {
    const lgaMap = {
      'Abia': ['Aba North', 'Aba South', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa North', 'Isiala Ngwa South', 'Isuikwuato', 'Obi Ngwa', 'Ohafia', 'Osisioma', 'Ugwunagbo', 'Ukwa East', 'Ukwa West', 'Umuahia North', 'Umuahia South', 'Umu Nneochi'],
      'Adamawa': ['Demsa', 'Fufure', 'Ganye', 'Gayuk', 'Gombi', 'Grie', 'Hong', 'Jada', 'Lamurde', 'Madagali', 'Maiha', 'Mayo Belwa', 'Michika', 'Mubi North', 'Mubi South', 'Numan', 'Shelleng', 'Song', 'Toungo', 'Yola North', 'Yola South'],
      'Akwa Ibom': ['Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 'Etim Ekpo', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ibiono-Ibom', 'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene', 'Ini', 'Itu', 'Mbo', 'Mkpat-Enin', 'Nsit-Atai', 'Nsit-Ibom', 'Nsit-Ubium', 'Obot Akara', 'Okobo', 'Onna', 'Oron', 'Oruk Anam', 'Udung-Uko', 'Ukanafun', 'Uruan', 'Urue-Offong/Oruko', 'Uyo'],
      'Anambra': ['Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North', 'Awka South', 'Ayamelum', 'Dunukofia', 'Ekwusigo', 'Idemili North', 'Idemili South', 'Ihiala', 'Njikoka', 'Nnewi North', 'Nnewi South', 'Ogbaru', 'Onitsha North', 'Onitsha South', 'Orumba North', 'Orumba South', 'Oyi'],
      'Bauchi': ['Alkaleri', 'Bauchi', 'Bogoro', 'Damban', 'Darazo', 'Dass', 'Gamawa', 'Ganjuwa', 'Giade', 'Itas/Gadau', 'Jama\'are', 'Katagum', 'Kirfi', 'Misau', 'Ningi', 'Shira', 'Tafawa Balewa', 'Toro', 'Warji', 'Zaki'],
      'Bayelsa': ['Brass', 'Ekeremor', 'Kolokuma/Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 'Yenagoa'],
      'Benue': ['Ado', 'Agatu', 'Apa', 'Buruku', 'Gboko', 'Guma', 'Gwer East', 'Gwer West', 'Katsina-Ala', 'Konshisha', 'Kwande', 'Logo', 'Makurdi', 'Obi', 'Ogbadibo', 'Ohimini', 'Oju', 'Okpokwu', 'Oturkpo', 'Tarka', 'Ukum', 'Ushongo', 'Vandeikya'],
      'Borno': ['Abadam', 'Askira/Uba', 'Bama', 'Bayo', 'Biu', 'Chibok', 'Damboa', 'Dikwa', 'Gubio', 'Guzamala', 'Gwoza', 'Hawul', 'Jere', 'Kaga', 'Kala/Balge', 'Konduga', 'Kukawa', 'Kwaya Kusar', 'Mafa', 'Magumeri', 'Maiduguri', 'Marte', 'Mobbar', 'Monguno', 'Ngala', 'Nganzai', 'Shani'],
      'Cross River': ['Abi', 'Akamkpa', 'Akpabuyo', 'Bakassi', 'Bekwarra', 'Biase', 'Boki', 'Calabar Municipal', 'Calabar South', 'Etung', 'Ikom', 'Obanliku', 'Obubra', 'Obudu', 'Odukpani', 'Ogoja', 'Yakuur', 'Yala'],
      'Delta': ['Aniocha North', 'Aniocha South', 'Bomadi', 'Burutu', 'Ethiope East', 'Ethiope West', 'Ika North East', 'Ika South', 'Isoko North', 'Isoko South', 'Ndokwa East', 'Ndokwa West', 'Okpe', 'Oshimili North', 'Oshimili South', 'Patani', 'Sapele', 'Udu', 'Ughelli North', 'Ughelli South', 'Ukwuani', 'Uvwie', 'Warri North', 'Warri South', 'Warri South West'],
      'Ebonyi': ['Abakaliki', 'Afikpo North', 'Afikpo South', 'Ebonyi', 'Ezza North', 'Ezza South', 'Ikwo', 'Ishielu', 'Ivo', 'Izzi', 'Ohaozara', 'Ohaukwu', 'Onicha'],
      'Edo': ['Akoko-Edo', 'Egor', 'Esan Central', 'Esan North-East', 'Esan South-East', 'Esan West', 'Etsako Central', 'Etsako East', 'Etsako West', 'Igueben', 'Ikpoba Okha', 'Orhionmwon', 'Oredo', 'Ovia North-East', 'Ovia South-West', 'Owan East', 'Owan West', 'Uhunmwonde'],
      'Ekiti': ['Ado Ekiti', 'Efon', 'Ekiti East', 'Ekiti South-West', 'Ekiti West', 'Emure', 'Gbonyin', 'Ido Osi', 'Ijero', 'Ikere', 'Ikole', 'Ilejemeje', 'Irepodun/Ifelodun', 'Ise/Orun', 'Moba', 'Oye'],
      'Enugu': ['Aninri', 'Awgu', 'Enugu East', 'Enugu North', 'Enugu South', 'Ezeagu', 'Igbo Etiti', 'Igbo Eze North', 'Igbo Eze South', 'Isi Uzo', 'Nkanu East', 'Nkanu West', 'Nsukka', 'Oji River', 'Udenu', 'Udi', 'Uzo Uwani'],
      'FCT': ['AMAC', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Abaji'],
      'Abuja': ['AMAC', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Abaji'],
      'Gombe': ['Akko', 'Balanga', 'Billiri', 'Dukku', 'Funakaye', 'Gombe', 'Kaltungo', 'Kwami', 'Nafada', 'Shongom', 'Yamaltu/Deba'],
      'Imo': ['Aboh Mbaise', 'Ahiazu Mbaise', 'Ehime Mbano', 'Ezinihitte', 'Ideato North', 'Ideato South', 'Ihitte/Uboma', 'Ikeduru', 'Isiala Mbano', 'Isu', 'Mbaitoli', 'Ngor Okpala', 'Njaba', 'Nkwerre', 'Nwangele', 'Obowo', 'Oguta', 'Ohaji/Egbema', 'Okigwe', 'Orlu', 'Orsu', 'Oru East', 'Oru West', 'Owerri Municipal', 'Owerri North', 'Owerri West', 'Unuimo'],
      'Jigawa': ['Auyo', 'Babura', 'Biriniwa', 'Birnin Kudu', 'Buji', 'Dutse', 'Gagarawa', 'Garki', 'Gumel', 'Guri', 'Gwaram', 'Gwiwa', 'Hadejia', 'Jahun', 'Kafin Hausa', 'Kazaure', 'Kiri Kasama', 'Kiyawa', 'Kaugama', 'Maigatari', 'Malam Madori', 'Miga', 'Ringim', 'Roni', 'Sule Tankarkar', 'Taura', 'Yankwashi'],
      'Kaduna': ['Birnin Gwari', 'Chikun', 'Giwa', 'Igabi', 'Ikara', 'Jaba', 'Jema\'a', 'Kachia', 'Kaduna North', 'Kaduna South', 'Kagarko', 'Kajuru', 'Kaura', 'Kauru', 'Kubau', 'Kudan', 'Lere', 'Makarfi', 'Sabon Gari', 'Sanga', 'Soba', 'Zangon Kataf', 'Zaria'],
      'Kano': ['Ajingi', 'Albasu', 'Bagwai', 'Bebeji', 'Bichi', 'Bunkure', 'Dala', 'Dambatta', 'Dawakin Kudu', 'Dawakin Tofa', 'Doguwa', 'Fagge', 'Gabasawa', 'Garko', 'Garun Mallam', 'Gaya', 'Gezawa', 'Gwale', 'Gwarzo', 'Kabo', 'Kano Municipal', 'Karaye', 'Kibiya', 'Kiru', 'Kumbotso', 'Kunchi', 'Kura', 'Madobi', 'Makoda', 'Minjibir', 'Nasarawa', 'Rano', 'Rimin Gado', 'Rogo', 'Shanono', 'Sumaila', 'Takai', 'Tarauni', 'Tofa', 'Tsanyawa', 'Tudun Wada', 'Ungogo', 'Warawa', 'Wudil'],
      'Katsina': ['Bakori', 'Batagarawa', 'Batsari', 'Baure', 'Bindawa', 'Charanchi', 'Dandume', 'Danja', 'Dan Musa', 'Daura', 'Dutsi', 'Dutsin Ma', 'Faskari', 'Funtua', 'Ingawa', 'Jibia', 'Kafur', 'Kaita', 'Kankara', 'Kankia', 'Katsina', 'Kurfi', 'Kusada', 'Mai\'Adua', 'Malumfashi', 'Mani', 'Mashi', 'Matazu', 'Musawa', 'Rimi', 'Sabuwa', 'Safana', 'Sandamu', 'Zango'],
      'Kebbi': ['Aleiro', 'Arewa Dandi', 'Argungu', 'Augie', 'Bagudo', 'Birnin Kebbi', 'Bunza', 'Dandi', 'Fakai', 'Gwandu', 'Jega', 'Kalgo', 'Koko/Besse', 'Maiyama', 'Ngaski', 'Sakaba', 'Shanga', 'Suru', 'Wasagu/Danko', 'Yauri', 'Zuru'],
      'Kogi': ['Adavi', 'Ajaokuta', 'Ankpa', 'Bassa', 'Dekina', 'Ibaji', 'Idah', 'Igalamela Odolu', 'Ijumu', 'Kabba/Bunu', 'Kogi', 'Lokoja', 'Mopa Muro', 'Ofu', 'Ogori/Magongo', 'Okehi', 'Okene', 'Olamaboro', 'Omala', 'Yagba East', 'Yagba West'],
      'Kwara': ['Asa', 'Baruten', 'Edu', 'Ekiti', 'Ifelodun', 'Ilorin East', 'Ilorin South', 'Ilorin West', 'Irepodun', 'Isin', 'Kaiama', 'Moro', 'Offa', 'Oke Ero', 'Oyun', 'Pategi'],
      'Lagos': ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'],
      'Nasarawa': ['Akwanga', 'Awe', 'Doma', 'Karu', 'Keana', 'Keffi', 'Kokona', 'Lafia', 'Nasarawa', 'Nasarawa Egon', 'Obi', 'Toto', 'Wamba'],
      'Niger': ['Agaie', 'Agwara', 'Bida', 'Borgu', 'Bosso', 'Chanchaga', 'Edati', 'Gbako', 'Gurara', 'Katcha', 'Kontagora', 'Lapai', 'Lavun', 'Magama', 'Mariga', 'Mashegu', 'Mokwa', 'Moya', 'Paikoro', 'Rafi', 'Rijau', 'Shiroro', 'Suleja', 'Tafa', 'Wushishi'],
      'Ogun': ['Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Egbado North', 'Egbado South', 'Ewekoro', 'Ifo', 'Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu Ode', 'Ikenne', 'Imeko Afon', 'Ipokia', 'Obafemi Owode', 'Odeda', 'Odogbolu', 'Ogun Waterside', 'Remo North', 'Shagamu'],
      'Ondo': ['Akoko North-East', 'Akoko North-West', 'Akoko South-West', 'Akoko South-East', 'Akure North', 'Akure South', 'Ese Odo', 'Idanre', 'Ifedore', 'Ilaje', 'Ile Oluji/Okeigbo', 'Irele', 'Odigbo', 'Okitipupa', 'Ondo East', 'Ondo West', 'Ose', 'Owo'],
      'Osun': ['Atakunmosa East', 'Atakunmosa West', 'Aiyedaade', 'Aiyedire', 'Boluwaduro', 'Boripe', 'Ede North', 'Ede South', 'Ife Central', 'Ife East', 'Ife North', 'Ife South', 'Egbedore', 'Ejigbo', 'Ifedayo', 'Ifelodun', 'Ila', 'Ilesa East', 'Ilesa West', 'Irepodun', 'Irewole', 'Isokan', 'Iwo', 'Obokun', 'Odo Otin', 'Ola Oluwa', 'Olorunda', 'Oriade', 'Orolu', 'Osogbo'],
      'Oyo': ['Afijio', 'Akinyele', 'Atiba', 'Atisbo', 'Egbeda', 'Ibadan North', 'Ibadan North-East', 'Ibadan North-West', 'Ibadan South-East', 'Ibadan South-West', 'Ibarapa Central', 'Ibarapa East', 'Ibarapa North', 'Ido', 'Irepo', 'Iseyin', 'Itesiwaju', 'Iwajowa', 'Kajola', 'Lagelu', 'Ogbomosho North', 'Ogbomosho South', 'Ogo Oluwa', 'Olorunsogo', 'Oluyole', 'Ona Ara', 'Orelope', 'Ori Ire', 'Oyo East', 'Oyo West', 'Saki East', 'Saki West', 'Surulere'],
      'Plateau': ['Barkin Ladi', 'Bassa', 'Bokkos', 'Jos East', 'Jos North', 'Jos South', 'Kanam', 'Kanke', 'Langtang North', 'Langtang South', 'Mangu', 'Mikang', 'Pankshin', 'Qua\'an Pan', 'Riyom', 'Shendam', 'Wase'],
      'Rivers': ['Abua/Odual', 'Ahoada East', 'Ahoada West', 'Akuku-Toru', 'Andoni', 'Asari-Toru', 'Bonny', 'Degema', 'Eleme', 'Emohua', 'Etche', 'Gokana', 'Ikwerre', 'Khana', 'Obio/Akpor', 'Ogba/Egbema/Ndoni', 'Ogu/Bolo', 'Okrika', 'Omuma', 'Opobo/Nkoro', 'Oyigbo', 'Port Harcourt', 'Tai'],
      'Sokoto': ['Binji', 'Bodinga', 'Dange Shuni', 'Gada', 'Goronyo', 'Gudu', 'Gwadabawa', 'Illela', 'Isa', 'Kebbe', 'Kware', 'Rabah', 'Sabon Birni', 'Shagari', 'Silame', 'Sokoto North', 'Sokoto South', 'Tambuwal', 'Tangaza', 'Tureta', 'Wamako', 'Wurno', 'Yabo'],
      'Taraba': ['Ardo Kola', 'Bali', 'Donga', 'Gashaka', 'Gassol', 'Ibi', 'Jalingo', 'Karim Lamido', 'Kumi', 'Lau', 'Sardauna', 'Takum', 'Ussa', 'Wukari', 'Yorro', 'Zing'],
      'Yobe': ['Bade', 'Bursari', 'Damaturu', 'Fika', 'Fune', 'Geidam', 'Gujba', 'Gulani', 'Jakusko', 'Karasuwa', 'Machina', 'Nangere', 'Nguru', 'Potiskum', 'Tarmuwa', 'Yunusari', 'Yusufari'],
      'Zamfara': ['Anka', 'Bakura', 'Birnin Magaji/Kiyaw', 'Bukkuyum', 'Bungudu', 'Gummi', 'Gusau', 'Kaura Namoda', 'Maradun', 'Maru', 'Shinkafi', 'Talata Mafara', 'Chafe', 'Zurmi']
    };

    const lgas = lgaMap[stateName] || [];
    console.log(`📋 Fallback LGAs for ${stateName}:`, lgas.length, 'items');
    return lgas.map(lga => ({ name: lga })).sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get all Nigerian states with their LGAs
   */
  async getAllNigerianStatesWithLGAs() {
    try {
      const states = await this.getStates('Nigeria');
      const statesWithLGAs = await Promise.all(
        states.map(async (state) => {
          const lgas = await this.getNigerianLGAs(state.name);
          return {
            state: state.name,
            lgas: lgas.map(lga => lga.name)
          };
        })
      );
      return statesWithLGAs;
    } catch (error) {
      console.error('Error fetching Nigerian states with LGAs:', error.message);
      throw error;
    }
  }
}

module.exports = new LocationService();

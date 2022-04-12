
// const axios = 'axios';
// const { setData } = './components/render/render';
const cloudImg = './assets/img/icons/cloud.png';
const gaugeImg = './assets/img/icons/gauge.png';
const humidityImg = './assets/img/icons/humidity.png';
const uvIndexImg = './assets/img/icons/uv-index.png';
const visibilityImg = './assets/img/icons/visibility.png';
const windImg = './assets/img/icons/wind.png';
const cloud = './assets/img/clear.png';
const partly = './assets/img/partly.png';
const sunny = './assets/img/sunny.png';
const fog = './assets/img/fog.png';
const root = document.getElementById('root');
// const { close, input, ok } = './components/root/root';

const ok = document.querySelector('.form-submit');
const input = document.querySelector('.form-input');
const close = document.querySelector('.popup-close');

const key = 'de1e7fa27bc040b8640aee1c959fadb6';

const state = {
    data: {
        feelslike: 0,
        isDay: "no",
        observationTime: "00:00 PM",
        precip: 0,
        temperature: 0,
        weatherIcons: '',
        descriptions: '',
        city: ''
    },
    properties: {
        cloudcover: 0,
        humidity: 0,
        windSpeed: 0,
        pressure: 0,
        uvIndex: 0,
        visibility: 0
    }
};

let newstate;

const getLocation = (city = 'London') => {
    axios.get(`http://api.weatherstack.com/current?access_key=de1e7fa27bc040b8640aee1c959fadb6`, {
        params: {
            query: city
        }
    }).then((res) => {
        getData(res.data);
    }).catch(err => {
        console.log(err);
    })
};

const setData = () => {
    const information = newstate.data;
    const isDay = information.isDay == 'yes' ? 'is-day' : '';
    const container = `
    <div class="container ${isDay}">
        <div class="top">
            <div class="city">
                <div class="city-subtitle">Weather Todey in</div>
                <div class=${information.city.length > 20 ? "smull" : "city-title"} id="city">
                    <span>${information.city}</span>
                </div>
            </div>
            <div class="city-info">
                <div class="top-left">
                <img class="icon" src="${getImg(information.descriptions) ? getImg(information.descriptions) : information.weatherIcons}" alt="img" />
                <div class="description">${information.descriptions}</div>
                </div>

                <div class="top-right">
                <div class="city-info__subtitle">as of ${information.observationTime}</div>
                <div class="city-info__title">${information.temperature}°</div>
                </div>
            </div>
        </div>
    <div id="properties">${getProrertie(newstate.properties)}</div>
</div>`

    root.innerHTML = container;
};

const getData = ({ current, location }) => {
    newstate = {
        ...state,
        data: {
            ...state.data,
            feelslike: current.feelslike,
            isDay: current.is_day,
            observationTime: current.observation_time,
            precip: current.precip,
            temperature: current.temperature,
            weatherIcons: current.weather_icons,
            descriptions: current.weather_descriptions[0],
            city: location.name
        },
        properties: {
            ...state.properties,
            cloudcover: { name: 'cloudy', value: `${current.cloudcover} %`, icon: cloudImg },
            humidity: { name: 'humidity', value: `${current.humidity} %`, icon: humidityImg },
            windSpeed: { name: 'wind-speed', value: `${current.wind_speed} m/s`, icon: windImg },
            pressure: { name: 'pressure', value: current.pressure, icon: gaugeImg },
            uvIndex: { name: 'uv-index', value: `${current.uv_index} %`, icon: uvIndexImg },
            visibility: { name: 'visibility', value: `${current.visibility} %`, icon: visibilityImg }
        }
    };
    setData();

    const city = document.getElementById('city');
    city.addEventListener('click', showPopup)
};

const getImg = (description) => {
    if (description == 'Partly cloudy') {
        return partly
    } else if (description == 'Sunny') {
        return sunny
    } else if (description == 'fog') {
        return fog
    } else if (description == 'Sunny') {
        return sunny
    } else if (description == 'Cloud') {
        return cloud
    } else {
        return false
    }
};


const getProrertie = (properties) => {
    return Object.values(properties).map(({ name, value, icon }) => {
        return `<div class="property">
            <div class="property-icon">
                <img src=${icon} alt="icon"/>
            </div>
            <div class="property-info">
                <div class="property-info__value">${value}</div>
                <div class="property-info__description">${name}</div>
            </div>
        </div>`;
    }).join("")
}


const showPopup = () => {
    popup.classList.add('active');
}

const setNewCity = (e) => {
    e.preventDefault()
    if (input.value != '') {
        getLocation(input.value)
        popup.classList.remove('active');
    }
};

const hidePopup = () => {
    popup.classList.remove('active');
}

ok.addEventListener('click', setNewCity);

close.addEventListener('click', hidePopup);

getLocation()



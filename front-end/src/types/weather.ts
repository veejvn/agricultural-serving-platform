export interface IWeatherWithCityResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number; // có thể không có trong 1 số trường hợp
    grnd_level?: number; // có thể không có trong 1 số trường hợp
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number; // có thể không có trong 1 số trường hợp
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ILocationWithCityResponse {
  name: string;
  local_names: {
    [key: string]: string; // có thể có nhiều ngôn ngữ khác nhau
  };
  lat: number;
  lon: number;
  country: string;
  state?: string; // có thể không có trong một số trường hợp
}

export interface IForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level?: number; // có thể không có trong 1 số trường hợp
      grnd_level?: number; // có thể không có trong 1 số trường hợp
      humidity: number;
      temp_kf?: number; // có thể không có trong 1 số trường hợp
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust?: number; // có thể không có trong 1 số trường hợp
    };
    visibility?: number; // có thể không có trong 1 số trường hợp
    pop?: number; // có thể không có trong 1 số trường hợp
    rain?: {
      "3h": number; // lượng mưa trong 3 giờ
    };
    sys?: {
      pod: string; // "d" hoặc "n"
    };
    dt_txt: string; // định dạng thời gian "YYYY-MM-DD HH:mm:ss"
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population?: number; // có thể không có trong một số trường hợp
    timezone?: number; // có thể không có trong một số trường hợp
    sunrise?: number; // có thể không có trong một số trường hợp
    sunset?: number; // có thể không có trong một số trường hợp
  };
}
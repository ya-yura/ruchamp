from geopy.geocoders import Yandex


def get_geo(address: str):
    geolocator = Yandex(api_key='11c54f3e-ebbf-4c1e-a9b8-87f216ba8d58')
    location = geolocator.geocode(address)
    geo = []
    geo.append(location.latitude)
    geo.append(location.longitude)
    return geo

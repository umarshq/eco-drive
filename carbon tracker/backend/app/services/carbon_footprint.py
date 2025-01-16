# backend/app/services/carbon_footprint.py
import requests
from app.config import Config

def calculate_carbon_footprint(distance, mode):
    url = "https://carbonfootprint1.p.rapidapi.com/CarbonFootprintFromCarTravel"
    
    querystring = {"distance": distance, "vehicle": mode}
    
    headers = {
        'x-rapidapi-host': "carbonfootprint1.p.rapidapi.com",
        'x-rapidapi-key': Config.RAPIDAPI_KEY
    }
    
    response = requests.request("GET", url, headers=headers, params=querystring)
    
    return response.json()['carbonFootprint']

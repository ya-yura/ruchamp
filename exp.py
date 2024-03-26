{
    "user_email": string,
    "user_password": string,
    "user_role_id": int,
    "info": [
        {
            "user_name": string,
            "user_sirname": string,
            "user_fathername": string,
            "user_gender": bool,
            "user_country": string,
            "user_birthday": date(y.m.d),
        },

        {
            "spectator_phone_number": string,
        },

        {
            "athlete_weight": "float",
            "athlete_height": "int",
            "athlete_sport_type": ["lol", "trol", "bol"],
        },

        {
            "event_organizer_organization_name": "string",
            "event_organizer_organization_website": "string",
            "event_organizer_organization_contact_email": "string",
            "event_organizer_organization_contact_phone": "string"
        },

        {
            "referee_qualification_level": "int"  # выбор из списка
        }
    ]
}

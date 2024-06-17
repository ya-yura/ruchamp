import uuid
from typing import Type
import smtplib
from dotenv import load_dotenv
import os
import yagmail


from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from fastapi import (APIRouter, Body, Depends, File, HTTPException, UploadFile,
                     BackgroundTasks, Form)
from fastapi.responses import RedirectResponse
from fastapi_users import FastAPIUsers
from sqlalchemy import insert, select, update, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import InstrumentedAttribute
from sqlalchemy.orm import aliased

from auth.auth import auth_backend
from auth.mailer import send_forgot_password_email
from auth.manager import UserManager, get_user_manager
from auth.models import (Athlete, EventOrganizer, Referee, Spectator,
                         SportType, SystemAdministrator, User,
                         athlete_sport_type_association, Coach,
                         athlete_coach_association, CategoryType,
                         athlete_grade_association, AthleteSport)
from auth.schemas import (AthleteUpdate, OrganizerUpdate, RefereeUpdate,
                          SpectatorUpdate, SysAdminUpdate, UserCreate,
                          UserData, UserDB, UserRead, UserUpdate,
                          Feedback)
from connection import get_db
from event.models import (Match, Event, MatchSport, Medal, WinnerTable,
                          MatchParticipant, MatchAge, MatchCategory,
                          MatchGender, AllWeightClass, CombatType,
                          MatchWeights, Fight, FightWinner)
from teams.models import TeamMember, Team
from match.utils import round_name

load_dotenv()

EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))

router = APIRouter(prefix="/users", tags=["Users"])
fastapi_users = FastAPIUsers[User, int](get_user_manager, [auth_backend])
current_user = fastapi_users.current_user()
athlete_update = AthleteUpdate
sysadmin_update = SysAdminUpdate
organizer_update = OrganizerUpdate
spectator_update = SpectatorUpdate
referee_update = RefereeUpdate
user_db_verify = UserDB


def is_model_field(model: Type, field_name: str) -> bool:
    """
    Проверяет, существует ли атрибут с указанным именем в модели.
    """
    return isinstance(getattr(model, field_name, None), InstrumentedAttribute)


async def upload_image(
    model: Type,
    image_field: str,
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
    db: AsyncSession = Depends(get_db),
):
    role_id = current_user.role_id
    # Роли, которым разрешено загружать изображения
    allowed_roles = [1, 2, 3, 4, 5]

    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    if not is_model_field(model, image_field):
        raise HTTPException(
            status_code=400, detail="Invalid image field for the model")

    with open(f"images/{image.filename}", "wb") as f:
        f.write(image.file.read())

    image_url = f"images/{image.filename}"
    db.execute(update(model).where(model.user_id == current_user.id).values(
        {image_field: image_url}))

    await db.commit()

    return {"message": f"{image_field} uploaded successfully"}


async def update_profile(
    model: Type,
    data: Type,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    role_id = current_user.role_id
    allowed_roles = {
        1: user_manager.update_athlete_profile,
        2: user_manager.update_organizer_profile,
        3: user_manager.update_spectator_profile,
        4: user_manager.update_sysadmin_profile,
        5: user_manager.update_referee_profile
    }

    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    update_function = allowed_roles[role_id]
    await update_function(current_user, data)

    return {"message": f"{model.__name__} profile updated successfully"}


async def get_athlete_result(db, athlete_id, match_id):
    # Запрос для получения результата атлета в конкретном матче
    query = await db.execute(
        select(MatchParticipant.id)
        .where(MatchParticipant.player_id == athlete_id)
    )
    participant_id = query.scalars().first()
    query = await db.execute(
        select(Fight.id, Fight.round, Fight.player_one, Fight.player_two)
        .where(Fight.match_id == match_id)
    )
    fights = query.mappings().all()

    max_round = 0
    last_fight_result = None

    for fight in fights:
        if fight['player_one'] == participant_id or fight['player_two'] == participant_id:
            # Проверяем, кто победил в этом бою
            result_query = await db.execute(
                select(FightWinner.winner_id)
                .where(FightWinner.fight_id == fight['id'])
            )
            winner_id = result_query.scalar_one_or_none()

            if fight['round'] > max_round:
                max_round = fight['round']
                query = await db.execute(
                    select(Fight.player_one)
                    .where(Fight.round == max_round)
                )
                players = query.scalars().all()
                players_count = len(players) * 2

                if winner_id is None:
                    last_fight_result = "Unknown"
                elif winner_id == participant_id:
                    last_fight_result = "Won"
                else:
                    last_fight_result = "Lost"

    if last_fight_result == "Lost":
        return f"{round_name(players_count)}"
    elif last_fight_result == "Won":
        return f"{round_name(players_count)}"
    elif last_fight_result == "Unknown":
        return f"{round_name(players_count)}"
    else:
        return "Did not compete in this match"


'''  ATHLETE  '''


@router.post("/upload-athlete-photo")
async def upload_athlete_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(Athlete, "photo_url", image, current_user, db)


@router.put("/update-athlete-profile")
async def update_athlete_profile(
    athlete_data: athlete_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(Athlete, athlete_data, current_user,
                                user_manager)


'''  SPECTATOR  '''


@router.post("/upload-spectator-photo")
async def upload_spectator_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(Spectator, "photo_url", image, current_user, db)


@router.put("/update-spectator-profile")
async def update_spectator_profile(
    spectator_data: spectator_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(Spectator, spectator_data, current_user,
                                user_manager)


'''  SYSADMIN  '''


@router.post("/upload-sysadmin-photo")
async def upload_sysadmin_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(SystemAdministrator, "photo_url", image,
                              current_user, db)


@router.put("/update-sysadmin-profile")
async def update_sysadmin_profile(
    sysadmin_data: sysadmin_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(SystemAdministrator, sysadmin_data,
                                current_user, user_manager)


'''  ORGANIZER  '''


@router.post("/upload-organizer-photo")
async def upload_organizer_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(EventOrganizer, "logo_url", image,
                              current_user, db)


@router.put("/update-organizer-profile")
async def update_organizer_profile(
    organizer_data: organizer_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(
        EventOrganizer,
        organizer_data,
        current_user,
        user_manager
    )


'''REFEREES'''


@router.post("/upload-referee-photo")
async def upload_referee_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(Referee, "logo_url", image,
                              current_user, db)


@router.put("/update-referee-profile")
async def update_referee_profile(
    referee_data: referee_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(
        SystemAdministrator,
        referee_data,
        current_user,
        user_manager
    )


'''  USERS  '''


@router.get("/verify/{token}")
async def verify_user(token: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User.email).where(
        User.verification_token == token)
    )
    email = result.scalars().first()
    await db.execute(update(User).where(
        User.email == email).values(is_verified=True, verification_token="")
    )
    await db.commit()
    return RedirectResponse(url="http://sportplatform.ru", status_code=303)


@router.post("/forgot-password/{email}")
async def forgot_password_email(
    email: str,
    db: AsyncSession = Depends(get_db),
    user_manager: UserManager = Depends(get_user_manager),
):
    user = await db.execute(select(User.username).where(User.email == email))
    user_name = user.scalars().first()
    if user_name is None:
        raise HTTPException(status_code=404, detail="User not found")
    token = str(uuid.uuid4())
    await db.execute(update(User).where(
        User.email == email).values(verification_token=token))

    # send_forgot_password_email(username=user_name, email=email, token=token)
    # await user_manager.on_after_forgot_password(user_name, token)
    await db.commit()
    return {"token": token}


@router.post("/reset-forgot-password/{token}")
async def forgot_password(
    token: str,
    user_manager: UserManager = Depends(get_user_manager),
    db: AsyncSession = Depends(get_db)
):
    user = await db.execute(select(User.email).where(
        User.verification_token == token))

    email = user.scalars().first()
    if email is None:
        raise HTTPException(status_code=404, detail="User not found")

    return {"email": email}


@router.get("/me")
async def get_current_user(
    current_user: User = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    result = []
    query = await db.execute(
        select(
            User.id,
            User.username,
            User.email,
            User.sirname,
            User.name,
            User.fathername,
            User.birthdate,
            User.gender,
            User.role_id
            ).where(User.id == current_user.id)
        )
    user_info = query.mappings().all()
    user = user_info[0]

    if user.role_id == 1:
        query = await db.execute(
            select(
                Athlete.id,
                Athlete.user_id,
                Athlete.weight,
                Athlete.height,
                Athlete.country,
                Athlete.region,
                Athlete.city,
                Athlete.image_field
            ).where(Athlete.user_id == current_user.id)
        )
        athlete_info = query.mappings().all()
        athlete = {k: v for k, v in athlete_info[0].items()}

        query = await db.execute(
            select(Athlete.id).where(Athlete.user_id == current_user.id)
        )
        athlete_id = query.scalars().first()

        query = await db.execute(
            select(SportType.name, CategoryType.name)
            .join(AthleteSport, AthleteSport.sport_id == SportType.id)
            .join(CategoryType, CategoryType.id == AthleteSport.grade_id)
            .where(AthleteSport.athlete_id == athlete_id)
        )
        athlete_grades = query.all()

        grades = {
            sport_name: grade_name for sport_name, grade_name in athlete_grades
        }
        athlete["grades"] = grades

        query = await db.execute(
            select(SportType.name)
            .join(athlete_sport_type_association)
            .where(athlete_sport_type_association.c.athlete_id == athlete_id)
        )
        athlete_sport_type = query.scalars().all()
        athlete["sport_types"] = athlete_sport_type

        query = await db.execute(
            select(Coach.name)
            .join(athlete_coach_association)
            .where(athlete_coach_association.c.athlete_id == athlete_id)
        )
        athlete_coaches = query.scalars().all()
        athlete["coaches"] = athlete_coaches

        # Получаем достижения атлета
        query = await db.execute(
            select(
                SportType.name,
                Medal.medal_type,
                func.count(WinnerTable.id).label("count")
            )
            .join(
                MatchParticipant,
                MatchParticipant.id == WinnerTable.winner_id
            )
            .join(Match, Match.id == WinnerTable.match_id)
            .join(MatchSport, MatchSport.match_id == Match.id)
            .join(SportType, SportType.id == MatchSport.sport_id)
            .join(Medal, Medal.id == WinnerTable.medal)
            .where(MatchParticipant.player_id == athlete_id)
            .group_by(SportType.name, Medal.medal_type)
        )
        achievement_rows = query.all()
        achievements = {}
        for sport_name, medal_name, count in achievement_rows:
            if sport_name not in achievements:
                achievements[sport_name] = {
                    "gold": 0, "silver": 0, "bronze": 0
                }
            if medal_name == "Золото":
                achievements[sport_name]["gold"] += count
            elif medal_name == "Серебро":
                achievements[sport_name]["silver"] += count
            elif medal_name == "Бронза":
                achievements[sport_name]["bronze"] += count
        athlete["achievements"] = achievements
        result.append(athlete)

    elif user.role_id == 2:
        query = await db.execute(
            select(
                EventOrganizer.id,
                EventOrganizer.user_id,
                EventOrganizer.website,
                EventOrganizer.contact_email,
                EventOrganizer.contact_phone,
                EventOrganizer.organization_name,
                EventOrganizer.description,
                EventOrganizer.image_field,
            ).where(EventOrganizer.user_id == current_user.id)
        )
        event_organizer_info = query.mappings().all()
        event_organizer = event_organizer_info[0]
        result.append(event_organizer)

    elif user.role_id == 3:
        query = await db.execute(
            select(Spectator).where(Spectator.user_id == current_user.id)
        )
        spectator_info = query.mappings().all()
        spectator = spectator_info[0]
        result.append(spectator)

    elif user.role_id == 4:
        query = await db.execute(
            select(SystemAdministrator)
            .where(SystemAdministrator.user_id == current_user.id)
        )
        sysadmin_info = query.mappings().all()
        sysadmin = sysadmin_info[0]
        result.append(sysadmin)

    elif user.role_id == 5:
        query = await db.execute(
            select(Referee).where(Referee.user_id == current_user.id)
        )
        referee_info = query.mappings().all()
        referee = referee_info[0]
        result.append(referee)

    result.append(user)

    return result


@router.get("/me/matches")
async def get_current_user_matches(
    current_user: User = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    '''Информация о матчах, в которых участвовал спортсмен'''

    query = await db.execute(select(
        Athlete.id).where(Athlete.user_id == current_user.id))
    athlete_id = query.scalars().first()

    query = await db.execute(
        select(MatchParticipant.match_id)
        .where(MatchParticipant.player_id == athlete_id)
    )

    all_matches_id = query.scalars().all()

    matches = []
    for match_id in all_matches_id:
        query = await db.execute(
            select(
                Match.id.label("match_id"),
                Match.event_id.label("event_id"),
                Event.name.label("event_name"),
                Event.location.label("location"),
                EventOrganizer.organization_name.label("org_name"),
                Match.name,
                SportType.name.label("sport_name"),
                CategoryType.name.label("category_type"),
                Match.start_datetime,
                Match.end_datetime,
                (Match.nominal_time*60).label("nominal_time"),
                Match.mat_vol,
                MatchAge.age_from.label("age_min"),
                MatchAge.age_till.label("age_max"),
                AllWeightClass.name.label("weight_category"),
                AllWeightClass.min_weight.label("weight_min"),
                AllWeightClass.max_weight.label("weight_max"),
                MatchGender.gender.label("gender"),
            )
            .join(Event, Event.id == Match.event_id)
            .join(EventOrganizer, EventOrganizer.id == Event.organizer_id)
            .join(CombatType, CombatType.id == Match.combat_type_id)
            .join(MatchSport, MatchSport.match_id == Match.id)
            .join(SportType, SportType.id == MatchSport.sport_id)
            .join(MatchAge, MatchAge.match_id == Match.id)
            .join(MatchGender, MatchGender.match_id == Match.id)
            .join(MatchWeights, MatchWeights.match_id == Match.id)
            .join(AllWeightClass, AllWeightClass.id == MatchWeights.weight_id)
            .join(MatchCategory, MatchCategory.match_id == Match.id)
            .join(CategoryType, CategoryType.id == MatchCategory.category_id)
            .where(Match.id == match_id))
        match_info = query.mappings().first()

        # Получаем результат атлета для этого матча
        athlete_result = await get_athlete_result(db, athlete_id, match_id)

        match_info = dict(match_info)
        match_info["athlete_result"] = athlete_result

        matches.append(match_info)

    return matches


@router.get("/me/teams")
async def get_current_user_teams(
    current_user: User = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    '''Информация о командах, в которых состоит спортсмен'''
    query = await db.execute(
        select(Athlete.id)
        .where(Athlete.user_id == current_user.id)
    )
    athlete_id = query.scalars().first()
    query = await db.execute(
        select(TeamMember.team)
        .where(TeamMember.member == athlete_id)
    )
    teams_id = query.scalars().all()
    if teams_id is None:
        raise HTTPException(
            status_code=400, detail="You are not a member of any team"
        )

    teams_info = []

    for team_id in teams_id:
        query = await db.execute(
            select(
                Team.id.label("team_id"),
                Team.name,
                Team.description,
                Team.slug,
                Team.invite_link,
                Team.image_field,
                Team.country,
                Team.city,
                Team.region,
            )
            .where(Team.id == team_id)
        )
        team_info = query.mappings().first()
        team_info = dict(team_info)

        # Получаем информацию о капитане команды
        query = await db.execute(
            select(
                User.sirname,
                User.name,
                User.fathername,
            )
            .select_from(Team)
            .join(Athlete, Athlete.id == Team.captain)
            .join(User, User.id == Athlete.user_id)
            .where(Team.id == team_id)
        )
        captain_info = query.mappings().first()
        team_info["captain"] = captain_info
        teams_info.append(team_info)

    return teams_info


@router.get("/me/organizer")
async def get_organizer_events(
    current_user: User = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(
        EventOrganizer.id).where(EventOrganizer.user_id == current_user.id))
    organizer_id = query.scalars().first()

    if organizer_id is None:
        raise HTTPException(status_code=400, detail="You are not an organizer")

    query = await db.execute(select(
        Event.id).where(Event.organizer_id == organizer_id))
    events = query.scalars().all()

    result = []

    for event_id in events:
        query = await db.execute(
            select(
                Event.id,
                Event.name,
                Event.start_request_datetime,
                Event.end_request_datetime,
                Event.start_datetime,
                Event.end_datetime,
                EventOrganizer.organization_name.label("organizer_name"),
                Event.location,
                Event.event_system,
                Event.event_order,
                Event.image_field,
                Event.description,
                Event.geo
            )
            .join(
                EventOrganizer, EventOrganizer.id == Event.organizer_id
            )
            .where(Event.id == event_id)
        )
        event_info = query.mappings().all()
        event = event_info[0]

        query = await db.execute(
            select(Match.id)
            .where(Match.event_id == event_id)
        )
        matches_id = query.scalars().all()
        sports_in_matches_info = []

        for match_id in matches_id:
            query = await db.execute(
                select(MatchSport.sport_id)
                .where(MatchSport.match_id == match_id)
            )
            match_sport_id = query.scalars().all()

            for sport_id in match_sport_id:
                query = await db.execute(
                    select(SportType.name)
                    .where(SportType.id == sport_id)
                )
                sport_name = query.scalars().first()
                sports_in_matches_info.append(sport_name)

        unique_sports_in_matches_info = list(
                    set(sports_in_matches_info)
                )

        event_result = {k: v for k, v in event.items()}

        event_result["sports_in_matches"] = unique_sports_in_matches_info

        result.append(event_result)

    return result


'''@router.get("/me/events")
async def get_current_user_events(
    current_user: User = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(
        Athlete.id).where(Athlete.user_id == current_user.id))
    athlete_id = query.scalars().first()

    query = await db.execute(select(
        TeamMember.id).where(TeamMember.member == athlete_id))
    member_id = query.scalars().first()

    query = await db.execute(select(
        Participant.event_id).where(Participant.player_id == member_id))
    events = query.scalars().all()

    return {"events": events}'''


@router.get("/me/athlete")
async def get_current_user_athlete(
    current_user: User = Depends(current_user),
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(select(
        Athlete).where(Athlete.user_id == current_user.id))
    athlete = query.scalars().first()

    return athlete


@router.post("/me/referee")
async def get_current_user_referee(
    referee_data: referee_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(
        Referee,
        referee_data,
        current_user,
        user_manager
    )


@router.post("/create")
async def create_user(
    user_create: UserCreate,
    user_data: UserData,
    background_tasks: BackgroundTasks,
    user_manager: UserManager = Depends(get_user_manager),
    db: AsyncSession = Depends(get_db),
):
    user = await user_manager.create(
        user_create, background_tasks=background_tasks
    )
    user_role = user.role_id

    if user_role == 1:
        new_athlete = Athlete(
            user_id=user.id,
            weight=float(user_data.info['athlete_weight']),
            height=int(user_data.info['athlete_height']),
            country=int(user_data.info['athlete_country']),
            city=user_data.info['athlete_city'],
            region=int(user_data.info['athlete_region']),
        )
        query = await db.execute(select(SportType).where(
            SportType.name.in_(user_data.info['athlete_sport_type'])
        ))
        athlete_sport_type = query.scalars().all()
        new_athlete.sport_types = athlete_sport_type
        db.add(new_athlete)
        await db.commit()

    if user_role == 2:
        await db.execute(insert(EventOrganizer).values(
            user_id=user.id,
            organization_name=user_data.info[
                'event_organizer_organization_name'
            ],
            website=user_data.info[
                'event_organizer_organization_website'
            ],
            contact_email=user_data.info[
                'event_organizer_organization_contact_email'
            ],
            contact_phone=user_data.info[
                'event_organizer_organization_contact_phone'
            ],
        ))
        await db.commit()

    if user_role == 3:
        await db.execute(insert(Spectator).values(
            user_id=user.id,
            phone_number=user_data.info['spectator_phone_number'],
        ))
        await db.commit()

    if user_role == 4:
        await db.execute(insert(SystemAdministrator).values(
            user_id=user.id
        ))
        await db.commit()

    if user_role == 5:
        await db.execute(insert(Referee).values(
            user_id=user.id,
            qualification_level=int(user_data.info[
                'referee_qualification_level'
            ]),
        ))
        await db.commit()

    return user


@router.put("/update")
async def update_user(
    user_update: UserUpdate,
    user_data: UserData,
    current_user: User = Depends(current_user),
    db: AsyncSession = Depends(get_db),
    user_manager: UserManager = Depends(get_user_manager),
):
    query = await db.execute(select(User).where(User.id == current_user.id))
    user = query.scalars().one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user.username = user_update.username
    user.name = user_update.name
    user.sirname = user_update.sirname
    user.fathername = user_update.fathername

    if user.role_id == 1:
        await db.execute(update(Athlete).where(
            Athlete.user_id == current_user.id
        ).values(
            weight=float(user_data.info['athlete_weight']),
            height=int(user_data.info['athlete_height']),
        ))
    if user.role_id == 2:
        await db.execute(update(EventOrganizer).where(
            EventOrganizer.user_id == current_user.id
        ).values(
            organization_name=user_data.info[
                'event_organizer_organization_name'
            ],
            website=user_data.info[
                'event_organizer_organization_website'
            ],
            contact_email=user_data.info[
                'event_organizer_organization_contact_email'
            ],
            contact_phone=user_data.info[
                'event_organizer_organization_contact_phone'
            ],
        ))
    if user.role_id == 3:
        await db.execute(
            update(Spectator)
            .where(Spectator.user_id == current_user.id)
            .values(phone_number=user_data.info['spectator_phone_number'],)
        )
    if user.role_id == 5:
        await db.execute(
            update(Referee).
            where(Referee.user_id == current_user.id).
            values(qualification_level=int(user_data.info[
                'referee_qualification_level'
            ]),)
        )
    await db.commit()
    return {f"User ID - {current_user.id} updated"}


'''@router.post("/sport")
async def sport_asosiation(
    user_data: UserData,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(current_user),
):

    query = await db.execute(select(
        Athlete).where(Athlete.user_id == current_user.id))
    athlete = query.scalars().one_or_none()
    if athlete is None:
        raise HTTPException(status_code=404, detail="Athlete not found")

    new_athlete = Athlete(
        user_id=777,
        weight=float(user_data.info['athlete_weight']),
        height=int(user_data.info['athlete_height'])
    )
    query = await db.execute(
        select(SportType)
        .where(SportType.name.in_(user_data.info['athlete_sport_type'])))
    athlete_sport_type = query.scalars().all()
    new_athlete.sport_types = athlete_sport_type

    db.add(new_athlete)
    await db.commit()

    # await db.execute(insert(Athlete).values(
    #     user_id=777,
    #     weight=float(user_data.info['athlete_weight']),
    #     height=int(user_data.info['athlete_height']),
    #     #sport_types=str(user_data.info['athlete_sport_type']),
    # ))
    # await db.commit()
    # query = await db.execute(
        select(Athlete.id).where(Athlete.user_id == 777))
    # athlete_id = query.scalars().first()

    # query = await db.execute(
        select(SportType.id)
        .where(SportType.name.in_(user_data.info['athlete_sport_type'])))
    # athlete_sport_type = query.scalars().all()

    # for id in athlete_sport_type:
    #     await db.execute(
        insert(athlete_sport_type_association)
        .values(athlete_id==athlete_id, category_type_id == id))

    #     await db.commit()

    # # await db.execute(athlete.sport_types = [id for id in sports_types])
    # # await db.commit()
    # #print(athlete)
    # print(sports_types)

    return {"message": "Sport asosiation created"}'''


@router.post("/feedback")
async def send_feedback(
    feedback: Feedback,
):
    try:
        # Настройки SMTP сервера
        smtp_server = SMTP_SERVER
        smtp_port = SMTP_PORT
        smtp_user = EMAIL_USERNAME
        smtp_password = EMAIL_PASSWORD

        # Настройка сообщения
        msg = MIMEMultipart()
        msg['From'] = feedback.email
        msg['To'] = "support@sportplatform.ru"
        msg['Subject'] = "Feedback from " + feedback.name

        # Тело письма
        body = (
            f"Name: {feedback.name}\n"
            f"Email: {feedback.email}\n"
            f"Message: {feedback.message}"
        )
        msg.attach(MIMEText(body, 'plain'))

        # Отправка письма
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()

        try:
            server.login(smtp_user, smtp_password)
        except smtplib.SMTPAuthenticationError as auth_error:
            raise HTTPException(
                status_code=401,
                detail=f"SMTP Authentication error: {auth_error}"
            )

        try:
            server.sendmail(
                smtp_user, "support@sportplatform.ru", msg.as_string()
            )
        except smtplib.SMTPRecipientsRefused as recipient_error:
            raise HTTPException(
                status_code=400,
                detail=f"SMTP Recipients Refused: {recipient_error}"
            )
        except smtplib.SMTPSenderRefused as sender_error:
            raise HTTPException(
                status_code=400, detail=f"SMTP Sender Refused: {sender_error}"
            )
        except smtplib.SMTPDataError as data_error:
            raise HTTPException(
                status_code=400, detail=f"SMTP Data Error: {data_error}"
            )

        server.quit()
        return {"message": "Feedback sent successfully"}

    except smtplib.SMTPException as e:
        raise HTTPException(
            status_code=500, detail=f"SMTP error occurred: {e}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

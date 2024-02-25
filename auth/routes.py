import uuid
from typing import Type
from connection import get_db

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi_users import FastAPIUsers
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import InstrumentedAttribute

from auth.auth import auth_backend
from auth.models import (
    User,
    Athlete,
    EventOrganizer,
    Spectator,
    SystemAdministrator,
    CategoryType,
    SportCategory,
    AllWeightClass,
    CombatType,
    SportType,
    Referee,
    Coach
)
from auth.manager import (
    get_user_manager,
    UserManager,
)
from auth.mailer import send_forgot_password_email
from auth.schemas import (
    AthleteUpdate,
    UserDB,
    SpectatorUpdate,
    SysAdminUpdate,
    OrganizerUpdate,
    CategoryCreate,
    WeightCategoryCreate,
    RefereeCreate,
    CoachCreate,
)
from match.models import AgeCategory
from match.schemas import AgeCategoryCreate
from teams.models import TeamMember
from event.models import Participant


router = APIRouter(prefix="/api")
fastapi_users = FastAPIUsers[User, int](get_user_manager, [auth_backend])
current_user = fastapi_users.current_user()
athlete_update = AthleteUpdate
sysadmin_update = SysAdminUpdate
organizer_update = OrganizerUpdate
spectator_update = SpectatorUpdate
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
    allowed_roles = [1, 2, 3, 4, 5]  # Роли, которым разрешено загружать изображения

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
        5: user_manager.update_sysadmin_profile
    }  # надо ещё судей добавить и их обработчики

    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    update_function = allowed_roles[role_id]
    await update_function(current_user, data)

    return {"message": f"{model.__name__} profile updated successfully"}


'''  ATHLETE  '''


@router.post("/users/upload-athlete-photo", tags=["Users"])
async def upload_athlete_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(Athlete, "photo_url", image, current_user, db)


@router.put("/users/update-athlete-profile", tags=["Users"])
async def update_athlete_profile(
    athlete_data: athlete_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(Athlete, athlete_data, current_user,
                                user_manager)


@router.get("users/athlete/{user_id}", tags=["Users"])
async def get_athlete_profile(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(current_user)
):
    user_id = current_user.id
    query = await db.execute(select(Athlete.id).where(
        Athlete.user_id == user_id))

    athlete = query.scalars().first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")

    query = await db.execute(select(TeamMember.id).where(
        TeamMember.member == athlete))

    member = query.scalars().first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    query = await db.execute(select(Participant.event_id).where(
        Participant.player_id == member))

    events_id = query.scalars().all()
    if not events_id:
        raise HTTPException(status_code=404, detail="Events not found")

    return {"Пользователь": user_id, "Атлет": athlete, "Участник": events_id}


'''  SPECTATOR  '''


@router.post("/users/upload-spectator-photo", tags=["Users"])
async def upload_spectator_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(Spectator, "photo_url", image, current_user, db)


@router.put("/users/update-spectator-profile", tags=["Users"])
async def update_spectator_profile(
    spectator_data: spectator_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(Spectator, spectator_data, current_user,
                                user_manager)


'''  SYSADMIN  '''


@router.post("/users/upload-sysadmin-photo", tags=["Users"])
async def upload_sysadmin_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(SystemAdministrator, "photo_url", image,
                              current_user, db)


@router.put("/users/update-sysadmin-profile", tags=["Users"])
async def update_sysadmin_profile(
    sysadmin_data: sysadmin_update,
    current_user: User = Depends(current_user),
    user_manager: UserManager = Depends(get_user_manager),
):
    return await update_profile(SystemAdministrator, sysadmin_data,
                                current_user, user_manager)


'''  ORGANIZER  '''


@router.post("/users/upload-organizer-photo", tags=["Users"])
async def upload_organizer_photo(
    image: UploadFile = File(...),
    current_user: UserDB = Depends(current_user),
    db: AsyncSession = Depends(get_db),
):
    return await upload_image(EventOrganizer, "logo_url", image,
                              current_user, db)


@router.put("/users/update-organizer-profile", tags=["Users"])
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


'''  USERS  '''


@router.get("/users/verify/{token}", tags=["Users"])
async def verify_user(token: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User.email).where(
        User.verification_token == token)
    )
    email = result.scalars().first()
    await db.execute(update(User).where(
        User.email == email).values(is_verified=True, verification_token="")
    )
    await db.commit()
    return {"email": email}


@router.post("/users/forgot-password/{email}", tags=["Users"])
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


@router.post("/users/reset-forgot-password/{token}", tags=["Users"])
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


''' Categories '''


@router.get("/categories-grade", tags=["Categories"])
async def get_categories(db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(CategoryType))
    return query.scalars().all()


@router.get("/categories-grade/{id}", tags=["Categories"])
async def get_category(id: int, db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(CategoryType).where(CategoryType.id == id))
    return query.scalars().one_or_none()


@router.post("/categories-grade/create", tags=["Categories"])
async def create_category(
    category: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    role_id = current_user.role_id
    allowed_roles = [2, 4]  # Роли, которым разрешены изменения
    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    category_type = CategoryType(name=category.name)
    db.add(category_type)
    await db.commit()
    return {f"Category {category_type.name} created successfully"}


@router.put("/categories-grade/update/{id}", tags=["Categories"])
async def update_category(
    id: int,
    category: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    role_id = current_user.role_id
    allowed_roles = [2, 4]  # Роли, которым разрешены изменения
    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    query = await db.execute(select(CategoryType).where(CategoryType.id == id))
    category_type = query.scalars().one_or_none()
    if category_type is None:
        raise HTTPException(status_code=404, detail="Category not found")
    category_type.name = category.name
    await db.commit()
    return {f"Category {category_type.name} updated successfully"}


@router.delete("/categories-grade/delete/{id}", tags=["Categories"])
async def delete_category(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    role_id = current_user.role_id
    allowed_roles = [2, 4]  # Роли, которым разрешены изменения
    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    query = await db.execute(select(CategoryType).where(CategoryType.id == id))
    category_type = query.scalars().one_or_none()
    if category_type is None:
        raise HTTPException(status_code=404, detail="Category not found")
    await db.delete(category_type)
    await db.commit()
    return {f"Category {category_type.name} deleted successfully"}


@router.get("/categories-age", tags=["Categories"])
async def get_categories_age(db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(AgeCategory))
    return query.scalars().all()


@router.get("/categories-age/{id}", tags=["Categories"])
async def get_category_age(id: int, db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(AgeCategory).where(AgeCategory.id == id))
    return query.scalars().one_or_none()


@router.post("/categories-age/create", tags=["Categories"])
async def create_category_age(
    age_category: AgeCategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    role_id = current_user.role_id
    allowed_roles = [2, 4]  # Роли, которым разрешены изменения
    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    age_category = AgeCategory(**age_category.dict())
    db.add(age_category)
    await db.commit()
    return {f"Category {age_category.name} created successfully"}


@router.put("/categories-age/update/{id}", tags=["Categories"])
async def update_category_age(
    id: int,
    age_category_data: AgeCategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    role_id = current_user.role_id
    allowed_roles = [2, 4]  # Роли, которым разрешены изменения
    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    query = await db.execute(select(AgeCategory).where(AgeCategory.id == id))
    age_category = query.scalars().one_or_none()
    if age_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    age_category.name = age_category_data.name
    age_category.min_age = age_category_data.min_age
    age_category.max_age = age_category_data.max_age
    await db.commit()
    return {f"Category {age_category.name} updated successfully"}


@router.delete("/categories-age/delete/{id}", tags=["Categories"])
async def delete_category_age(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    role_id = current_user.role_id
    allowed_roles = [2, 4]  # Роли, которым разрешены изменения
    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    query = await db.execute(select(AgeCategory).where(AgeCategory.id == id))
    age_category = query.scalars().one_or_none()
    if age_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    await db.delete(age_category)
    await db.commit()
    return {f"Category {age_category.name} deleted successfully"}


@router.get("/categories-weight", tags=["Categories"])
async def get_categories_weight(db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(AllWeightClass))
    return query.scalars().all()


@router.get("/categories-weight/{id}", tags=["Categories"])
async def get_category_weight(id: int, db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(AllWeightClass).where(
        AllWeightClass.id == id))
    return query.scalars().one_or_none()


@router.post("/categories-weight/create", tags=["Categories"])
async def create_category_weight(
    weight: WeightCategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    role_id = current_user.role_id
    allowed_roles = [2, 4]  # Роли, которым разрешены изменения
    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    weight_category = AllWeightClass(**weight.dict())
    db.add(weight_category)
    await db.commit()
    return {f"Category {weight_category.name} created successfully"}


@router.put("/categories-weight/update/{id}", tags=["Categories"])
async def update_category_weight(
    id: int,
    weight_data: WeightCategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    role_id = current_user.role_id
    allowed_roles = [2, 4]  # Роли, которым разрешены изменения
    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    query = await db.execute(select(AllWeightClass).where(
        AllWeightClass.id == id))
    weight_category = query.scalars().one_or_none()
    if weight_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    weight_category.name = weight_data.name
    weight_category.min_weight = weight_data.min_weight
    weight_category.max_weight = weight_data.max_weight
    await db.commit()
    return {f"Category {weight_category.name} updated successfully"}


@router.delete("/categories-weight/delete/{id}", tags=["Categories"])
async def delete_category_weight(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    role_id = current_user.role_id
    allowed_roles = [2, 4]  # Роли, которым разрешены изменения
    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    query = await db.execute(select(AllWeightClass).where(
        AllWeightClass.id == id))
    weight_category = query.scalars().one_or_none()
    if weight_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    await db.delete(weight_category)
    await db.commit()
    return {f"Category {weight_category.name} deleted successfully"}


''' Referees '''


@router.get("/referees", tags=["Referees"])
async def get_referees(db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Referee))
    return query.scalars().all()


@router.get("/referees/{id}", tags=["Referees"])
async def get_referee(id: int, db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Referee).where(Referee.id == id))
    return query.scalars().one_or_none()


@router.post("/referees/create", tags=["Referees"])
async def create_referee(
    referee: RefereeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    role_id = current_user.role_id
    allowed_roles = [2, 4]  # Роли, которым разрешены изменения
    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    referee = Referee(**referee.dict())
    db.add(referee)
    await db.commit()
    return {f"Referee {referee.name} created successfully"}


@router.put("/referees/update/{id}", tags=["Referees"])
async def update_referee(
    id: int,
    referee_data: RefereeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    role_id = current_user.role_id
    allowed_roles = [2, 4]  # Роли, которым разрешены изменения
    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    query = await db.execute(select(Referee).where(Referee.id == id))
    referee = query.scalars().one_or_none()
    if referee is None:
        raise HTTPException(status_code=404, detail="Referee not found")
    referee.name = referee_data.name
    referee.qualification_level = referee_data.qualification_level
    referee.image_field = referee_data.image_field
    await db.commit()
    return {f"Referee {referee.name} updated successfully"}


@router.delete("/referees/delete/{id}", tags=["Referees"])
async def delete_referee(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    role_id = current_user.role_id
    allowed_roles = [2, 4]  # Роли, которым разрешены изменения
    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    query = await db.execute(select(Referee).where(Referee.id == id))
    referee = query.scalars().one_or_none()
    if referee is None:
        raise HTTPException(status_code=404, detail="Referee not found")
    await db.delete(referee)
    await db.commit()
    return {f"Referee {referee.name} deleted successfully"}


''' Coach '''


@router.get("/coaches", tags=["Coaches"])
async def get_coaches(db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Coach))
    return query.scalars().all()


@router.get("/coaches/{id}", tags=["Coaches"])
async def get_coach(id: int, db: AsyncSession = Depends(get_db)):
    query = await db.execute(select(Coach).where(Coach.id == id))
    return query.scalars().one_or_none()


@router.post("/coaches/create", tags=["Coaches"])
async def create_coach(
    coach: CoachCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    role_id = current_user.role_id
    allowed_roles = [2, 4]  # Роли, которым разрешены изменения
    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    coach = Coach(**coach.dict())
    db.add(coach)
    await db.commit()
    return {f"Coach {coach.name} created successfully"}


@router.put("/coaches/update/{id}", tags=["Coaches"])
async def update_coach(
    id: int,
    coach_data: CoachCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    role_id = current_user.role_id
    allowed_roles = [2, 4]  # Роли, которым разрешены изменения
    if role_id not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permission denied")

    query = await db.execute(select(Coach).where(Coach.id == id))
    coach = query.scalars().one_or_none()
    if coach is None:
        raise HTTPException(status_code=404, detail="Coach not found")
    coach.name = coach_data.name
    coach.sirname = coach_data.sirname
    coach.fathername = coach_data.fathername
    coach.gender = coach_data.gender
    coach.country = coach_data.country
    coach.birthdate = coach_data.birthdate
    coach.image_field = coach_data.image_field
    await db.commit()
    return {f"Coach {coach.name} updated successfully"}


@router.delete("/coaches/delete/{id}", tags=["Coaches"])
async def delete_coach(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserDB = Depends(current_user)
):
    query = await db.execute(select(Coach).where(Coach.id == id))
    coach = query.scalars().one_or_none()
    if coach is None:
        raise HTTPException(status_code=404, detail="Coach not found")
    await db.delete(coach)
    await db.commit()
    return {f"Coach {coach.name} deleted successfully"}

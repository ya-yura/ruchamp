from match.utils import split_pairs


'''def create_pairs(fighters):
    """
    Создает список пар бойцов, где первый боец стоит в паре с последним, второй с предпоследним и так далее.
    
    :param fighters: Список бойцов.
    :return: Список пар бойцов.
    """
    pairs = []
    left = 0
    right = len(fighters) - 1

    while left < right:
        pairs.append((fighters[left], fighters[right]))
        left += 1
        right -= 1

    return pairs

# Пример использования
n = 30  # Количество бойцов
fighters = list(range(1, n + 1))  # Список бойцов от 1 до n

pairs = create_pairs(fighters)

for pair in pairs:
    print(pair)


def distribute_fighters(pairs, rings_count):
    """
    Равномерное распределение пар бойцов по рингам.
    
    :param pairs: Список пар бойцов.
    :param rings_count: Количество рингов.
    :return: Словарь, где ключ - номер ринга, значение - список пар на этом ринге.
    """
    distribution = {ring: [] for ring in range(1, rings_count + 1)}
    ring = 1
    
    for pair in pairs:
        distribution[ring].append(pair)
        ring += 1
        if ring > rings_count:
            ring = 1
    
    return distribution


# Пример использования
pairs = split_pairs  # Создаем 30 пар бойцов (1,2), (3,4), ..., (59,60)
rings_count = 4

distribution = distribute_fighters(pairs, rings_count)

for ring, assigned_pairs in distribution.items():
    print(f"Ring {ring}: {assigned_pairs}")


def split_pairs(users):
    """
    Делает пары пользователей, добавляя пустые строки, чтобы количество участников стало степенью двойки.
    
    :param users: Список пользователей.
    :return: Список пар пользователей.
    """
    new_list = []
    group1 = []
    group2 = []

    # Определяем целевую длину как ближайшую степень двойки, большую или равную длине списка
    n = len(users)
    if n <= 1:
        target_length = 2
    else:
        target_length = 2 ** (n - 1).bit_length()
    
    # Добавляем пустые строки до достижения целевой длины
    users.extend([''] * (target_length - n))

    # Разделяем на две группы
    half = len(users) // 2
    group1 = users[:half]
    group2 = users[half:]
    group2.reverse()

    # Создаем пары
    for i in range(half):
        new_list.append([group1[i], group2[i]])

    return new_list

# Пример использования
users = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'] 
pairs = split_pairs(users)

for pair in pairs:
    print(pair)'''

users1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
pairs = split_pairs(users1)
print(pairs)

users = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',  '21',  '22',  '23',  '24',  '25',  '26',  '27',  '28',  '29',  '30', '31', '32']

def create_tournament_pairs(users):
    pairs_group_a = []
    pairs_group_b = []
    num_users = len(users)
    
    # Проверяем, что количество пользователей четное
    if num_users % 2 != 0:
        raise ValueError("Количество бойцов должно быть четным")
    
    # Формируем пары для группы A и группы B
    half = num_users // 2
    for i in range(0, half, 2):
        pairs_group_a.append((users[i], users[half + i]))
        pairs_group_b.append((users[i + 1], users[half + i + 1]))

    return pairs_group_a, pairs_group_b

# Создаем пары
pairs_group_a, pairs_group_b = create_tournament_pairs(users)

# Выводим пары для группы A
print("Пары группы A:")
for pair in pairs_group_a:
    print(f"Пара: {pair[0]} против {pair[1]}")

# Выводим пары для группы B
print("\nПары группы B:")
for pair in pairs_group_b:
    print(f"Пара: {pair[0]} против {pair[1]}")



@router.get("/{event_id}/all-participants")
async def get_all_participants(
    event_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = []
    query = await db.execute(select(Match.id).where(Match.event_id == event_id))
    matches = query.scalars().all()
    if matches is None:
        raise HTTPException(status_code=404, detail="Match not found")

    for match in matches:

        query = await db.execute(
            select(MatchParticipant.player_id)
            .where(MatchParticipant.match_id == match)
        )
        participants = query.scalars().all()

        for athelete_id in participants:
            query = await db.execute(
                select(Athlete.user_id).where(Athlete.id == athelete_id)
            )
            user_id = query.scalars().first()

            query = await db.execute(
                select(
                    User.id.label("user_id"),
                    User.name,
                    User.sirname,
                    User.fathername,
                    Athlete.country.label("country"),
                    Athlete.region.label("region"),
                    Athlete.city.label("city"),
                    Team.name.label("team"),
                    User.birthdate,
                    Athlete.weight.label("weight"),
                    CategoryType.name.label("grade"),
                    User.gender.label("gender"),
                    Athlete.image_field,
                )
                .join(Athlete, Athlete.user_id == User.id)
                .join(MatchParticipant)
                .join(Team, Team.id == MatchParticipant.team_id)
                .join(MatchCategory, MatchCategory.match_id == match)
                .join(
                    CategoryType,
                    CategoryType.id == MatchCategory.category_id
                )
                .where(User.id == user_id))
            users_info = query.mappings().all()

            result.append(users_info[0])

    return result



[
  {
    "user_id": 343
  },
  {
    "user_id": 343
  },
  {
    "user_id": 827
  },
  {
    "user_id": 605
  },
  {
    "user_id": 343
  },
  {
    "user_id": 343
  },
  {
    "user_id": 827
  },
  {
    "user_id": 827
  },
  {
    "user_id": 827
  },
  {
    "user_id": 923
  },
  {
    "user_id": 185
  },
  {
    "user_id": 251
  },
  {
    "user_id": 526
  },
  {
    "user_id": 343
  },
  {
    "user_id": 964
  },
  {
    "user_id": 961
  }
]
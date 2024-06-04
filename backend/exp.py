from match.utils import split_pairs


def create_pairs1(n):
    numbers = list(range(1, n + 1))
    half = n // 2
    group1 = numbers[:half]
    group2 = numbers[half:][::-1]
    pairs = [[group1[i], group2[i]] for i in range(half)]
    return pairs


def split_into_four_groups(pairs):
    group_a = []
    group_b = []
    group_c = []
    group_d = []
    for i, pair in enumerate(pairs):
        if i % 4 == 0:
            group_a.append(pair)
        elif i % 4 == 1:
            group_b.append(pair)
        elif i % 4 == 2:
            group_c.append(pair)
        else:
            group_d.append(pair)
    return group_a, group_b, group_c, group_d


users = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 0, 0, 0, 0, 0]

users_pairs = split_pairs(users)
print('------------------------------------------------')
for pair in users_pairs:
    print(pair)

# Пример использования
# pairs = create_pairs(32)
group_a, group_b, group_c, group_d = split_into_four_groups(users_pairs)
print("Group A:", group_a)
# for pair in group_a:
#     print(pair)
print("Group B:", group_b)
# for pair in group_b:
#     print(pair)
print("Group C:", group_c)
# for pair in group_c:
#     print(pair)
print("Group D:", group_d)
# for pair in group_d:
#     print(pair)
print('------------------------------------------------')

#users = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] 

#print(split_pairs(users))


def create_pairs(n):
    numbers = list(range(1, n + 1))
    half = n // 2
    group1 = numbers[:half]
    group2 = numbers[half:][::-1]
    pairs = [[group1[i], group2[i]] for i in range(half)]
    return pairs


def split_into_groups(pairs, num_groups):
    groups = [[] for _ in range(num_groups)]
    for i, pair in enumerate(pairs):
        groups[i % num_groups].append(pair)
    return groups


def get_num_groups(num_players):
    if num_players <= 8:
        return 1
    elif num_players <= 16:
        return 2
    elif num_players <= 32:
        return 4
    elif num_players <= 64:
        return 8
    elif num_players <= 128:
        return 16
    else:
        raise ValueError("Number of players exceeds the supported limit")


# Пример использования
num_players = 32
pairs = create_pairs(num_players)
num_groups = get_num_groups(num_players)
groups = split_into_groups(pairs, num_groups)

# Вывод результатов
for i, group in enumerate(groups):
    print(f"Group {i+1}:", group)






	"grid_info": {
"method": "Олимпийская",
"age_grade": 24
"sport_name": "Название спорта",
"weight_category": "Легкий",
 "gender": "Мужской"
},
"rounds": [
{
"name": "1/32",
"fights":[
{
    "fight_info": {
    "fight_id": 1,
    "mat_number": 3,
    "start_time": "2024-06-10T08:00:00",
  },
      "player_1":     {
      "player_id": 104,
      "first_name": "Степан",
      "last_name": "Степанов",
      "birthdate": ‘1995-10-23’,
      "team_name": "Яблоновские лоси",
      "team_id": 4,
      "points": 155 (это очки, набранные в этом матче)
    },
      "player_2":     {
      "player_id": 101,
      "first_name": "Иван",
      "last_name": "Богданов",
      "birthdate": ‘1995-10-23’,
      "team_name": "Яблоновские лоси",
      "team_id": 3,
      "points": 100
    },

},
{...}
]
}
]

@router.get("/tournament-grid/{match_id}")
async def get_grid(
    match_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = []
    query = await db.execute(
        select(
            Match.id,
            CombatType.name.label("method"),
            MatchAge.age_from,
            MatchAge.age_till,
            SportType.name.label("sport_name"),
            AllWeightClass.name.label("weight_category"),
            MatchGender.gender.label("gender"),
        )
        .join(CombatType, CombatType.id == Match.combat_type_id)
        .join(MatchAge, MatchAge.match_id == Match.id)
        .join(MatchSport, MatchSport.match_id == Match.id)
        .join(SportType, SportType.id == MatchSport.sport_id)
        .join(MatchWeights, MatchWeights.match_id == Match.id)
        .join(AllWeightClass, AllWeightClass.id == MatchWeights.weight_id)
        .join(MatchGender, MatchGender.match_id == Match.id)
        .where(Match.id == match_id)
    )
    grid_info = query.mappings().all()
    result.append(grid_info[0])

    rounds_info = {}
    query = await db.execute(
        select(Fight.player_one)
        .where(Fight.match_id == match_id)
    )
    players_one_ids = query.scalars().all()

    players_one_count = len(players_one_ids)
    query = await db.execute(
        select(Fight.player_two)
        .where(Fight.match_id == match_id)
    )
    players_two_ids = query.scalars().all()

    players_two_count = len(players_two_ids)
    name_round = round_name(players_one_count + players_two_count)
    rounds_info["name"] = name_round
    result.append(rounds_info)

    query = await db.execute(
        select(Fight.id)
        .where(Fight.match_id == match_id)
    )
    fights_ids = query.scalars().all()
    fight_info = []
    for fight_id in fights_ids:
        query = await db.execute(
            select(
                Fight.id,
                Fight.mat,
                Fight.start_datetime
                )
            .where(Fight.id == fight_id)
         )
        fight = query.mappings().all()
        fight_info.append(fight[0])
    rounds_info["fights"] = fight_info




    return result

дополни код под требования


for fight in fights:
        # Получаем информацию об игроке 1
        query = await db.execute(
            select(
                MatchParticipant.player_id.label("player_id"),
                User.name.label("first_name"),
                User.sirname.label("last_name"),
                User.birthdate,
                Team.name.label("team_name"),
                Team.id.label("team_id"),
            )
            .join(User, User.id == Athlete.user_id)
            .join(MatchParticipant, MatchParticipant.player_id == Athlete.id)
            .join(Team, Team.id == MatchParticipant.team_id)
            .where(Fight.id == fight.id)
            .where(Athlete.id == fight.player_one)
        )
        player_1 = query.mappings().first()
        print(player_1)

        



for fight in fights:
        # Получаем информацию об игроке 1
        query = await db.execute(
            select(
                MatchParticipant.id.label("player_id"),
                User.name.label("first_name"),
                User.sirname.label("last_name"),
                User.birthdate,
                Team.name.label("team_name"),
                Team.id.label("team_id"),
            )
            .select_from(Fight)
            .join(MatchParticipant, MatchParticipant.id == fight.player_one)
            .join(Athlete, Athlete.id == MatchParticipant.player_id)
            .join(User, User.id == Athlete.user_id)
            .join(Team, Team.id == MatchParticipant.team_id)
            .where(Fight.id == fight.id)
        )
        player_1 = query.mappings().all()

        print(player_1)

        fight_info = {
            "fight_info": {
                "fight_id": fight.id,
                "mat_number": fight.mat_number,
                "start_time": fight.start_time,
            },
            "player_1": {
                "player_id": player_1["player_id"],
                "first_name": player_1["first_name"],
                "last_name": player_1["last_name"],
                "birthdate": player_1["birthdate"],
                "team_name": player_1["team_name"],
                "team_id": player_1["team_id"],
                # "points": player_1["points"]
            },
        }

        rounds["fights"].append(fight_info)

 File "C:\1\ruchamp\backend\match\routers.py", line 308, in get_grid
    "player_id": player_1["player_id"],
TypeError: list indices must be integers or slices, not str
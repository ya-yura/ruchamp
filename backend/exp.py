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



@router.post("/all-next-round/{match_id}")
async def create_next_round(
    match_id: int,
    db: AsyncSession = Depends(get_db)
):
    while True:
        # Получаем текущий раунд
        query = await db.execute(
            select(func.max(Fight.round))
            .where(Fight.match_id == match_id)
        )
        current_round = query.scalars().first()

        if current_round is None:
            raise HTTPException(
                status_code=404, detail="No fights found for this match"
            )

        next_round = current_round + 1

        # Получаем победителей текущего раунда
        winner_alias = aliased(FightWinner)
        query = await db.execute(
            select(winner_alias.winner_id)
            .join(Fight, Fight.id == winner_alias.fight_id)
            .where(Fight.match_id == match_id)
            .where(Fight.round == current_round)
        )
        winners = query.scalars().all()

        if len(winners) == 1:
            # Если остался только один победитель, завершаем турнир
            final_winner = winners[0]
            return {"winner": final_winner}
        elif len(winners) == 2:
            # Если осталось два победителя, то это финал
            query = await db.execute(
                select(Match.mat_vol)
                .where(Match.id == match_id)
            )
            mat_vol = query.scalars().first()

            if mat_vol is None:
                raise HTTPException(status_code=404, detail="Match not found")

            final_fight = await create_fight(db, match_id, winners, next_round, mat_vol, 0)
            await db.commit()

            # Определяем проигравших финального боя
            query = await db.execute(
                select(FightWinner.winner_id)
                .where(FightWinner.fight_id == final_fight.id)
                .where(FightWinner.winner_score == 0)
            )
            losers = query.scalars().all()

            # Если есть два проигравших, создаем бой за третье место
            if len(losers) == 2:
                third_place_fight = await create_fight(db, match_id, losers, next_round, mat_vol, 1)
                await db.commit()
            else:
                third_place_fight = None

            return {
                "final_fight": final_fight.id,
                "third_place_fight": third_place_fight.id if third_place_fight else None
            }

        if len(winners) < 2:
            raise HTTPException(
                status_code=400, detail="Not enough players for the next round"
            )

        # Получаем количество матов
        query = await db.execute(
            select(Match.mat_vol)
            .where(Match.id == match_id)
        )
        mat_vol = query.scalars().first()

        if mat_vol is None:
            raise HTTPException(status_code=404, detail="Match not found")

        mat_counter = 0
        pairs = [
            (winners[i], winners[i + 1]) for i in range(0, len(winners), 2)
        ]

        for pair in pairs:
            fight = await create_fight(db, match_id, pair, next_round, mat_vol, mat_counter)
            mat_counter += 1
            await db.commit()


async def create_fight(db, match_id, pair, round_number, mat_vol, mat_counter):
    random_winner = random.choice(pair)
    random_loser = pair[0] if random_winner == pair[1] else pair[1]

    fight = Fight(
        match_id=match_id,
        player_one=pair[0],
        player_two=pair[1],
        start_datetime=func.now(),
        end_datetime=func.now() + timedelta(minutes=5),
        mat=(mat_counter % mat_vol) + 1,
        round=round_number,
    )
    db.add(fight)
    await db.commit()

    # Создаем записи о результатах боя
    winner_counter = FightCounter(
        fight_id=fight.id,
        player=random_winner,
        player_score='5',
        set_datetime=func.now(),
    )
    loser_counter = FightCounter(
        fight_id=fight.id,
        player=random_loser,
        player_score='0',
        set_datetime=func.now(),
    )
    db.add(winner_counter)
    db.add(loser_counter)

    winner = FightWinner(
        fight_id=fight.id,
        winner_id=random_winner,
        winner_score=5,
        loser_score=0
    )
    db.add(winner)

    return fight




# Стоимость билета на матч для зрителя
class Ticket(Base):
    __tablename__ = "Ticket"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id), nullable=False)
    price = Column(Float, nullable=False)

    # Билеты зрителей
class SpectatorTicket(Base):
    __tablename__ = "SpectatorTicket"
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(Match.id), nullable=False)
    spectator_id = Column(
        Integer, ForeignKey(Spectator.id), nullable=False
    )
    place_id = Column(Integer, ForeignKey(Place.id), nullable=False)
    status = Column(
        Enum(
            "available",
            "reserved",
            "paid",
            "used",
            "canceled",
            name="ticket_status"
        ),
        nullable=False,
        default="available"
    )
    uu_key = Column(String, nullable=True)


    # Заказ
class Order(Base):
    __tablename__ = "Order"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    status = Column(
        Enum("pending", "completed", "canceled", name="order_status"),
        nullable=False,
        default="pending"
    )



    # Перечень товаров заказа
class OrderItem(Base):
    __tablename__ = "OrderItem"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("Order.id"), nullable=False)

    # Может быть "merch", "courses", "engagement" или "ticket"
    product_type = Column(String, nullable=False)

    product_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)


    # Транзакции
class Transaction(Base):
    __tablename__ = "Transaction"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("Order.id"), nullable=False)
    payment_method = Column(String, nullable=False)
    transaction_date = Column(DateTime, default=datetime.utcnow)
    amount = Column(Float, nullable=False)
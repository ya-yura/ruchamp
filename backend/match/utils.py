import itertools
import random


def split_pairs(users):
    new_list = []
    group1 = []
    group2 = []
    # TODO оптимизировать
    if len(users) <= 2:
        for i in range(len(users), 2):
            users.append(0)
    elif len(users) <= 4:
        for i in range(len(users), 4):
            users.append(0)
    # до 8 участников
    elif len(users) <= 8:
        for i in range(len(users), 8):
            users.append(0)
    # до 16 участников
    elif len(users) > 8 and len(users) <= 16:
        for i in range(len(users), 16):
            users.append(0)
    # до 32 участников
    elif len(users) > 16 and len(users) <= 32:
        for i in range(len(users), 32):
            users.append(0)
    # до 64 участников
    elif len(users) > 32 and len(users) <= 64:
        for i in range(len(users), 64):
            users.append(0)
    # до 128 участников
    elif len(users) > 64 and len(users) <= 128:
        for i in range(len(users), 128):
            users.append(0)

    for i in range(0, len(users)):
        if i < len(users) / 2:
            group1.append(users[i])
        else:
            group2.append(users[i])

    group2.reverse()

    for i in range(0, len(group1)):
        new_list.append([group1[i], group2[i]])

    return new_list


def next_round(users):
    new_list = []
    group1 = []
    group2 = []
    for i in range(0, len(users)):
        if i % 2 == 0:
            group1.append(users[i])
        else:
            group2.append(users[i])

    for i in range(0, len(group1)):
        new_list.append([group1[i], group2[i]])

    return new_list


def pairs_generator(users):
    pairs = itertools.combinations(users, 2)
    return pairs


def num(num):
    users = []
    for i in range(1, num + 1):
        users.append(str(i))
    return users


'''athletes = num(32)
matchs = split_pairs(athletes)

print(f'Атлеты: {athletes}')
print(f'Пары: {matchs}')
print('-')

winners = []
los = []
for match in matchs:
    winer = str(random.choice(match))
    winners.append(winer)
    loser = match.index(winer)
    match.pop(loser)
    los.append(match.pop())
print(f'Победители 1 раунд : {winners}')
print(f'Проигравшие 1 раунд: {los}')
print('-')


matchs2 = next_round(winners)
print(f'Раунд 2 пары победители : {matchs2}')
los2 = next_round(los)
print(f'Раунд 2 пары проигравшие: {los2}')
print('-')

winners2 = []
los3 = []
for los_match in los2:
    los_match_win = random.choice(los_match)
    los3.append(los_match_win)

los2 = []
for match in matchs2:
    winer = str(random.choice(match))
    winners2.append(winer)
    loser = match.index(winer)
    match.pop(loser)
    los2.append(match.pop())
print(f'Победители 2 раунд                : {winners2}')
print('-')
print(f'Проигравшие 2 раунд из победителей: {los2}')

print(f'Победители 2 раунд из проигравших : {los3}')
pair = []
for i in range(0, len(los3)):
    pair.append([los3[i], los2[i]])

print('-')

matchs3 = next_round(winners2)
print(f'Раунд 3 пары победители  : {matchs3}')
print(f'Пары 3 раунд проигр 2 тур: {pair}')
los4 = []
for los_match in los3:
    los_match_win = random.choice(los_match)
    los4.append(los_match_win)
print('-')
matchs4 = next_round(los4)
print(f'Победители 3 раунд из проигравших : {los4}')
print(f'Пары - 4 раунд проигр 3 тур:        {matchs4}')
print('-')
los5 = [random.choice(los4)]
print(f'Победители 4 раунд из проигравших : {los5}')
win5 = [random.choice(winners2)]
print(f'Раунд 4  победители  : {win5}')
print('-')
win5.append(los5[0])
print(f'Пара для финала: {win5}')
winer = [random.choice(win5)]
print(f'Победитель финала: {winer}')'''


def round_name(players_count):
    if players_count == 0:
        return 'Нет боев'
    elif players_count == 2:
        return 'Бой за третье место'
    elif players_count == 4:
        return 'Полуфинал'
    elif players_count == 8:
        return '1/4'
    elif players_count == 16:
        return '1/8'
    elif players_count == 32:
        return '1/16'
    elif players_count == 64:
        return '1/32'
    else:
        players_count == 128
        return '1/64'
